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
    <div>
        {{ transaction }}
    </div>
  ));

  return (
    <div>
        <h1>Transactions</h1>
        <AddTransaction />
    </div>
  );
};

export default TransactionList;
