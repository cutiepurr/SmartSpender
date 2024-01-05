import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = (prop) => {
  const { transaction, className, onClick } = prop;
  return (
    <div className={className} onClick={onClick}>
      <Row className="m-1 p-2">
        <Col xs={2}>
          <div>{transaction.timestamp}</div>
        </Col>
        <Col xs={4}>
          <div>{transaction.description}</div>
        </Col>
        <Col xs={3}>
          <div>{transaction.amount}</div>
        </Col>
        <Col xs={2}>
          <div>{transaction.category}</div>
        </Col>
        <Col xs={1}>
          <div>{transaction.submit}</div>
        </Col>
      </Row>
      {prop.children}
    </div>
  );
};

export default TransactionTable;
