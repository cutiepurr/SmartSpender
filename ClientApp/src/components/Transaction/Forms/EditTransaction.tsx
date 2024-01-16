import React, {useEffect, useState} from "react";
import { TransactionForm } from "./TransactionForm";
import TransactionApis from "../../../api/TransactionApis";
import {useAuth0} from "@auth0/auth0-react";
import {ApiTransaction} from "../../../utils/Transaction";
import {categoryItem} from "@/utils/Category";

interface props {
  transaction: ApiTransaction,
  categories: Array<categoryItem>,
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
      transaction={transaction}
      categories={categories}
      submitCallback={editTransaction}
    />
  );
};

export default EditTransaction;
