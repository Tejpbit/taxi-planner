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
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  align-items: center;
  height: 50px;
  position: fixed;
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
          <div style={{ paddingLeft: "1em", height: "50%" }}>
            <img src={logo} style={{ height: "100%" }} />
          </div>
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
        <div style={{
          paddingTop: "50px"
        }}>
          <div>
            <Header>Where from?</Header>
            <div style={{
              display: "flex"
            }}>
              <input
                type="text"
                onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                  this.handleInput(event.currentTarget.value)
                }
                style={{
                  fontSize: "12pt",
                  padding: ".5em",
                  border: "1px #eee solid",
                  margin: ".5em",
                  flex: 1
                }}
                placeholder="Starting address"
                list="suggestions"
              />
              {origin &&
                <datalist id="suggestions">
                  <option value={origin.formatted_address} />
                </datalist>}
            </div>
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
