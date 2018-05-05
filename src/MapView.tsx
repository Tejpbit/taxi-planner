import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";
import {ClusterWithLegs} from "./Planner";
import {Location} from "./GoogleAddressConverter";

const { Map, InfoWindow, Marker } = require("google-maps-react");

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
  origin: Location;
};

export class MapView extends React.Component<Props> {


  onMarkerClicked = (e: Event) => {
    console.log(e);
  };

  render() {
    const { google, trips } = this.props;

    const markerData = _.flatMap(trips, (trip, i) =>
      trip.legs.map((leg, i2) => (
        <Marker
          key={`${i}${i2}`}
          title={`${i}`}
          position={{ lat: leg.end_location.lat(), lng: leg.end_location.lng() }}
          icon={{
            url: tilesPaths[i],
            scaledSize: new google.maps.Size(32, 40)
          }}
        />
      ))
    );

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
            <Marker position={this.props.origin.coordinate} />
          {markerData}
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


