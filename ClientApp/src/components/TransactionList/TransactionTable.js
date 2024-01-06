import React from "react";
import { Row, Col, Input } from "reactstrap";

const TransactionTable = (prop) => {
  const { transaction, isSelectable, className, onClick, onSelected } = prop;
  return (
    <div className={className}>
      <div className="m-1 p-2">
        {isSelectable == false ? null : (
          <Input
            type="checkbox"
            className="selectTransaction float-start"
            name={transaction.id}
            onChange={onSelected}
          />
        )}
        <div onClick={onClick}>
          <Row>
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
        </div>
      </div>
      {prop.children}
    </div>
  );
};

export default TransactionTable;
