import React from "react";
import { Button, Form, Input } from "reactstrap";
import TransactionTable from "./TransactionTable";
import TransactionApis from "../../api/TransactionApis";
import { validateTransaction } from "../../utils/TransactionValidation";

const AddTransaction = ({ categories }) => {
  const toSQLDate = (date) => date.toISOString();

  const validatedInput = () => {
    var form = document.getElementById("createTransactionForm");
    var description = form.querySelector("input[name='description']").value;
    var amount = form.querySelector("input[name='amount']").value;
    var timestamp = form.querySelector("input[name='date']").value;
    var category = form.querySelector("select[name='category']").value;

    let validation = validateTransaction({
      description: description,
      amount: amount,
      timestamp: timestamp,
      category: category,
    });

    if (!validation) return null;

    return {
      description: description,
      amount: parseInt(amount),
      timestamp: toSQLDate(new Date(timestamp)),
      categoryID: parseInt(category),
    };
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
    category: (
      <Input name="category" type="select">
        <option value={null}> Uncategorised </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Input>
    ),
  };
  
  return (
    <Form id="createTransactionForm">
      <TransactionTable transaction={inputTable} />
    </Form>
  );
};

export default AddTransaction;
