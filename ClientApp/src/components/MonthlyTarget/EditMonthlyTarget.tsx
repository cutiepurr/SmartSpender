import {MonthlyTarget} from "@/utils/MonthlyTarget";
import React from "react";

interface editProp {
  target: MonthlyTarget,
  editId: string,
  onEdited: Function
}

const EditMonthlyTarget: React.FC<editProp> = ({target, editId, onEdited}) => {
  const isEdited = editId != target.id;

  return (
    <tr key={target.id}>
      <td className="border-b p-3">
        <input type="number" value={target.month} className="w-10" disabled={isEdited}/>/
        <input type="number" value={target.year} className="w-20" disabled={isEdited}/>
      </td>
      <td className="border-b p-3">$<input type="number" value={target.amount} disabled={isEdited}/></td>
      <td className="border-b p-3">
        {
          isEdited
            ? <button onClick={() => onEdited}>Edit</button>
            : <button>Save</button>
        }
      </td>
    </tr>
  );
}

export default EditMonthlyTarget;