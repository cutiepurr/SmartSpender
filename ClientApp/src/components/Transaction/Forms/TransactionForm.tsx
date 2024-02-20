import React, {useEffect, useState} from "react";
import TransactionTable from "../TransactionTable";
import {toDatetimeLocalInputDate} from "../../../utils/DateExtensions";
import {validatedTransaction,} from "../../../utils/TransactionValidation";
import {Field, Formik, useField} from "formik";
import {apiToFormTransaction, ApiTransaction, formToApiTransaction, FormTransaction} from "../../../utils/Transaction";
import {useAuth0} from "@auth0/auth0-react";
import {CategoryItem} from "@/utils/Category";

interface props {
  transaction: ApiTransaction,
  categories: Array<CategoryItem>,
  submitCallback: Function,
}

const TransactionForm: React.FC<props> = ({transaction, categories, submitCallback}) => {
  const {user} = useAuth0();

  const blankFormTransaction: FormTransaction = {
    email: user?.email ?? "",
    description: "",
    amount: undefined,
    amountSign: "-",
    categoryId: "10",
    timestamp: toDatetimeLocalInputDate(new Date()),
  };

  const [formData, setFormData] = useState(blankFormTransaction);

  useEffect(() => {
    if (transaction === null) return;

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
      <FormSelect label="categoryId" name="categoryId">
        {categories.map((c) => (
          <option key={c.categoryId} value={c.categoryId}>
            {c.name}
          </option>
        ))}
      </FormSelect>
    );

    const amount = (
      <div className="w-full flex flex-row">
        <FormSelect label="amountSign" name="amountSign">
          <option value={"-"}>-</option>
          <option value={"+"}>+</option>
        </FormSelect>
        <div>$</div>
        <FormInput
          label="amount"
          name="amount"
          placeholder="Amount"
          type="number"
          min="0.01"
          step="0.01"
          // validate={Validation.amount}
        />
      </div>
    );

    return (
      <form onSubmit={handleSubmit}>
        <TransactionTable
          transaction={{
            description: description,
            timestamp: timestamp,
            amount: amount,
            category: category,
            submit: (
              <button type="submit" disabled={isSubmitting}>
                <i className="fa-solid fa-floppy-disk"></i>
              </button>
            ),
          }}
        />
      </form>
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
        submitCallback(apiTransaction);
      }}
    >
      {formik}
    </Formik>
  );
};

const FormSelect = ({label, ...props}) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    <>
      <select
        {...field}
        {...props}
        // @ts-ignore
        // invalid={meta.touched && meta.error}
      ></select>
      {meta.touched && meta.error ? (
        <div style={{zIndex: 1}} className="error">
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

const FormInput = ({label, ...props}) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    <>
      <input
        className="w-full"
        {...field}
        {...props}
        // @ts-ignore
        // invalid={meta.touched && meta.error}
      />
      {meta.touched && meta.error ? (
        <div style={{zIndex: 1}} className="error">
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export {TransactionForm};
