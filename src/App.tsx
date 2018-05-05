import * as React from "react";
import "./App.css";
import { getData, Address } from "./lib/spreadsheet";
import { MapView } from "./MapView";
import "dotenv";
import {
  GoogleAddressConverter,
  GACChildProps
} from "./GoogleAddressConverter";
const logo = require("./logo.svg");

type Props = {};

type State = {
  addresses: Address[];
};

export class App extends React.Component<Props, State> {
  state: State = {
    addresses: []
  };

  async componentDidMount() {
    const addresses = await getData();
    this.setState({
      addresses
    });
  }
  render() {
    const { addresses } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GoogleAddressConverter addresses={addresses}>
          {(props: GACChildProps) => <MapView {...props} />}
        </GoogleAddressConverter>
      </div>
    );
  }
}
