import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = ({ transaction }) => {
  return (
    <Row className="my-3">
      <Col md={2}>
        <div>{transaction.timestamp}</div>
      </Col>
      <Col md={4}>
        <div>{transaction.description}</div>
      </Col>
      <Col md={2}>
        <div>{transaction.amount}</div>
      </Col>
      <Col md={2}>
        <div>{transaction.category}</div>
      </Col>
      <Col md={1}>
        <div>{transaction.submit}</div>
      </Col>
    </Row>
  );
};

export default TransactionTable;
