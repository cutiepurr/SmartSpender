import React, { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import TransactionTable from "./TransactionTable";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`/api/Transactions`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      });
  }, []);

  const transactionItems = transactions.map((transaction) => (
    <TransactionTable
      key={transaction.id}
      transaction={{
        description: transaction.description,
        date: new Date(transaction.timestamp).toLocaleDateString(),
        time: new Date(transaction.timestamp).toLocaleTimeString(),
        amount: `$${transaction.amount}`,
      }}
    />
  ));

  const transactionColumnTitle = (
    <strong>
      <TransactionTable
        transaction={{
          description: "Description",
          date: "Date",
          time: "Time",
          amount: "Amount",
        }}
      />
    </strong>
  );

  return (
    <div>
      <h1>Transactions</h1>
      <AddTransaction />

      {transactionColumnTitle}
      {transactionItems}
    </div>
  );
};

export default TransactionList;
