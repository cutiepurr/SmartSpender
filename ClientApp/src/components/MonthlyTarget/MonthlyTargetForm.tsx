import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useFormik} from "formik";

interface prop {
  target: MonthlyTarget | null,
  isDisabled: boolean,
  onChanged: Function,
  submitCallback: Function
}

const MonthlyTargetForm: React.FC<prop> = ({target, isDisabled, onChanged, submitCallback}) => {
  const {user} = useAuth0();
  const defaultTarget: MonthlyTarget = {
    id: undefined,
    email: user?.email ?? "",
    amount: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    until: ""
  };

  const [formData, setFormData] = useState(defaultTarget);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formData,
    onSubmit: (values, {setSubmitting}) => {
      setSubmitting(false);
      submitCallback(values);
    }
  });

  useEffect(() => {
    if (target !== null) setFormData(target);
  }, [target]);

  useEffect(() => formik.resetForm(), [isDisabled]);

  return (
    <tr>
      <td className="border-b p-3">
        <input name="month" min={1} max={12} type="number" className="w-13"
               disabled={isDisabled} onChange={formik.handleChange} value={formik.values.month}/>/
        <input name="year" type="number" className="w-20" disabled={isDisabled} onChange={formik.handleChange}
               value={formik.values.year}/>
      </td>
      <td className="border-b p-3">
        $<input name="amount" type="number" disabled={isDisabled}
                onChange={formik.handleChange} value={formik.values.amount}/>
      </td>
      <td className="border-b p-3">
        {
          isDisabled
            ? <button onClick={() => onChanged()}>Edit</button>
            : <button type="button" onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting}>Save</button>
        }
      </td>
    </tr>
  );
}

export default MonthlyTargetForm;