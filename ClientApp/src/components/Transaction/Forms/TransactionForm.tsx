import React, {useEffect, useState} from "react";
import {toDatetimeLocalInputDate} from "../../../utils/DateExtensions";
import {validatedTransaction,} from "../../../utils/TransactionValidation";
import {useFormik} from "formik";
import {apiToFormTransaction, ApiTransaction, formToApiTransaction, FormTransaction} from "../../../utils/Transaction";
import {useAuth0} from "@auth0/auth0-react";
import {CategoryItem} from "@/utils/Category";
import TransactionTable from "../TransactionTable";

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
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formData,
    onSubmit: (values, {setSubmitting}) => {
      setSubmitting(false);
      let transaction = validatedTransaction(values);
      if (transaction == null) return;

      let apiTransaction = formToApiTransaction(transaction);
      submitCallback(apiTransaction);
    }
  });

  useEffect(() => {
    if (transaction === null) return;

    let formTransaction = apiToFormTransaction(transaction);
    setFormData(formTransaction);
  }, [transaction, categories]);

  const description = (
    <input type="text" name="description" placeholder="Description"
           onChange={formik.handleChange} value={formik.values.description}
      // validate={Validation.description}
    />
  );

  const timestamp = (
    <input type="datetime-local" name="timestamp" onChange={formik.handleChange} value={formik.values.timestamp}
      // validate={Validation.date}
    />
  );

  const category = (
    <select name="categoryId" onChange={formik.handleChange} value={formik.values.categoryId}>
      {categories.map((c) => (
        <option key={c.categoryId} value={c.categoryId}>
          {c.name}
        </option>
      ))}
    </select>
  );

  const amount = (
    <div className="w-full flex flex-row">
      <select name="amountSign" onChange={formik.handleChange} value={formik.values.amountSign}>
        <option value={"-"}>-</option>
        <option value={"+"}>+</option>
      </select>
      <div>$</div>
      <input name="amount" placeholder="Amount" type="number" min="0.01" step="0.01"
             onChange={formik.handleChange} value={formik.values.amount}
        // validate={Validation.amount}
      />
    </div>
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <TransactionTable
        transaction={{
          description: description,
          timestamp: timestamp,
          amount: amount,
          category: category,
          submit: (
            <button type="submit" disabled={formik.isSubmitting}>
              <i className="fa-solid fa-floppy-disk"></i>
            </button>
          ),
        }}
      />
    </form>
  );
};

export {TransactionForm};
