import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { injectGlobal } from "styled-components";

injectGlobal`
    body {
        font-family: Roboto;
    }
`;

ReactDOM.render(<App />, document.getElementById("root"));
