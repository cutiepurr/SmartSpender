import React, { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`/api/Transactions`)
    .then(response => response.json())
    .then(data => {
        setTransactions(data);
    })
  }, []);

  const transactionItems = transactions.map(transaction => (
    <div key={ transaction.id }>
        <div>{ transaction.description }</div>
        <div>{ new Date(transaction.timestamp).toLocaleString() }</div>
        <div>{ transaction.amount }</div>
    </div>
  ));

  return (
    <div>
        <h1>Transactions</h1>
        { transactionItems }
        <AddTransaction />
    </div>
  );
};

export default TransactionList;
