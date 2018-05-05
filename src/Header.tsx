import * as React from "react";
import "./Header.css";

type Props = {
  children: string;
};

export class Header extends React.Component<Props> {

  render() {
    const {
      children
    } = this.props;

    return (
      <div className="header">
        { children }
      </div>
    );
  }
}
