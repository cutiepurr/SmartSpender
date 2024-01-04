import { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import { Button, Input, Form } from "reactstrap";

const TransactionForm = ({
  formId,
  transaction,
  categories,
  submitCallback,
}) => {
  const [inputTable, setInputTable] = useState({});

  useEffect(() => {
    setInputTable(TransactionInputTable(transaction, categories));
  }, [transaction, categories]);

  const getTransactionFromInputs = () => {
    let form = document.getElementById(formId);
    let description = form.querySelector("input[name='description']").value;
    let amount = form.querySelector("input[name='amount']").value;
    let timestamp = form.querySelector("input[name='date']").value;
    let category = form.querySelector("select[name='category']").value;

    return {
      description: description,
      amount: amount,
      timestamp: timestamp,
      categoryID: category,
    };
  };

  const submit = (e) => {
    e.preventDefault();
    let transaction = getTransactionFromInputs();
    submitCallback(transaction);
  };

  return (
    <Form onSubmit={submit} id={formId}>
      <TransactionTable transaction={inputTable} />
    </Form>
  );
};

const TransactionInputTable = (transaction, categories) => {
  return {
    description: (
      <Input
        name="description"
        placeholder="Description"
        type="text"
        defaultValue={transaction === null ? null : transaction.description}
      />
    ),
    timestamp: (
      <Input
        name="date"
        placeholder="Date"
        type="datetime-local"
        defaultValue={transaction === null ? null : transaction.timestamp}
      />
    ),
    amount: (
      <Input
        name="amount"
        placeholder="Amount"
        type="number"
        defaultValue={transaction === null ? null : transaction.amount}
      />
    ),
    submit: <Button type="submit">+</Button>,
    category: (
      <Input
        name="category"
        type="select"
        defaultValue={transaction === null ? null : transaction.categoryID}
      >
        <option value={null}> Uncategorised </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Input>
    ),
  };
};

export { TransactionForm };
