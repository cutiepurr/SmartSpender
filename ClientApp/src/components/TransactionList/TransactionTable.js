import React from "react";
import { Row, Col, Input } from "reactstrap";

const TransactionTable = (prop) => {
  const {
    transaction,
    isSelectable,
    className = "",
    onClick,
    onSelected,
  } = prop;
  return (
    <div className={`${className}`} style={{ height: 50 }}>
      <div className="py-2">
        <div
          className="float-start px-2 bg-white border-end"
          style={{ position: "sticky", left: 0, height: 50 }}
        >
          <Input
            type="checkbox"
            name={transaction.id}
            onChange={onSelected}
            style={{
              visibility: isSelectable == false ? "collapse" : "visible",
            }}
          />
        </div>
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
      {prop.children}
    </div>
  );
};

export default TransactionTable;
