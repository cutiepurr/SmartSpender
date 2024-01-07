import { useEffect, useState } from "react";
import TransactionTable from "../TransactionTable";
import {
  Button,
  Input,
  Form,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { toDatetimeLocalInputDate } from "../../../utils/DateExtensions";
import {
  Validation,
  validatedTransaction,
} from "../../../utils/TransactionValidation";
import { Formik, useField } from "formik";

const TransactionForm = ({ transaction, categories, submitCallback }) => {
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

  const formik = ({ handleSubmit, isSubmitting }) => {
    const description = (
      <FormInput
        type="text"
        name="description"
        placeholder="Description"
        validate={Validation.description}
      />
    );

    const timestamp = (
      <FormInput
        type="datetime-local"
        name="timestamp"
        validate={Validation.date}
      />
    );

    const category = (
      <FormInput name="category" as="select" type="select">
        <option value={null}> Uncategorised </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </FormInput>
    );

    const amount = (
      <Row>
        <Col xs={4} style={{ paddingRight: 5 }}>
          <FormInput name="amountSign" as="select" type="select">
            <option value={"-"}>-</option>
            <option value={"+"}>+</option>
          </FormInput>
        </Col>
        <Col xs={8} style={{ paddingLeft: 5 }}>
          <InputGroup>
            <InputGroupText>$</InputGroupText>
            <UngroupedFormInput
              name="amount"
              placeholder="Amount"
              type="number"
              min="0.01"
              step="0.01"
              validate={Validation.amount}
            />
          </InputGroup>
        </Col>
      </Row>
    );

    return (
      <Form onSubmit={handleSubmit}>
        <TransactionTable
          transaction={{
            description: description,
            timestamp: timestamp,
            amount: amount,
            category: category,
            submit: (
              <Button type="submit" size="sm" outline disabled={isSubmitting}>
                <i className="fa-solid fa-floppy-disk"></i>
              </Button>
            ),
          }}
        />
      </Form>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={formData}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
        let transaction = validatedTransaction(values);
        submitCallback(transaction);
      }}
    >
      {formik}
    </Formik>
  );
};

const FormInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <InputGroup>
        {UngroupedFormInput({
          label: label,
          ...props,
        })}
      </InputGroup>
    </>
  );
};

const UngroupedFormInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <Input
        // bsSize="sm"
        {...field}
        {...props}
        invalid={meta.touched && meta.error}
      />
      {meta.touched && meta.error ? (
        <FormFeedback style={{ zIndex: 1 }} className="error">
          {meta.error}
        </FormFeedback>
      ) : null}
    </>
  );
};

export { TransactionForm };
