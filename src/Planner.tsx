import * as React from "react";
import { MapView } from "./MapView";
import { Component } from "react";
import { Location } from "./GoogleAddressConverter";
import { Address } from "./lib/spreadsheet";
import _ = require("lodash");
import DirectionsResult = google.maps.DirectionsResult;
import DirectionsStatus = google.maps.DirectionsStatus;
import { getRouteFn } from "lib/google";
const uuidv4 = require("uuid/v4");
const kmeans = require("node-kmeans");

interface KMeansCluster {
  centroid: Number[];
  cluster: Number[][];
  clusterInd: Number[];
}

interface Derp {
  centroid: Number[];
  cluster: Location[];
}

interface Cluster extends Derp {
  id: any;
}

export interface ClusterWithLegs extends Cluster {
  legs: google.maps.DirectionsLeg[];
}

type State = {
  clusters: ClusterWithLegs[];
};

type Props = {
  google: any;
  origin: google.maps.LatLng;
  destinations: Location[];
};

export class Planner extends Component<Props, State> {
  state: State = {
    clusters: []
  };

  plan = () => {
    this.setState({ clusters: [] });

    const vectors = this.props.destinations.map(dest => [
      dest.coordinate.lat(),
      dest.coordinate.lng()
    ]);

    const locationMap: Map<string, Location> = new Map<string, Location>();
    this.props.destinations.forEach(d => {
      locationMap.set(`${d.coordinate.lat()}${d.coordinate.lng()}`, d);
    });

    kmeans.clusterize(
      vectors,
      { k: Math.ceil(vectors.length / 4) },
      (err: Error, res: KMeansCluster[]) => {
        if (err) console.error(err);
        else {
          res.forEach(currCluster => {
            if (currCluster.cluster.length <= 4) {
              this.clusterDone({
                centroid: currCluster.centroid,
                cluster: currCluster.cluster.map(p =>
                  locationMap.get(`${p[0]}${p[1]}`)
                )
              });
            } else {
              this.clusterMore(currCluster, locationMap);
            }
          });
        }
      }
    );
  };

  clusterMore = (
    cluster: KMeansCluster,
    locationMap: Map<string, Location>
  ) => {
    kmeans.clusterize(cluster, { k: 2 }, (err: Error, res: KMeansCluster[]) => {
      if (err) console.error(err);
      else {
        res.forEach(currCluster => {
          if (currCluster.cluster.length <= 4) {
            this.clusterDone({
              centroid: currCluster.centroid,
              cluster: currCluster.cluster.map(p =>
                locationMap.get(`${p[0]}${p[1]}`)
              )
            });
          } else {
            this.clusterMore(currCluster, locationMap);
          }
        });
      }
    });
  };

  clusterDone = (cluster: Derp) => {
    const origin = this.props.origin;
    const route = getRouteFn(this.props.google);
    const destination = _.head(cluster.cluster).coordinate;
    const waypoints = _.tail(cluster.cluster).map(c => ({
      location: c.coordinate,
      stopover: true
    }));
    const request = {
      travelMode: google.maps.TravelMode.DRIVING,
      origin,
      destination,
      waypoints,
      optimizeWaypoints: true
    };
    console.log("direction request", JSON.stringify(request));
    route(request).then(response => {
      this.routeCallback({ ...cluster, id: uuidv4() }, response);
    });
  };

  routeCallback = (cluster: Cluster, response: DirectionsResult) => {
    const legs = _.first(response.routes).legs;

    this.setState({
      clusters: [...this.state.clusters, { ...cluster, legs: legs }]
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.plan}>helo</button>
        <MapView
          google={this.props.google}
          origin={this.props.origin}
          trips={this.state.clusters}
        />
      </div>
    );
  }
}
