import React from "react";
import { Button } from "reactstrap";
import TransactionApis from "../../api/TransactionApis";

const Ribbon = ({ selectedItems, className }) => {
  const deleteTransactions = () => {
    TransactionApis.deleteTransactions(
      JSON.stringify(selectedItems),
      () => {
        window.location.reload();
      }
    );
  };

  return (
    <div className={`${className} p-3 border-bottom`}>
        <Button color="danger" onClick={deleteTransactions}>
          <i className="fa-solid fa-trash"></i>
        </Button>
    </div>
  );
};

export default Ribbon;
