import { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import {
  Button,
  Input,
  Form,
  InputGroup,
  InputGroupText,
  Row,
  Col,
} from "reactstrap";
import { toDatetimeLocalInputDate } from "../../utils/DateExtensions";

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
    let amountSign = form.querySelector("select[name='amount-sign']").value;
    let timestamp = form.querySelector("input[name='date']").value;
    let category = form.querySelector("select[name='category']").value;

    return {
      description: description,
      amount: amount,
      timestamp: timestamp,
      categoryID: category,
      amountSign: amountSign,
    };
  };

  const submit = (e) => {
    e.preventDefault();
    let transaction = getTransactionFromInputs();
    submitCallback(transaction);
  };

  return (
    <Form onSubmit={submit} id={formId} className="transaction-form">
      <TransactionTable transaction={inputTable} />
    </Form>
  );
};

const TransactionInputTable = (transaction, categories) => {
  let defaultTimestamp =
    transaction === null
      ? null
      : toDatetimeLocalInputDate(new Date(`${transaction.timestamp}.000Z`));
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
        defaultValue={defaultTimestamp}
      />
    ),
    amount: (
      <Row>
        <Col md={4} style={{ paddingRight: 5 }}>
          <Input name="amount-sign" type="select" defaultValue={"-"}>
            <option value={"-"}>-</option>
            <option value={"+"}>+</option>
          </Input>
        </Col>
        <Col md={8} style={{ paddingLeft: 5 }}>
          <InputGroup>
            <InputGroupText>$</InputGroupText>
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={transaction === null ? null : transaction.amount}
            />
          </InputGroup>
        </Col>
      </Row>
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
