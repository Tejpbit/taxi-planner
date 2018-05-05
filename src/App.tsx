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
const logo = require("./logo.svg");

type Props = {
  google: any;
};

type State = {
  addresses: Address[];
  selectedUsers: Address[];
  origin: google.maps.LatLng | null;
  hasSelected: boolean;
};

class AppComponent extends React.Component<Props, State> {
  state: State = {
    addresses: [],
    origin: new google.maps.LatLng(57.7089355, 11.9669514),
    selectedUsers: [],
    hasSelected: false
  };

  async componentDidMount() {
    const addresses = await getData();
    this.setState({
      addresses,
      selectedUsers: _.sampleSize(addresses, 6)
    });
  }

  handleSetOrigin = (origin: google.maps.LatLng) => {
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
            {(props: GACChildProps) => <Planner origin={origin} {...props} />}
          </GoogleAddressConverter>
        ) : (
          <IntroScreen
            google={google}
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
