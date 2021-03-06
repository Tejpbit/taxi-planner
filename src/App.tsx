import * as React from "react";
import "./App.css";
import { getData, Address } from "./lib/spreadsheet";
import { Planner } from "./Planner";
import * as _ from "lodash";
const { GoogleApiWrapper } = require("google-maps-react");
import "dotenv";
import {
  GoogleAddressConverter,
  GACChildProps
} from "./GoogleAddressConverter";
import { IntroScreen } from "IntroScreen";
import { getAddress, getAddressForUser } from "lib/google";
const logo = require("./logo.svg");

type Props = {
  google: any;
};

type State = {
  addresses: Address[];
  selectedUsers: Address[];
  origin: google.maps.GeocoderResult | null;
  hasSelected: boolean;
};

class AppComponent extends React.Component<Props, State> {
  state: State = {
    addresses: [],
    origin: {
      formatted_address: "Stora Nygatan 31, Göteborg",
      geometry: { location: new google.maps.LatLng(57.7089355, 11.9669514) }
    } as google.maps.GeocoderResult,
    selectedUsers: [],
    hasSelected: false
  };

  async componentDidMount() {
    const addresses = await getData();
    this.setState({
      addresses,
      selectedUsers: _.sampleSize(addresses, 12)
    });
  }

  handleSetOrigin = (origin: google.maps.GeocoderResult) => {
    this.setState({ origin });
  };

  handleSetHasSelected = () => {
    if (this.state.origin && this.state.selectedUsers.length > 0) {
      this.setState({ hasSelected: true });
    }
  };

  toggleUser = (user: Address) => {
    this.setState(state => {
      if (state.selectedUsers.indexOf(user) !== -1) {
        return {
          selectedUsers: state.selectedUsers.filter(u => u.id !== user.id)
        };
      } else {
        getAddressForUser(this.props.google, user);
        return {
          selectedUsers: [...state.selectedUsers, user]
        };
      }
    });
  };

  render() {
    const { google } = this.props;
    const { addresses, hasSelected, origin, selectedUsers } = this.state;

    return (
      <div className="App">
        {hasSelected && origin ? (
          <GoogleAddressConverter google={google} addresses={selectedUsers}>
            {(props: GACChildProps) => (
              <Planner origin={origin.geometry.location} {...props} />
            )}
          </GoogleAddressConverter>
        ) : (
          <IntroScreen
            google={google}
            origin={origin}
            setOrigin={this.handleSetOrigin}
            onClickForwardButton={this.handleSetHasSelected}
            toggleUser={this.toggleUser}
            users={addresses}
            selectedUsers={selectedUsers}
          />
        )}
      </div>
    );
  }
}

export const App = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
})(AppComponent);
