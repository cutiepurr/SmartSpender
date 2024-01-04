import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = (prop) => {
  const { transaction, className, onClick } = prop;
  return (
    <div className={className} onClick={onClick}>
      <Row className="my-1 p-2">
        <Col md={2}>
          <div>{transaction.timestamp}</div>
        </Col>
        <Col md={3}>
          <div>{transaction.description}</div>
        </Col>
        <Col md={3}>
          <div>{transaction.amount}</div>
        </Col>
        <Col md={2}>
          <div>{transaction.category}</div>
        </Col>
        <Col md={1}>
          <div>{transaction.submit}</div>
        </Col>
      </Row>
      {prop.children}
    </div>
  );
};

export default TransactionTable;
