import * as React from "react";
import * as _ from "lodash";
import {} from "@types/googlemaps";
import { colors } from "./lib/colors";

type Props = {
  map: any;
  google: any;
  index: number;
  directions: google.maps.DirectionsResult;
  visible: boolean;
};

export class Route extends React.Component<Props> {
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(props: Props) {
    super(props);
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  shouldComponentUpdate(nextprops: Props): boolean {
    return (
      nextprops.directions !== this.props.directions ||
      nextprops.visible !== this.props.visible
    );
  }

  componentWillUnmount() {
    this.directionsRenderer.setDirections({
      routes: [],
      geocoded_waypoints: []
    });
    this.directionsRenderer.setMap(null);
  }

  render(): null {
    const { directions, visible, index, map } = this.props;
    this.directionsRenderer.setOptions({
      directions,
      map,
      preserveViewport: true,
      markerOptions: {
        optimized: false,
        position: new google.maps.LatLng(0, 0),
        visible,
        icon: {
          scale: 0.3,
          strokeWeight: 1,
          fillOpacity: 1,
          fillColor: colors[index % colors.length],
          path:
            "M69.5,36.7c0.3,6.9-3.2,13.7-7.5,20.1C54.3,68,46.5,79.2,38.7,90.5c-2.1,3.1-5.4,3.3-7.5,0.4c-9-13-18.5-25.7-26.5-39.3 C-8.2,29.7,6.8,2.2,32.2,0.1C52.3-1.6,70.4,15.5,69.5,36.7z M34.9,20.1c-8.2,0-14.6,6.3-14.7,14.5c-0.1,8.2,6.3,14.8,14.6,14.9 c8,0.1,14.6-6.5,14.7-14.5C49.6,26.7,43.1,20.1,34.9,20.1z",
          anchor: new google.maps.Point(34.25, 92)
        },
        animation: google.maps.Animation.DROP
      },
      polylineOptions: {
        icons: [
          {
            repeat: "200px",
            fixedRotation: false,
            icon: {
              scale: 0.3,
              strokeWeight: 1,
              fillOpacity: 1,
              fillColor: colors[index % colors.length],
              strokeColor: "#000",
              path:
                "M19.7,63.8c0,2.1,0.1,4.1,0,6.1c-0.1,2.8-1.4,4.2-4.1,4.3c-2.5,0.1-5,0.1-7.5,0c-2.7-0.1-4-1.5-4.1-4.3 c0-1.1-0.1-2.2,0-3.2c0.1-2.9,0-5.6-2.2-8c-1.1-1.2-1.5-3.3-1.6-5.1c-0.3-2.9-0.2-5.8-0.1-8.7c0.1-3.9,2.1-6.7,5.3-8.8 c0.9-0.6,1.7-1.6,2-2.6c1-3.3,1.7-6.6,2.6-9.9c2.4-9.4,5.3-12,15.3-13.2c0-1.8-0.1-3.7,0-5.6C25.4,1.5,26.7,0.1,30,0 C37.5,0,45,0,52.5,0c3,0,4.4,1.5,4.5,4.5c0.1,1.9,0,3.8,0,5.9c0.8,0.1,1.4,0.2,2,0.2c6.1,0.4,10.7,3.9,12.4,9.8 c1.2,4.2,2.1,8.6,3.3,12.8c0.3,1.1,1.3,2.3,2.2,2.9c2.9,2,4.9,4.5,5.1,8.1c0.1,3.2,0.3,6.5-0.1,9.7c-0.3,2-1.5,3.9-2.3,5.9 c-0.5,1.3-1.3,2.6-1.4,4c-0.2,2.1,0,4.2-0.1,6.2c-0.1,2.5-1.3,3.9-3.8,4.1c-2.7,0.2-5.3,0.2-8,0c-2.5-0.1-3.7-1.6-3.8-4 c-0.1-2.1,0-4.1,0-6.4C48.3,63.8,34.2,63.8,19.7,63.8z M18,34.5c15.5,0,30.8,0,46.4,0c-1-3.9-1.8-7.7-3-11.4 c-0.3-0.9-1.8-1.9-2.8-1.9C47,21,35.4,21,23.8,21.2c-1,0-2.6,1.1-2.9,2C19.7,26.8,18.9,30.6,18,34.5z M14.6,44.4 c-3.5,0-6,2.5-6.1,5.9c0,3.5,2.7,6.2,6.1,6.2c3.3,0,6-2.8,6-6.1C20.6,47.1,18,44.5,14.6,44.4z M73.7,50.3c0-3.4-2.6-5.9-6.1-5.9 c-3.4,0-6,2.7-6,6c0,3.4,2.8,6.2,6.3,6.1C71.3,56.4,73.8,53.7,73.7,50.3z",
              anchor: new google.maps.Point(34.25, 92)
            }
          }
        ],
        geodesic: true,
        strokeColor: colors[index % colors.length],
        visible
      }
    });
    return null;
  }
}
