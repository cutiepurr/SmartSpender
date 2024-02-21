import React, {useEffect, useState} from "react";
import { TransactionForm } from "./TransactionForm";
import TransactionApis from "../../../api/TransactionApis";
import {useAuth0} from "@auth0/auth0-react";
import {ApiTransaction} from "@/utils/Transaction";
import {CategoryItem} from "@/utils/Category";
import {toast} from "react-hot-toast";

interface props {
  transaction: ApiTransaction,
  categories: Array<CategoryItem>,
  onChanged: Function,
}
const EditTransaction: React.FC<props> = ({ transaction, categories, onChanged }) => {
  const { getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  const editTransaction = (inputTransaction: ApiTransaction) => {
    if (inputTransaction == null) return;

    TransactionApis.putTransaction(inputTransaction, token, () => {
      toast.success("Edit transaction successfully!");
      let newDate = new Date(inputTransaction.timestamp);
      let oldDate = new Date(transaction.timestamp);
      if (newDate.getFullYear() !== oldDate.getFullYear() || newDate.getMonth() !== oldDate.getMonth()) {
        window.location.href = `/transactions/${newDate.getFullYear()}/${newDate.getMonth() + 1}`;
      } else {
        onChanged();
      }
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
