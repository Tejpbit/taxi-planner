import * as React from "react";
import { MapView } from "./MapView";
import { Component } from "react";
import { Location } from "./GoogleAddressConverter";
import { Address } from "./lib/spreadsheet";
import _ = require("lodash");
import DirectionsResult = google.maps.DirectionsResult;
import DirectionsStatus = google.maps.DirectionsStatus;
import { getRouteFn } from "lib/google";
import * as uuid from "uuid/v4";
import LatLng = google.maps.LatLng;

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
  responses: null | DirectionsResult[];
};

type Props = {
  google: any;
  origin: google.maps.LatLng;
  destinations: Location[];
};

export class Planner extends Component<Props, State> {
  state: State = {
    clusters: [],
    responses: []
  };

  componentDidMount() {
    const vectors = this.props.destinations.map(dest => [
      dest.coordinate.lat(),
      dest.coordinate.lng()
    ]);

    const locationMap: Map<string, Location> = new Map<string, Location>();
    this.props.destinations.forEach(d => {
      locationMap.set(`${d.coordinate.lat()}${d.coordinate.lng()}`, d);
    });

    console.log(vectors);

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
              console.log(currCluster, locationMap);
              this.clusterMore(currCluster, locationMap);
            }
          });
        }
      }
    );
  }

  clusterMore = (
    cluster: KMeansCluster,
    locationMap: Map<string, Location>
  ) => {
    kmeans.clusterize(
      cluster.cluster,
      { k: 2 },
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

  clusterDone = (cluster: Derp) => {
    const origin = this.props.origin;
    const service = new google.maps.DirectionsService();

    const route = getRouteFn(this.props.google);
    const destination = this.mostDistantPoint(origin, cluster.cluster);
    const waypoints = cluster.cluster
      .filter(val => val != destination)
      .map(c => ({
        location: c.coordinate,
        stopover: true
      }));

    const hasWaypoints = waypoints.length > 1;

    const request = {
      travelMode: google.maps.TravelMode.DRIVING,
      origin,
      destination: destination.coordinate,
      waypoints: waypoints.length > 0 ? waypoints : undefined,
      optimizeWaypoints: hasWaypoints
    };
    console.log(JSON.stringify(request, null, 2));
    route(request)
      .then(response => {
        this.routeCallback({ ...cluster, id: uuid() }, response);
      })
      .catch(error => {
        console.error(cluster, JSON.stringify(request, null, 2), error);
      });
  };

  mostDistantPoint = (origin: LatLng, cluster: Location[]): Location => {
    return _.reduce(
      cluster,
      (next, prev) =>
        this.distance(origin, next) > this.distance(origin, prev) ? next : prev,
      _.first(cluster)
    );
  };

  distance = (a: LatLng, b: Location): number => {
    const latDiff: number = Math.abs(a.lat() - b.coordinate.lat());
    const lngDiff: number = Math.abs(a.lng() - b.coordinate.lng());
    return latDiff + lngDiff;
  };

  routeCallback = (cluster: Cluster, response: DirectionsResult) => {
    const legs = _.first(response.routes).legs;

    this.setState({
      responses: [...this.state.responses, response],
      clusters: [...this.state.clusters, { ...cluster, legs: legs }]
    });
  };

  render() {
    return (
      <div>
        <MapView
          google={this.props.google}
          origin={this.props.origin}
          trips={this.state.clusters}
          directions={this.state.responses}
        />
      </div>
    );
  }
}
