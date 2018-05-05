import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getData } from "./lib/spreadsheet";
import MapView from "./MapView";
import "dotenv";

class App extends Component {
  state = {
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
        <MapView addresses={addresses} />
      </div>
    );
  }
}

export default App;
