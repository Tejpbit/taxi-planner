import * as React from "react";
import "./App.css";
import { getData, Address } from "./lib/spreadsheet";
import { MapView } from "./MapView";
import "dotenv";
import {
  GoogleAddressConverter,
  GACChildProps
} from "./GoogleAddressConverter";
import { IntroScreen } from "IntroScreen";
const logo = require("./logo.svg");

type Props = {};

type State = {
  addresses: Address[];
  selectedUsers: Address[];
  hasSelected: boolean;
};

export class App extends React.Component<Props, State> {
  state: State = {
    addresses: [],
    selectedUsers: [],
    hasSelected: false
  };

  async componentDidMount() {
    const addresses = await getData();
    this.setState({
      addresses
    });
  }

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
    const { addresses, hasSelected, selectedUsers } = this.state;

    return (
      <div className="App">
        {hasSelected ? (
          <GoogleAddressConverter addresses={addresses}>
            {(props: GACChildProps) => <MapView {...props} />}
          </GoogleAddressConverter>
        ) : (
          <IntroScreen
            toggleUser={this.toggleUser}
            users={addresses}
            selectedUsers={selectedUsers}
          />
        )}
      </div>
    );
  }
}
