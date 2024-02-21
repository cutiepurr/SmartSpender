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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="col-span-3">
              <div>{transaction.timestamp}</div>
            </div>
            <div className="col-span-4">
              <div>{transaction.description}</div>
            </div>
            <div className="col-span-2">
              <div>{transaction.amount}</div>
            </div>
            <div className="col-span-2">
              <div>{transaction.category}</div>
            </div>
            <div className="col-span-1">
              <div>{transaction.submit}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
