import React, {useEffect, useState} from "react";
import TransactionApis from "../../../api/TransactionApis";
import { TransactionForm } from "./TransactionForm";
import {useAuth0} from "@auth0/auth0-react";

const AddTransaction = ({ categories }) => {
  const formId = "createTransactionForm";
  const { getAccessTokenSilently, user } = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, []);

  const addTransaction = (inputTransaction) => {
    if (inputTransaction == null) return;
    inputTransaction.email = user.email;

    TransactionApis.postTransaction(inputTransaction, token, () => {
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
