import React, {useEffect, useState} from "react";
import TransactionTable from "../TransactionTable";
import {Button, Col, Form, FormFeedback, Input, InputGroup, InputGroupText, Row,} from "reactstrap";
import {toDatetimeLocalInputDate} from "../../../utils/DateExtensions";
import {validatedTransaction,} from "../../../utils/TransactionValidation";
import {Formik, useField} from "formik";
import {
  apiToFormTransaction,
  ApiTransaction,
  formToApiTransaction,
  FormTransaction
} from "../../../utils/Transaction";
import {useAuth0} from "@auth0/auth0-react";
import {categoryItem} from "@/utils/Category";

interface props {
  transaction: ApiTransaction,
  categories: Array<categoryItem>,
  submitCallback: Function,
}

const TransactionForm: React.FC<props> = ({transaction, categories, submitCallback}) => {
  const {user} = useAuth0();

  const blankFormTransaction: FormTransaction = {
    email: user?.email ?? "",
    description: "",
    amount: undefined,
    amountSign: "-",
    category: undefined,
    timestamp: toDatetimeLocalInputDate(new Date()),
  };

  const [formData, setFormData] = useState(blankFormTransaction);

  useEffect(() => {
    if (transaction == null) return;

    let formTransaction = apiToFormTransaction(transaction);
    setFormData(formTransaction);

  }, [transaction, categories]);

  const formik = ({handleSubmit, isSubmitting}) => {
    const description = (
      <FormInput
        label="description"
        type="text"
        name="description"
        placeholder="Description"
        // validate={Validation.description}
      />
    );

    const timestamp = (
      <FormInput
        label="timestamp"
        type="datetime-local"
        name="timestamp"
        // validate={Validation.date}
      />
    );

    const category = (
      <FormInput label="category" name="category" as="select" type="select">
        <option value={undefined} disabled> Uncategorised</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </FormInput>
    );

    const amount = (
      <Row>
        <Col xs={4} style={{paddingRight: 5}}>
          <FormInput label="amountSign" name="amountSign" as="select" type="select">
            <option value={"-"}>-</option>
            <option value={"+"}>+</option>
          </FormInput>
        </Col>
        <Col xs={8} style={{paddingLeft: 5}}>
          <InputGroup>
            <InputGroupText>$</InputGroupText>
            <UngroupedFormInput
              label="amount"
              name="amount"
              placeholder="Amount"
              type="number"
              min="0.01"
              step="0.01"
              // validate={Validation.amount}
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
      onSubmit={(values, {setSubmitting}) => {
        setSubmitting(false);
        let transaction = validatedTransaction(values);
        if (transaction == null) return;

        let apiTransaction = formToApiTransaction(transaction);
        console.log(apiTransaction);
        submitCallback(apiTransaction);
      }}
    >
      {formik}
    </Formik>
  );
};

const FormInput = ({label, ...props}) => {
  // @ts-ignore
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

const UngroupedFormInput = ({label, ...props}) => {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <Input
        // bsSize="sm"
        {...field}
        {...props}
        // @ts-ignore
        invalid={meta.touched && meta.error}
      />
      {meta.touched && meta.error ? (
        <FormFeedback style={{zIndex: 1}} className="error">
          {meta.error}
        </FormFeedback>
      ) : null}
    </>
  );
};

export {TransactionForm};
