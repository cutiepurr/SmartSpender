import React, { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import TransactionTable from "./TransactionTable";
import { Button } from "reactstrap";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0); // page for loading transaction
  const [perLoad, setPerLoad] = useState(50); // number of transactions per page

  useEffect(() => {
    fetch(`/api/Transactions/count`)
      .then((response) => response.json())
      .then((data) => {
        setCount(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/Transactions?page=${page}&count=${perLoad}`)
      .then((response) => response.json())
      .then((data) => {
        if (data === null) return;
        setTransactions((transactions) => transactions.concat(data));
      });
  }, [page, perLoad]);

  const transactionItems = transactions.map((transaction) => (
    <TransactionTable
      key={transaction.id}
      transaction={{
        description: transaction.description,
        date: new Date(transaction.timestamp).toLocaleString(),
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
          amount: "Amount",
        }}
      />
    </strong>
  );

  const loadMoreTransactions = () => setPage((tmp) => (tmp = page + 1));

  return (
    <div>
      <h1>Transactions</h1>
      <AddTransaction />

      {transactionColumnTitle}
      {transactionItems}

      {count > (page + 1) * perLoad ? (
        <Button onClick={loadMoreTransactions}>Load more</Button>
      ) : null}
    </div>
  );
};

export default TransactionList;
