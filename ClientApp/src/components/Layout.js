import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { NavMenu } from "./NavMenu";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <Row className="vh-100">
        <Col md={3} className="bg-dark text-light">
          <NavMenu />
        </Col>
        <Col md={9}>
          <Container tag="main" className="pt-3">{this.props.children}</Container>
        </Col>
      </Row>
    );
  }
}
