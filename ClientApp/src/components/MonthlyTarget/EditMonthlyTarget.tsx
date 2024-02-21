import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import MonthlyTargetForm from "./MonthlyTargetForm";
import TargetApis from "../../api/TargetApis";
import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-hot-toast";

interface editProp {
  target: MonthlyTarget,
  editId: string,
  onChanged: Function,
  requestCallback: Function,
}

const EditMonthlyTarget: React.FC<editProp> = ({target, editId, onChanged, requestCallback}) => {
  const { getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");
  
  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);
  
  const onSubmit = (data: MonthlyTarget) => {
    TargetApis.putTarget(data.id ?? "", data, token, () => {
      requestCallback();
      toast("Edit monthly target successfully!");
    })
  };
  
  return <MonthlyTargetForm target={target} isDisabled={editId !== target.id} onChanged={onChanged} submitCallback={onSubmit}/>
}

export default EditMonthlyTarget;