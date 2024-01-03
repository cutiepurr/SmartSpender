import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "reactstrap";

const AddTransaction = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`/api/Category`)
    .then(response => response.json())
    .then(data => {
        setCategories(data);
    })
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
    console.log(transaction)
    fetch(`api/Transactions`, {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        console.log(response);
    })
  };

  return (
    <Form onSubmit={addTransaction} id="createTransactionForm">
        <Input name="description" placeholder="Description" type="text" />
        <Input name="date" placeholder="Date" type="date" />
        <Input name="time" placeholder="Time" type="time" />
        <Input name="amount" placeholder="Amount" type="number" />
        <Button type="submit">Add</Button>
    </Form>
  );
};

export default AddTransaction;
