import * as React from "react";
import { MapView } from "./MapView"
import {Component} from "react";
import {Location} from "./GoogleAddressConverter";

const kmeans = require("node-kmeans");


interface KMeansCluster {
    centroid: any[];
    cluster: any;
    clusterInd: Number[];

}

interface Cluster extends KMeansCluster {
    id: any;
}

type State = {
  clusters: Cluster[]
  //clusters?: KMeansCluster[];

}

type Props = {
  google: any;
  origin: Location;
  destinations: Location[];
};

export class Planner extends Component<Props, State>{

  state: State = {
    clusters: []
  };

  componentDidUpdate() {
    /*
    * props = {destinations, carCount}
    * */
    const vectors = this.props.destinations.map(dest => [dest.coordinate.lat(), dest.coordinate.lng()]);
    kmeans.clusterize(vectors, { k: 2 }, (err: Error, res: KMeansCluster) => {
      if (err) console.error(err);
      else {
        console.log("%o", res);
        this.clusterDone(res);
      }
    });
  };

  clusterDone = (cluster: KMeansCluster) => {
    const google = this.props.google;
    const origin = this.props.origin;
    const service = new google.maps.DistanceMatrixService();

    console.log(cluster);
    /*
    cluster.cluster.forEach((cluster: KMeansCluster, index: Number) => {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: cluster.map(
              (pair: Number[]) => new google.maps.LatLng(pair[0], pair[1])
          ),
          travelMode: "DRIVING"
        },
        (
            response: google.maps.DistanceMatrixResponse,
            status: google.maps.DistanceMatrixStatus
        ) => this.distanceMatrixCallback({...cluster, id: index}, response, status)
      );

      }
    );
  */
  };

  distanceMatrixCallback = (
      cluster: Cluster,
      response: google.maps.DistanceMatrixResponse,
      status: google.maps.DistanceMatrixStatus
  ) => {
    this.setState({
      [cluster.id]: {...cluster, legs: [...response.originAddresses, ...response.destinationAddresses]}
    });
    console.log(response);
    console.log(status);
  };

  render() {
    return <MapView google={this.props.google} trips={{...this.state}}/>
  }
}
