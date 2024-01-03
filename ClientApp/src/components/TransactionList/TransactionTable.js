import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = ({ transaction }) => {
  return (
    <Row>
      <Col md={5}>
        <div>{transaction.description}</div>
      </Col>
      <Col md={2}>
        <div>{transaction.date}</div>
      </Col>
      <Col md={2}>
        <div>{transaction.time}</div>
      </Col>
      <Col md={2}>
        <div>{transaction.amount}</div>
      </Col>
      <Col md={1}>
        <div>{transaction.submit}</div>
      </Col>
    </Row>
  );
};

export default TransactionTable;
