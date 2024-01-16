import React from "react";
import { Button } from "reactstrap";
import TransactionApis from "../../api/TransactionApis";

interface props {
  selectedItems: Array<Number>;
  className?: string;
}

const Ribbon: React.FC<props> = ({ selectedItems, className }) => {
  const deleteTransactions = () => {
    TransactionApis.deleteTransactions(
      // @ts-ignore
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
        {/*<ImportTransactions className="ms-3" />*/}
    </div>
  );
};

export default Ribbon;
