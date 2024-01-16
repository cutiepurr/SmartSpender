import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { NavMenu } from "./NavMenu";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div className="w-100 vh-100 d-flex flex-column flex-lg-row">
          <NavMenu className="bg-light" />
          <Container tag="main" className="pt-3">{this.props.children}</Container>
      </div>
    );
  }
}
