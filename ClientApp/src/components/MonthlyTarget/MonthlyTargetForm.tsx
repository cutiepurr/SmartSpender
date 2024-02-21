import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Field, Formik} from "formik";

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

  useEffect(() => {
    if (target !== null) setFormData(target);
  }, [target]);

  return (
    <Formik
      enableReinitialize initialValues={formData}
      onSubmit={(values, {setSubmitting}) => {
        setSubmitting(false);
        submitCallback(values);
      }}
    >
      {({handleSubmit, isSubmitting}) =>
        <tr>
          <td className="border-b p-3">
            <Field name="month" min={1} max={12} type="number" className="w-13"
                   disabled={isDisabled}/>/
            <Field name="year" type="number" className="w-20" disabled={isDisabled}/>
          </td>
          <td className="border-b p-3">$<Field name="amount" type="number" disabled={isDisabled}/>
          </td>
          <td className="border-b p-3">
            {
              isDisabled
                ? <button onClick={() => onChanged()}>Edit</button>
                : <button type="button" onClick={() => handleSubmit()} disabled={isSubmitting}>Save</button>
            }
          </td>
        </tr>
      }
    </Formik>

  )
    ;
}

export default MonthlyTargetForm;