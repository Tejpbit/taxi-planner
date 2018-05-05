import * as React from "react";
import * as _ from "lodash";
import { getAddress } from "./lib/google-geocode";
const { GoogleApiWrapper } = require("google-maps-react");

import {} from "@types/googlemaps";
import { Address } from "lib/spreadsheet";


export type Location = {
    address: Address;
    coordinate: google.maps.LatLng;
}

export type GACChildProps = {
    google: any;
    origin: Location;
    destinations: Location[];
};

type Props = {
  google: any;
  addresses: Address[];
  children: (props: GACChildProps) => any;
};

type State = {
  latlngs: google.maps.GeocoderResult[];
};

class GoogleAddressConverterComponent extends React.Component<Props, State> {
  state: State = {
    latlngs: []
  };

  async componentDidUpdate(prevProps: Props, prevState: State) {
    const { google, addresses } = this.props;

    if (addresses !== prevProps.addresses) {
      const latlngs = await Promise.all(
        _.take(addresses, 10).map(addr => getAddress(google, addr))
      );
      this.setState({
        latlngs
      });
    }
  }

  render() {
    const { latlngs } = this.state;
      const { google, children } = this.props;
      const destinations: Location[] = [];
      const origin: Location = {
        address: {
              street: "",
              name: "",
              area: ""
          },
          coordinate: new google.maps.LatLng(1,2)
      };
    return children({ google, destinations, origin });
  }
}

export const GoogleAddressConverter = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
})(GoogleAddressConverterComponent);
