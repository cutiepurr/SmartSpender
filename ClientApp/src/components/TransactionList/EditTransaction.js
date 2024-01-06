import React from "react";
import { TransactionForm } from "./TransactionForm";
import TransactionApis from "../../api/TransactionApis";

const EditTransaction = ({ transaction, categories }) => {
  const formId = `editTransactionForm-${transaction.id}`;

  const editTransaction = (inputTransaction) => {
    if (inputTransaction == null) return;

    inputTransaction.id = transaction.id;
    TransactionApis.putTransaction(inputTransaction, () => {
      window.location.reload();
    });
  };

  return (
    <TransactionForm
      formId={formId}
      transaction={transaction}
      categories={categories}
      submitCallback={editTransaction}
    />
  );
};

export default EditTransaction;
