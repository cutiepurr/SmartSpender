import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { NavMenu } from "./NavMenu";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <Row>
        <Col lg={2}>
          <NavMenu />
        </Col>
        <Col lg={10}>
          <Container tag="main" className="pt-3">{this.props.children}</Container>
        </Col>
      </Row>
    );
  }
}
