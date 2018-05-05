import * as React from "react";
import * as _ from "lodash";
import { Address } from "lib/spreadsheet";
import styled from "styled-components";
import { getAddress } from "lib/google-geocode";

const logo = require("./logo.svg");
const check = require("./check.svg");
const leftTriangle = require("./left-triangle.svg");

type Props = {
  google: any;
  onClickForwardButton: (a: any) => any;
  toggleUser: (user: Address) => any;
  selectedUsers: Address[];
  users: Address[];
  setOrigin: (origin: google.maps.LatLng) => any;
};

type State = {
  origin: null | google.maps.GeocoderResult;
};

const Topbar = styled.header`
  display: flex;
  flex-direction: row;
  flex: 1;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  height: 50px;
`;

const LeftDiv = styled.div`
  display: flex;
`;

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export class IntroScreen extends React.Component<Props, State> {
  state: State = {
    origin: null
  };
  searchGoogleMaps = async (input: string) => {
    const res = await getAddress(this.props.google, input);

    console.log(res);

    this.setState({
      origin: res
    });
    this.props.setOrigin(res.geometry.location);
  };

  handleInput = _.debounce(this.searchGoogleMaps, 400);

  render() {
    const {
      onClickForwardButton,
      selectedUsers,
      users,
      toggleUser
    } = this.props;

    const { origin } = this.state;

    const numberPeople = selectedUsers.length;

    return (
      <>
        <Topbar>
          <img src={logo} style={{ maxHeight: "100%", margin: "10px 0" }} />
          <LeftDiv>
            <img src={leftTriangle} />
            <CenterText
              onClick={onClickForwardButton}
              style={{
                backgroundColor: "#F8E71C",
                flex: 1,
                cursor: "pointer"
              }}
            >
              Get cabs for {numberPeople} >
            </CenterText>
          </LeftDiv>
        </Topbar>
        <div>
          <div>
            <div>Where from?</div>
            <input
              type="text"
              onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                this.handleInput(event.currentTarget.value)
              }
            />
            {origin && origin.formatted_address}
          </div>

          <div>
            <div>Who needs a ride?</div>
            {users.map(user => {
              const userIsSelected = selectedUsers.indexOf(user) !== -1;
              return (
                <div
                  key={String(user.id)}
                  onClick={() => toggleUser(user)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0"
                  }}
                >
                  <img
                    src={userIsSelected ? check : user.photo}
                    style={{
                      borderRadius: "50%",
                      height: 30,
                      width: 30,
                      margin: "0 10px"
                    }}
                    alt="usericon"
                  />
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "flex-start"
                    }}
                  >
                    <div
                      style={{
                        display: "flex"
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: "smaller",
                        color: "#9b9b9b"
                      }}
                    >
                      {user.street}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
