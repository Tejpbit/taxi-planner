import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { injectGlobal } from "styled-components";

injectGlobal`
    body {
        font-family: Roboto;
    }
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
`;

ReactDOM.render(<App />, document.getElementById("root"));
