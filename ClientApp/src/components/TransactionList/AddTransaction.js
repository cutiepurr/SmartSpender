import React, { useEffect, useState } from "react";
import { Button, Form, Input, Row, Col } from "reactstrap";
import TransactionTable from "./TransactionTable";

const AddTransaction = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`/api/Category`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const toSQLDate = (date) => date.toISOString().slice(20);

  const addTransaction = (e) => {
    e.preventDefault();

    var form = document.getElementById("createTransactionForm");

    var date = form.querySelector("input[name='date']").value;
    var time = form.querySelector("input[name='time']").value;
    var transaction = {
      description: form.querySelector("input[name='description']").value,
      amount: parseInt(form.querySelector("input[name='amount']").value),
      timestamp: toSQLDate(new Date()),
    };
    console.log(transaction);
    fetch(`api/Transactions`, {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
    });
  };

  const inputTable = {
    description: (
      <Input name="description" placeholder="Description" type="text" />
    ),
    date: <Input name="date" placeholder="Date" type="date" />,
    time: <Input name="time" placeholder="Time" type="time" />,
    amount: <Input name="amount" placeholder="Amount" type="number" />,
    submit: <Button type="submit">+</Button>,
  };
  return (
    <Form onSubmit={addTransaction} id="createTransactionForm">
      <TransactionTable transaction={inputTable} />
    </Form>
  );
};

export default AddTransaction;
