import {useEffect, useState} from "react";
import {MonthlyTarget} from "@/utils/MonthlyTarget";
import {useAuth0} from "@auth0/auth0-react";
import TargetApis from "../../api/TargetApis";

const MonthlyTargetIndex = () => {
  const {getAccessTokenSilently} = useAuth0();

  const [token, setToken] = useState("");
  const [targets, setTargets] = useState<Array<MonthlyTarget>>([]);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (token === "") return;

    TargetApis.getTargets(token, data => {
      if (data === null) return;
      setTargets(data);
    });
  }, [token]);

  return (
    <>
      <div className="p-3">
        <h3>Monthly Targets</h3>
        <table className="table-auto border-collapse">
          <thead>
          <tr>
            <th className="border-b text-left p-3">Until</th>
            <th className="border-b text-left p-3">Amount</th>
            <th className="border-b text-left p-3"></th>
          </tr>
          </thead>
          <tbody>
          {targets.map(target => {
            const isEdited = editId != target.id;
            return <tr key={target.id}>
              <td className="border-b p-3">
                <input type="number" value={target.month} className="w-10" disabled={isEdited}/>/
                <input type="number" value={target.year} className="w-20" disabled={isEdited}/>
              </td>
              <td className="border-b p-3">$<input type="number" value={target.amount} disabled={isEdited}/></td>
              <td className="border-b p-3">
                {
                  isEdited
                    ? <button onClick={() => setEditId(target.id ?? "")}>Edit</button>
                    : <button>Save</button>
                }
              </td>
            </tr>
              ;
          })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MonthlyTargetIndex;