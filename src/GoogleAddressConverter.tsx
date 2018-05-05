import * as React from "react";
import * as _ from "lodash";
import { getAddress, getAddressForUser } from "./lib/google";
const { GoogleApiWrapper } = require("google-maps-react");

import {} from "@types/googlemaps";
import { Address } from "lib/spreadsheet";
import { load } from "google-maps";

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
  loading: boolean;
};

export class GoogleAddressConverter extends React.Component<Props, State> {
  state: State = {
    latlngs: [],
    loading: true
  };

  componentDidMount() {
    this.updateAddresses();
  }

  updateAddresses = async () => {
    const { google, addresses } = this.props;

    this.setState({
      loading: true
    });

    const latlngs = await Promise.all(
      addresses.map(addr =>
        getAddressForUser(google, addr).then(result => {
          return {
            address: addr,
            coordinate: result.geometry.location
          };
        })
      )
    );
    this.setState({
      latlngs,
      loading: false
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.addresses !== this.props.addresses) {
      this.updateAddresses();
    }
  }

  render() {
    const { latlngs, loading } = this.state;
    const { google, children } = this.props;
    if (loading) {
      return <div>Loading</div>;
    }
    return children({ google, destinations: latlngs });
  }
}
