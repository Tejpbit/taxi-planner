import * as React from "react";

import * as _ from "lodash";

type Props = {
  map?: any;
  google?: any;
  directions: google.maps.DirectionsResult[];
};

export class Directions extends React.Component<Props> {
  directionsRenderers: google.maps.DirectionsRenderer[];

  componentDidMount() {
    this.renderDirections();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.map !== prevProps.map ||
      this.props.directions !== prevProps.directions
    ) {
      if (this.directionsRenderers) {
        this.directionsRenderers.forEach(r => r.setMap(null));
      }
      this.renderDirections();
    }
  }

  componentWillUnmount() {
    if (this.directionsRenderers) {
      this.directionsRenderers.forEach(r => r.setMap(null));
    }
  }

  renderDirections(): any {
    const { map, google, directions } = this.props;

    if (!google) {
      return null;
    }

    const colors = [
      "rgb(229, 57, 53)",
      "rgb(216, 27, 96)",
      "rgb(142, 36, 170)",
      "rgb(94, 53, 177)",
      "rgb(57, 73, 171)",
      "rgb(30, 136, 229)",
      "rgb(3, 155, 229)",
      "rgb(0, 172, 193)",
      "rgb(0, 137, 123)",
      "rgb(67, 160, 71)",
      "rgb(124, 179, 66)",
      "rgb(192, 202, 51)",
      "rgb(253, 216, 53)",
      "rgb(255, 179, 0)",
      "rgb(251, 140, 0)",
      "rgb(244, 81, 30)",
      "rgb(109, 76, 65)",
      "rgb(117, 117, 117)",
      "rgb(84, 110, 122)"
    ];

    if (
      !directions ||
      !this.directionsRenderers ||
      directions.length != this.directionsRenderers.length
    ) {
      this.directionsRenderers = directions.map(
        (d, i) =>
          new google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: colors[i % colors.length]
            },
            markerOptions: {
              icon: {
                scale: 0.5,
                strokeWeight: 1,
                fillOpacity: 1,
                fillColor: colors[i % colors.length],
                path:
                  "M69.5,36.7c0.3,6.9-3.2,13.7-7.5,20.1C54.3,68,46.5,79.2,38.7,90.5c-2.1,3.1-5.4,3.3-7.5,0.4c-9-13-18.5-25.7-26.5-39.3 C-8.2,29.7,6.8,2.2,32.2,0.1C52.3-1.6,70.4,15.5,69.5,36.7z M34.9,20.1c-8.2,0-14.6,6.3-14.7,14.5c-0.1,8.2,6.3,14.8,14.6,14.9 c8,0.1,14.6-6.5,14.7-14.5C49.6,26.7,43.1,20.1,34.9,20.1z",
                anchor: new google.maps.Point(34.25, 92)
              },
              animation: google.maps.Animation.DROP
            }
          })
      );
    }

    _.zip(directions, this.directionsRenderers).map(d => {
      d[1].setDirections(d[0]);
      d[1].setMap(map);
    });
  }

  render(): any {
    return null;
  }
}
