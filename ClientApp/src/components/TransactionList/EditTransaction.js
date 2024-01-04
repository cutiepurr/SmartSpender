import React from "react";
import { TransactionForm } from "./TransactionForm";

const EditTransaction = ({ transaction, categories }) => {
  const formId = `editTransactionForm-${transaction.id}`;

  const editTransaction = (transaction) => {
    
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
