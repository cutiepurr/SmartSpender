import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { NavMenu } from "./NavMenu";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div className="flex flex-col lg:flex-row lg:h-screen">
          <NavMenu className="basis-1/5 bg-slate-50" />
          <Container tag="main" className="basis-4/5">{this.props.children}</Container>
      </div>
    );
  }
}
