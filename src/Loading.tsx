import * as React from "react";
import "./Loading.css";

const taxi = require("./taxi.svg");

export class Loading extends React.Component {
  render() {
    return (
      <div className="loading-container">
        <img
          src={taxi}
          className="loading-icon"
          alt="loading"
        />
      </div>
    );
  }
}
