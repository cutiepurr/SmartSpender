import React from "react";
import { Button, Input } from "reactstrap";
import TransactionApis from "../../api/TransactionApis";
import ImportTransactions from "./ImportTransactions";

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
    <div className={`${className} p-3 border-bottom d-flex flex-row-reverse`}>
        <Button color="danger" onClick={deleteTransactions} className="ms-3">
          <i className="fa-solid fa-trash"></i> Delete
        </Button>
        <ImportTransactions className="ms-3" />
    </div>
  );
};

export default Ribbon;
