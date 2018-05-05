import * as React from "react";
import * as _ from "lodash";
import { Address } from "lib/spreadsheet";
import styled from "styled-components";
import { getAddress } from "lib/google";
import { Header } from "./Header";
import { User } from "./User";

const logo = require("./logo.svg");
const leftTriangle = require("./left-triangle.svg");

type Props = {
  google: any;
  origin: null | google.maps.GeocoderResult;
  onClickForwardButton: (a: any) => any;
  toggleUser: (user: Address) => any;
  selectedUsers: Address[];
  users: Address[];
  setOrigin: (origin: google.maps.GeocoderResult) => any;
};

const Topbar = styled.header`
  display: flex;
  flex-direction: row;
  flex: 1;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-left: 1em;
  position: relative;
`;

const LeftDiv = styled.div`
  display: flex;
`;

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export class IntroScreen extends React.Component<Props> {
  searchGoogleMaps = async (input: string) => {
    const res = await getAddress(this.props.google, input);
    this.props.setOrigin(res);
  };

  handleInput = _.debounce(this.searchGoogleMaps, 400);

  render() {
    const {
      onClickForwardButton,
      selectedUsers,
      users,
      toggleUser,
      origin
    } = this.props;

    const numberPeople = selectedUsers.length;

    return (
      <>
        <Topbar>
          <img src={logo} style={{ height: "50%" }} />
          <LeftDiv>
            <img src={leftTriangle} />
            <CenterText
              onClick={onClickForwardButton}
              style={{
                backgroundColor: "#F8E71C",
                flex: 1,
                padding: "0 1em",
                cursor: "pointer"
              }}
            >
              Get cabs for
              <span style={{
                fontWeight: "bold",
                padding: "0 .3em 0 .2em",
                fontSize: "larger"
              }}>
                {numberPeople}
              </span>
              ->
            </CenterText>
          </LeftDiv>
        </Topbar>
        <div>
          <div>
            <Header>Where from?</Header>
            <input
              type="text"
              onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                this.handleInput(event.currentTarget.value)
              }
            />
            {origin && origin.formatted_address}
          </div>

          <div>
            <Header>Who needs a ride?</Header>
            {users.map(user => {
              const userIsSelected = selectedUsers.indexOf(user) !== -1;
              return (
                <User
                  user={user}
                  toggleUser={toggleUser}
                  userIsSelected={userIsSelected}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
