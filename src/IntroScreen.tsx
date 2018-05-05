import * as React from "react";
import * as _ from "lodash";
import { Address } from "lib/spreadsheet";
import styled from "styled-components";
import { getAddress } from "lib/google";
import { Header } from "./Header";
import { User } from "./User";
import { Topbar } from "Topbar";

type Props = {
  google: any;
  origin: null | google.maps.GeocoderResult;
  onClickForwardButton: (a: any) => any;
  toggleUser: (user: Address) => any;
  selectedUsers: Address[];
  users: Address[];
  setOrigin: (origin: google.maps.GeocoderResult) => any;
};

const Input = styled.input`
  font-size: 12pt;
  padding: 0.5em;
  border: 1px #eee solid;
  margin: 0.2em 0.5em;
  flex: 1;
`;

const Bottombar = styled.div`
  background-color: #f4f8fb;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  padding: 0.5em 0;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  font-size: 12pt;
  padding: 0.5em;
  border: none;
  margin: 0.3em 0.5em 0;
  background-color: #f8e71c;
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
        <Topbar
          numberPeople={numberPeople}
          onClickForwardButton={onClickForwardButton}
        />
        <div
          style={{
            flex: 1,
            overflowY: "auto"
          }}
        >
          <div>
            <Header>Where from?</Header>
            <div
              style={{
                display: "flex",
                padding: ".6em 0"
              }}
            >
              <Input
                type="text"
                onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                  this.handleInput(event.currentTarget.value)
                }
                placeholder="Starting address"
                list="suggestions"
              />
              {origin && (
                <datalist id="suggestions">
                  <option value={origin.formatted_address} />
                </datalist>
              )}
            </div>
          </div>

          <div>
            <Header>Who needs a ride?</Header>
            {users.map(user => {
              const userIsSelected = selectedUsers.indexOf(user) !== -1;
              return (
                <User
                  key={String(user.id)}
                  user={user}
                  toggleUser={toggleUser}
                  userIsSelected={userIsSelected}
                />
              );
            })}
          </div>
        </div>
        <Bottombar>
          <Input type="text" placeholder="Address" />
          <Input type="text" placeholder="Name (optional)" />
          <Button>Add passenger</Button>
        </Bottombar>
      </>
    );
  }
}
