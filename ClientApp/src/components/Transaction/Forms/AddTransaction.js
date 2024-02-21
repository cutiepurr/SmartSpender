import React, {useEffect, useState} from "react";
import TransactionApis from "../../../api/TransactionApis";
import { TransactionForm } from "./TransactionForm.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-hot-toast";

const AddTransaction = ({ categories }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  const addTransaction = (inputTransaction) => {
    if (inputTransaction == null) return;
    inputTransaction.email = user.email;

    TransactionApis.postTransaction(inputTransaction, token, () => {
      toast("Create transaction successfully");
      let date = new Date(inputTransaction.timestamp);
      window.location.href = `/transactions/${date.getFullYear()}/${date.getMonth()+1}`;
    });
  };

  return (
    <TransactionForm
      transaction={null}
      categories={categories}
      submitCallback={addTransaction}
    />
  );
};

export default AddTransaction;
