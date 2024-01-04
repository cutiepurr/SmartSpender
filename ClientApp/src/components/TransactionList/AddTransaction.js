import React from "react";
import TransactionApis from "../../api/TransactionApis";
import { validatedTransaction } from "../../utils/TransactionValidation";
import { TransactionForm } from "./TransactionForm";

const AddTransaction = ({ categories }) => {
  const formId = "createTransactionForm";

  const addTransaction = (inputTransaction) => {
    inputTransaction = validatedTransaction(inputTransaction);
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
    />
  );
};

export default AddTransaction;
