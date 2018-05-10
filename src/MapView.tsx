import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";
import { ClusterWithLegs } from "./Planner";
import { Directions } from "./Directions";
import styled from "styled-components";
import { TripList } from "TripList";

const { Map, Marker, Polyline } = require("google-maps-react");

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

  toggleRide = (routeIndex: number) => {
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

    return (
      <RowWithSidebar>
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
        <TripList toggleRide={this.toggleRide} disabledRouteIndexes={disabledRouteIndexes} trips={trips} />
      </RowWithSidebar>
    );
  }
}
