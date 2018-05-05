import * as React from "react";
import styled from "styled-components";

const logo = require("./logo.svg");
const leftTriangle = require("./left-triangle.svg");

const TopbarContainer = styled.header`
  display: flex;
  flex-direction: row;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  align-items: center;
  height: 50px;
  position: relative;
  width: 100%;
`;

const LeftDiv = styled.div`
  display: flex;
`;

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  onClickForwardButton: (a: any) => any;
  numberPeople: number;
};

export const Topbar = (props: Props) => (
  <TopbarContainer>
    <div style={{ paddingLeft: "1em", height: "50%" }}>
      <img src={logo} style={{ height: "100%" }} />
    </div>
    <LeftDiv>
      <img src={leftTriangle} />
      <CenterText
        onClick={props.onClickForwardButton}
        style={{
          backgroundColor: "#F8E71C",
          flex: 1,
          padding: "0 1em",
          cursor: "pointer"
        }}
      >
        Get cabs for
        <span
          style={{
            fontWeight: "bold",
            padding: "0 .3em 0 .2em",
            fontSize: "larger"
          }}
        >
          {props.numberPeople}
        </span>
        ->
      </CenterText>
    </LeftDiv>
  </TopbarContainer>
);
