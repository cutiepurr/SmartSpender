import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React from "react";
import MonthlyTargetForm from "./MonthlyTargetForm";

interface editProp {
  target: MonthlyTarget,
  editId: string,
  onEdited: Function
}

const EditMonthlyTarget: React.FC<editProp> = ({target, editId, onEdited}) => {
  const isEdited = editId != target.id;

  return <MonthlyTargetForm target={target} editId={editId} onEdited={onEdited}/>
}

export default EditMonthlyTarget;