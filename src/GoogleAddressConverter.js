import React, { Component } from "react";
import _ from "lodash";
import { getAddress } from "./lib/google-geocode";
import { GoogleApiWrapper } from "google-maps-react";

class GoogleAddressConverterComponent extends Component {
  state = {
    latlngs: []
  };

  async componentDidUpdate(prevProps, prevState) {
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
    const { google, children, addresses } = this.props;
    return children({ google, addresses, latlngs });
  }
}

export const GoogleAddressConverter = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
})(GoogleAddressConverterComponent);
