import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "reactstrap";
import TransactionTable from "./TransactionTable";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";

const AddTransaction = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryApis.getCategories((data) => {
      setCategories(data);
    });
  }, []);

  const toSQLDate = (date) => date.toUTC().toISOString();

  const validatedInput = () => {
    var form = document.getElementById("createTransactionForm");
    var description = form.querySelector("input[name='description']").value;
    var amount = form.querySelector("input[name='amount']").value;
    var timestamp = form.querySelector("input[name='date']").value;

    if (
      description === null ||
      amount === null ||
      timestamp === null ||
      description === "" ||
      amount === "" ||
      timestamp === ""
    ) {
      alert("Field cannot be null");
      return null;
    }

    timestamp = new Date(timestamp);
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return null;
    }

    if (timestamp > new Date()) {
      alert("Date and time cannot be in the future");
      return null;
    }

    var transaction = {
      description: description,
      amount: parseInt(amount),
      timestamp: toSQLDate(timestamp),
    };

    return transaction;
  };

  const addTransaction = () => {
    var transaction = validatedInput();
    if (transaction == null) return;

    TransactionApis.postTransaction(transaction, () => {
      window.location.reload();
    });
  };

  const inputTable = {
    description: (
      <Input name="description" placeholder="Description" type="text" />
    ),
    date: <Input name="date" placeholder="Date" type="datetime-local" />,
    amount: <Input name="amount" placeholder="Amount" type="number" />,
    submit: <Button onClick={addTransaction}>+</Button>,
  };
  return (
    <Form id="createTransactionForm">
      <TransactionTable transaction={inputTable} />
    </Form>
  );
};

export default AddTransaction;
