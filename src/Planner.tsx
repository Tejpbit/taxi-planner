import * as React from "react";
import { MapView } from "./MapView"
import {Component} from "react";
import {Location} from "./GoogleAddressConverter";
import {Address} from "./lib/spreadsheet";
import _ = require("lodash");
import DirectionsResult = google.maps.DirectionsResult;
import DirectionsStatus = google.maps.DirectionsStatus;

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
  legs: google.maps.DirectionsLeg[]
}

type State = {
  clusters: ClusterWithLegs[]
}

type Props = {
  google: any;
  origin: Location;
  destinations: Location[];
};


const vectors = [
    [57.7089355, 11.9669514],
    [57.6877847, 11.9530877],
    [57.7041652, 11.9636228],
    [57.6827079, 11.9556896],
    [57.6783956, 11.9470382]
];

export class Planner extends Component<Props, State>{

  state: State = {
    clusters: []
  };

    plan = () => {
        this.setState({clusters: []});

        const vectors = this.props.destinations.map(dest => [dest.coordinate.lat(), dest.coordinate.lng()]);
        kmeans.clusterize(vectors, {k: 3}, (err: Error, res: KMeansCluster[]) => {

                if (err) console.error(err);
                else {
                    const locationMap: Map<string,Location> = new Map<string, Location>();
                    this.props.destinations.forEach(d => {
                        locationMap.set(`${d.coordinate.lat()}${d.coordinate.lng()}`, d)
                    });
                    this.clusterDone(res.map(({centroid, cluster, clusterInd}) => ({
                            centroid, cluster: cluster.map( p => locationMap.get(`${p[0]}${p[1]}`) )
                        })
                    ));
                }
            });
    };

  clusterDone = (clusters: Derp[]) => {
    const google = this.props.google;
    const origin = this.props.origin;
    const service = new google.maps.DirectionsService();

    clusters.forEach((cluster: Derp, index: Number) => {

        const destination = _.head(cluster.cluster).coordinate;
        const waypoints = _.tail(cluster.cluster).map(c => ({location: c.coordinate}));
      service.route({
          travelMode: "DRIVING",
          origin: origin.coordinate,
          destination,
          waypoints,
          optimizeWaypoints: true
      }, (resp: DirectionsResult, status: DirectionsStatus) => this.routeCallback({...cluster, id: index}, resp, status))

      }
    );

  };

  routeCallback = (
      cluster: Cluster,
      response: DirectionsResult,
      status: DirectionsStatus
  ) => {

    const legs = _.first(response.routes).legs;

    this.setState({
        clusters: [
            ...this.state.clusters,
            {...cluster, legs: legs}
        ]

    });
  };

  render() {
    return (<div>
          <button onClick={this.plan}>helo</button>
          <MapView google={this.props.google} origin={this.props.origin} trips={this.state.clusters}/>
      </div>)

  }
}
