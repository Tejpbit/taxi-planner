import React, { Component } from "react";
import { Map, InfoWindow, Marker } from "google-maps-react";
import _ from "lodash";
import kmeans from "node-kmeans";

const vectors = [
  [57.7089355, 11.9669514],
  [57.6877847, 11.9530877],
  [57.7041652, 11.9636228],
  [57.6827079, 11.9556896],
  [57.6783956, 11.9470382]
];

const tilesPaths = [
  require("./tiles/tiles000.png"),
  require("./tiles/tiles001.png"),
  require("./tiles/tiles002.png"),
  require("./tiles/tiles003.png"),
  require("./tiles/tiles004.png"),
  require("./tiles/tiles005.png"),
  require("./tiles/tiles006.png"),
  require("./tiles/tiles007.png"),
  require("./tiles/tiles008.png"),
  require("./tiles/tiles009.png"),
  require("./tiles/tiles010.png"),
  require("./tiles/tiles011.png")
];

export class MapView extends Component {
  state = {
    clusters: []
  };

  onMapClicked = e => {
    kmeans.clusterize(vectors, { k: 2 }, (err, res) => {
      if (err) console.error(err);
      else {
        this.setState({
          clusters: res
        });
        console.log("%o", res);
      }
    });
  };

  distanceMatrixCallback = (response, status) => {
    console.log(response);
    console.log(status);
  };

  newClustersSet = () => {
    const google = window.google;
    const origin = new google.maps.LatLng(57.6689928, 11.965793);
    const service = new google.maps.DistanceMatrixService();
    console.log("asdasd", this.state.clusters[0].cluster);
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: this.state.clusters[0].cluster.map(
          pair => new google.maps.LatLng(pair[0], pair[1])
        ),
        travelMode: "DRIVING"
      },
      this.distanceMatrixCallback
    );
  };

  onMapClicked = e => {
    kmeans.clusterize(vectors, { k: 2 }, (err, res) => {
      if (err) console.error(err);
      else {
        this.setState(
          {
            clusters: res
          },
          this.newClustersSet
        );
        console.log("%o", res);
      }
    });
  };

  onMarkerClicked = e => {
    console.log(e);
  };

  render() {
    const { clusters } = this.state;
    const { google, latlngs } = this.props;
    console.log(clusters);

    const markerData = _.flatMap(clusters, (cluster, i) =>
      cluster.cluster.map((coordPair, i2) => (
        <Marker
          key={`${i}${i2}`}
          title={`${i}`}
          position={{ lat: coordPair[0], lng: coordPair[1] }}
          icon={{
            url: tilesPaths[i],
            scaledSize: new google.maps.Size(32, 40)
          }}
        />
      ))
    );

    console.log("marker data: ", markerData);

    return (
      <div>
        <Map
          google={google}
          zoom={14}
          onClick={this.onMapClicked}
          initialCenter={{
            lat: 57.7089355,
            lng: 11.9669514
          }}
        >
          {markerData}
          {latlngs.map(latlng => (
            <Marker key={latlng.place_id} position={latlng.geometry.location} />
          ))}
        </Map>
        <InfoWindow onClose={this.onInfoWindowClose} visible={true}>
          <div>
            <h1>helo</h1>
          </div>
        </InfoWindow>
      </div>
    );
  }
}

/*


<Marker onClick={this.onMarkerClicked}
                  name={'Current location'} />

          <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
          </InfoWindow>


* */
