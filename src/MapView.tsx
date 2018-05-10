import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";
import { ClusterWithLegs } from "./Planner";
import { Directions } from "./Directions";
import styled from "styled-components";
import { TripList } from "TripList";

const { Map, Marker, Polyline } = require("google-maps-react");

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

const RowWithSidebar = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
`;

type Props = {
  google: any;
  trips: ClusterWithLegs[];
  origin: google.maps.LatLng;
  directions: null | google.maps.DirectionsResult[];
};

type State = {
  disabledRouteIndexes: number[];
};

export class MapView extends React.Component<Props, State> {
  state: State = {
    disabledRouteIndexes: []
  };

  toggleRouteVisibility = (routeIndex: number) => {
    console.log("routeindex", routeIndex, this.state.disabledRouteIndexes);
    if (this.state.disabledRouteIndexes.indexOf(routeIndex) == -1) {
      console.log("Add", [...this.state.disabledRouteIndexes, routeIndex]);
      this.setState({
        disabledRouteIndexes: [...this.state.disabledRouteIndexes, routeIndex]
      });
    } else {
      console.log(
        "remove new:",
        this.state.disabledRouteIndexes.filter(i => i != routeIndex)
      );
      this.setState({
        disabledRouteIndexes: this.state.disabledRouteIndexes.filter(
          i => i != routeIndex
        )
      });
    }
  };

  render() {
    const { google, trips, origin, directions } = this.props;
    const { disabledRouteIndexes } = this.state;

    const activeRoutes = directions.map((dir, index) => {
      return (
        <button onClick={() => this.toggleRouteVisibility(index)}>
          {index}
        </button>
      );
    });

    return (
      <RowWithSidebar>
        {activeRoutes.map((ar, i) => (
          <div key={i} onClick={() => this.toggleRouteVisibility(i)}>
            {ar}
          </div>
        ))}
        <Map
          containerStyle={{ position: "relative", flex: 1 }}
          google={google}
          zoom={14}
          //onClick={this.onMapClicked}
          initialCenter={{ lat: origin.lat(), lng: origin.lng() }}
        >
          {directions && (
            <Directions
              directions={directions}
              disabledRouteIndexes={disabledRouteIndexes}
            />
          )}
        </Map>
        <TripList trips={trips} />
      </RowWithSidebar>
    );
  }
}
