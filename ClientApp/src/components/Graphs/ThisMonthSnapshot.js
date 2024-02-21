import React, {useEffect, useState} from "react";
import TransactionApis from "../../api/TransactionApis";
import {useAuth0} from "@auth0/auth0-react";
import TargetApis from "../../api/TargetApis";

const ThisMonthSnapshot = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [wantAmount, setWantAmount] = useState(0);
  const [needAmount, setNeedAmount] = useState(0);
  const [target, setTarget] = useState(0);

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (token === "") return;

    let query = new URLSearchParams();
    query.set("year", year);
    query.set("month", month);

    TransactionApis.getTransactionTotalAmount(query, token, data => {
      setWantAmount(data.wants);
      setNeedAmount(data.needs);
    });
    TargetApis.getTargetFromDate(year, month, token, data => setTarget(data.amount));
  }, [token, month, year]);

  const formatMoney = (amount) => {
    if (amount < 0) amount = -amount;
    else amount = 0;
    return `$${amount}`;
  };

  return (
    <div className="p-3 m-3 border rounded shadow">
      <div className="text-xl">This month's spending</div>
      <div className="grid grid-cols-2 text-2xl">
        <div className="row-span-2 p-4">
          <div>Total</div>
          <div className={`text-5xl ${wantAmount + needAmount > target ? "text-red-600" : "text-green-600"}`}>
            {formatMoney(wantAmount + needAmount)}
          </div>
        </div>
        <div>
          <div>
            <div>Wants</div>
            <div>{formatMoney(wantAmount)}</div>
          </div>
          <div>
            <div>Needs</div>
            <div>{formatMoney(needAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThisMonthSnapshot;