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
    const {
      user,
      toggleUser,
      userIsSelected
    } = this.props;

    return (
      <div
        key={String(user.id)}
        onClick={() => toggleUser(user)}
        className="container"
      >
        <img
          src={userIsSelected ? check : user.photo}
          className="image"
          alt="usericon"
        />
        <div className="text-container">
          <div className="name">
            {user.name}
          </div>
          <div className="street">
            {user.street}
          </div>
        </div>
      </div>
    );
  }
}
