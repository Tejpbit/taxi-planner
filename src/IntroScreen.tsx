import * as React from "react";
import * as _ from "lodash";
import { Address } from "lib/spreadsheet";

type Props = {
  toggleUser: (user: Address) => any;
  selectedUsers: Address[];
  users: Address[];
};

export class IntroScreen extends React.Component<Props> {
  render() {
    return null;
  }
}
