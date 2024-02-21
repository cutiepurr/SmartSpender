import React from "react";
import { Row, Col } from "reactstrap";

const TransactionTable = ({transaction, ...props}) => {
  return (
    <div style={{ minHeight: 50 }} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 py-2">
        <div className="col-span-3">
          {transaction.timestamp}
        </div>
        <div className="col-span-4">
          {transaction.description}
        </div>
        <div className="col-span-2">
          {transaction.amount}
        </div>
        <div className="col-span-2">
          {transaction.category}
        </div>
        <div className="col-span-1">
          {transaction.submit}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
