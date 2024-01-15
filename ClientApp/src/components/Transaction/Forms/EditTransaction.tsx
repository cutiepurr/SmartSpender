import React, {useEffect, useState} from "react";
// @ts-ignore
import { TransactionForm } from "./TransactionForm.tsx";
import TransactionApis from "../../../api/TransactionApis";
import {useAuth0} from "@auth0/auth0-react";
import {ApiTransaction} from "../../../utils/Transaction";

interface props {
  transaction: ApiTransaction,
  categories: Array<object>,
}
const EditTransaction: React.FC<props> = ({ transaction, categories }) => {
  const formId = `editTransactionForm-${transaction.id}`;
  const { getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, []);

  const editTransaction = (inputTransaction: ApiTransaction) => {
    if (inputTransaction == null) return;

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
