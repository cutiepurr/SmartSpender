import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React, {useEffect, useState} from "react";
import MonthlyTargetForm from "./MonthlyTargetForm";
import TargetApis from "../../api/TargetApis";
import {useAuth0} from "@auth0/auth0-react";

interface editProp {
  target: MonthlyTarget,
  editId: string,
  onEdited: Function
}

const EditMonthlyTarget: React.FC<editProp> = ({target, editId, onEdited}) => {
  const { getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState("");
  
  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);
  
  const onSubmit = (data: MonthlyTarget) => {
    TargetApis.putTarget(data.id ?? "", data, token, () => {
      window.location.reload();
    })
  };
  
  return <MonthlyTargetForm target={target} editId={editId} onEdited={onEdited} submitCallback={onSubmit}/>
}

export default EditMonthlyTarget;