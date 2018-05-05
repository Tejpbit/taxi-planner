import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";
import { ClusterWithLegs } from "./Planner";
import {Directions} from "./Directions";

const { Map, InfoWindow, Marker, Polyline } = require("google-maps-react");

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

type Props = {
  google: any;
  trips: ClusterWithLegs[];
  origin: google.maps.LatLng;
  directions: null | google.maps.DirectionsResult[];
};

export class MapView extends React.Component<Props> {
  onMarkerClicked = (e: Event) => {
    console.log(e);
  };

  render() {
    const { google, trips, origin, directions } = this.props;

    return (
      <div>
        <Map
          google={google}
          zoom={14}
          //onClick={this.onMapClicked}
          initialCenter={{lat: origin.lat(), lng: origin.lng()}}
        >
          <Marker position={{lat: origin.lat(), lng: origin.lng()}} />
          {directions && <Directions directions={directions}/>}
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
