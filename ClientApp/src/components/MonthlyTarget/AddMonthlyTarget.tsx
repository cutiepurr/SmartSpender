import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import MonthlyTargetForm from "./MonthlyTargetForm";
import TargetApis from "../../api/TargetApis";
import {useAuth0} from "@auth0/auth0-react";

const AddMonthlyTarget = () => {
  const {getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  const onSubmit = (data: MonthlyTarget) => {
    TargetApis.postTarget(data, token, () => {
      window.location.reload();
    })
  };

  return (
    <table>
      <tbody>
        <MonthlyTargetForm target={null} isDisabled={false} onChanged={() => {}} submitCallback={onSubmit}/>
      </tbody>
    </table>
  );
}

export default AddMonthlyTarget;