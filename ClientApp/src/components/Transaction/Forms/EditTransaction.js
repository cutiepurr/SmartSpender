import React, {useEffect, useState} from "react";
import { TransactionForm } from "./TransactionForm";
import TransactionApis from "../../../api/TransactionApis";
import {useAuth0} from "@auth0/auth0-react";

const EditTransaction = ({ transaction, categories }) => {
  const formId = `editTransactionForm-${transaction.id}`;
  const { getAccessTokenSilently, user} = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, []);

  const editTransaction = (inputTransaction) => {
    if (inputTransaction == null) return;

    inputTransaction.id = transaction.id;
    inputTransaction.email = user.email;
    
    TransactionApis.putTransaction(inputTransaction, token, () => {
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
