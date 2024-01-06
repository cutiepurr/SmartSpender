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
import { validatedTransaction } from "../../utils/TransactionValidation";

const TransactionForm = ({
  formId,
  transaction,
  categories,
  submitCallback,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    amountSign: "-",
    category: undefined,
    timestamp: toDatetimeLocalInputDate(new Date()),
  });

  useEffect(() => {
    if (transaction !== null) {
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        amountSign: transaction.amount >= 0 ? "+" : "-",
        category: transaction.categoryID,
        timestamp: toDatetimeLocalInputDate(
          new Date(`${transaction.timestamp}.000Z`)
        ),
      });
    }
  }, [transaction, categories]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    let transaction = validatedTransaction(formData);
    submitCallback(transaction);
  };

  const FormInput = (props) => (
    <Input
      {...props}
      defaultValue={formData[props.name]}
      onChange={handleChange}
    />
  );

  const SelectFormInput = (props) => (
    <Input
      {...props}
      type="select"
      value={formData[props.name]}
      onChange={handleChange}
    >
      {props.children}
    </Input>
  );

  const description = (
    <FormInput name="description" placeholder="Description" type="text" />
  );

  const timestamp = <FormInput name="timestamp" type="datetime-local" />;

  const amount = (
    <Row>
      <Col xs={4} style={{ paddingRight: 5 }}>
        <SelectFormInput name="amountSign">
          <option value={"-"}>-</option>
          <option value={"+"}>+</option>
        </SelectFormInput>
      </Col>
      <Col xs={8} style={{ paddingLeft: 5 }}>
        <InputGroup>
          <InputGroupText>$</InputGroupText>
          <FormInput
            name="amount"
            placeholder="Amount"
            type="number"
            min="0.01"
            step="0.01"
          />
        </InputGroup>
      </Col>
    </Row>
  );

  const category = (
    <SelectFormInput name="category">
      <option value={null}> Uncategorised </option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </SelectFormInput>
  );

  return (
    <Form onSubmit={submit} id={formId} className="transaction-form">
      <TransactionTable
        transaction={{
          description: description,
          timestamp: timestamp,
          amount: amount,
          category: category,
          submit: <Button type="submit">+</Button>,
        }}
      />
    </Form>
  );
};

export { TransactionForm };
