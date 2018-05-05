import * as React from "react";
import * as _ from "lodash";
import { getAddress } from "./lib/google";
const { GoogleApiWrapper } = require("google-maps-react");

import {} from "@types/googlemaps";
import { Address } from "lib/spreadsheet";

export type Location = {
  address: Address;
  coordinate: google.maps.LatLng;
};

export type GACChildProps = {
  google: any;
  destinations: Location[];
};

type Props = {
  google: any;
  addresses: Address[];
  children: (props: GACChildProps) => any;
};

type State = {
  latlngs: Location[];
};

export class GoogleAddressConverter extends React.Component<Props, State> {
  state: State = {
    latlngs: []
  };

  async componentDidMount() {
    const { google, addresses } = this.props;

    const latlngs = await Promise.all(
      addresses.map(addr =>
        getAddress(google, `${addr.street}, ${addr.area}`).then(result => {
          return {
            address: addr,
            coordinate: result.geometry.location
          };
        })
      )
    );
    this.setState({
      latlngs
    });
  }

  render() {
    const { latlngs } = this.state;
    const { google, children } = this.props;
    return children({ google, destinations: latlngs });
  }
}
