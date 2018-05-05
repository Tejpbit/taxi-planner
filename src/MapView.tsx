import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";

const { Map, InfoWindow, Marker } = require("google-maps-react");
const kmeans = require("node-kmeans");

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

type Cluster = any;

type Props = {
  google: any;
  trips: {[$key: string]: Cluster};
};

export class MapView extends React.Component<Props> {

  distanceMatrixCallback = (
    response: google.maps.DistanceMatrixResponse,
    status: google.maps.DistanceMatrixStatus
  ) => {
    console.log(response);
    console.log(status);
  };

  /*
  onMapClicked = (e: Event) => {
    kmeans.clusterize(vectors, { k: 2 }, (err: Error, res: Cluster[]) => {
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
*/

  onMarkerClicked = (e: Event) => {
    console.log(e);
  };

  render() {
    const { google, trips } = this.props;
    console.log("helo", trips);
    const clusters: any[] = [];
    const latlngs: any[] = [];


    const markerData = _.flatMap(clusters, (cluster, i) =>
      cluster.cluster.map((coordPair: Number[], i2: Number) => (
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
          //onClick={this.onMapClicked}
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
        <InfoWindow visible={true}>
          <div>
            <h1>helo</h1>
          </div>
        </InfoWindow>
      </div>
    );
  }
}


