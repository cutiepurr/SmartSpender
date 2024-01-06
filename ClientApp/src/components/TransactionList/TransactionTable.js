import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = (prop) => {
  const {
    transaction,
    className = "",
    onClick,
  } = prop;
  return (
    <div className={`${className}`} style={{ minHeight: 50 }}>
      <div className="py-2">
        <div onClick={onClick}>
          <Row>
            <Col xs={3}>
              <div>{transaction.timestamp}</div>
            </Col>
            <Col xs={4}>
              <div>{transaction.description}</div>
            </Col>
            <Col xs={2}>
              <div>{transaction.amount}</div>
            </Col>
            <Col xs={2}>
              <div>{transaction.category}</div>
            </Col>
            <Col xs={1}>
              <div>{transaction.submit}</div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
