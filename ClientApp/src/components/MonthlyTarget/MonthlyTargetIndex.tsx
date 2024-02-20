import {useEffect, useState} from "react";
import {MonthlyTarget} from "@/utils/MonthlyTarget";
import {useAuth0} from "@auth0/auth0-react";
import TargetApis from "../../api/TargetApis";

const MonthlyTargetIndex = () => {
  const {getAccessTokenSilently} = useAuth0();

  const [token, setToken] = useState("");
  const [targets, setTargets] = useState<Array<MonthlyTarget>>([]);

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
            </tr>
          </thead>
          <tbody>
            {targets.map(target =>
              <tr key={target.id}>
                <td className="border-b p-3">
                  <input type="number" value={target.month} className="w-10" disabled/>/
                  <input type="number" value={target.year} className="w-20" disabled/>
                </td>
                <td className="border-b p-3">$<input type="number" value={target.amount} disabled/></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MonthlyTargetIndex;