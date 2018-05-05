import * as React from "react";
import "./User.css";
import { Address } from "lib/spreadsheet";

const check = require("./check.svg");

type Props = {
  user: Address;
  toggleUser: (user: Address) => any;
  userIsSelected: boolean;
};

export class User extends React.Component<Props> {
  render() {
    const { user, toggleUser, userIsSelected } = this.props;

    return (
      <div onClick={() => toggleUser(user)} className="user-container">
        <img
          src={userIsSelected ? check : user.photo}
          className="user-image"
          alt="usericon"
        />
        <div className="user-text">
          <div className="user-name">{user.name}</div>
          <div className="user-street">{user.street}</div>
        </div>
      </div>
    );
  }
}
