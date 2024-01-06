import React from "react";
import TransactionApis from "../../api/TransactionApis";
import { TransactionForm } from "./TransactionForm";

const AddTransaction = ({ categories }) => {
  const formId = "createTransactionForm";

  const addTransaction = (inputTransaction) => {
    if (inputTransaction == null) return;

    TransactionApis.postTransaction(inputTransaction, () => {
      window.location.reload();
    });
  };

  return (
    <TransactionForm
      formId={formId}
      transaction={null}
      categories={categories}
      submitCallback={addTransaction}
      isSelectable={false}
    />
  );
};

export default AddTransaction;
