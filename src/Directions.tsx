import * as React from "react";

import { Route } from "./Route";

type Props = {
  map?: any;
  google?: any;
  directions: google.maps.DirectionsResult[];
  disabledRouteIndexes: number[];
};

export class Directions extends React.Component<Props> {
  directionsRenderers: google.maps.DirectionsRenderer[];

  componentWillUpdate(props: Props) {
      let myoverlay = new props.google.maps.OverlayView();
      myoverlay.draw = function() {
          console.log("helo3");
          this.getPanes().markerLayer.id = "markerLayer";
      };
      console.log("propsmap", props.map);
      myoverlay.setMap(props.map);
  }

  componentWillUnmount() {
    if (this.directionsRenderers) {
      this.directionsRenderers.forEach(r => r.setMap(null));
    }
  }

  render() {
    const { map, google, directions, disabledRouteIndexes } = this.props;
    return directions.map((d, i) => (
      <Route
        key={d.routes[0].overview_polyline}
        map={map}
        google={google}
        directions={d}
        index={i}
        visible={!disabledRouteIndexes.includes(i)}
      />
    ));
  }
}
