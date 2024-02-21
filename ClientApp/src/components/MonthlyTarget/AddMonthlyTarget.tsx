import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import MonthlyTargetForm from "./MonthlyTargetForm";
import TargetApis from "../../api/TargetApis";
import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-hot-toast";

const AddMonthlyTarget = ({requestCallback, ...props}) => {
  const {getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  const onSubmit = (data: MonthlyTarget) => {
    TargetApis.postTarget(data, token, () => {
      requestCallback();
      toast("Create monthly target successfully!");
    })
  };

  return (
    <table {...props}>
      <thead>
      <tr>
        <th className="border-b text-left p-3">Until</th>
        <th className="border-b text-left p-3">Amount</th>
        <th className="border-b text-left p-3"></th>
      </tr>
      </thead>
      <tbody>
      <MonthlyTargetForm target={null} isDisabled={false} onChanged={() => {
      }} submitCallback={onSubmit}/>
      </tbody>
    </table>
  );
}

export default AddMonthlyTarget;