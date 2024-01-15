import React, {useEffect, useState} from "react";
import TransactionApis from "../../api/TransactionApis";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {getDateNextMonth} from "../../utils/DateExtensions";
import {useAuth0} from "@auth0/auth0-react";

const MonthlyExpenseBarGraph = () => {
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [wantData, setWantData] = useState([]);
  const [needData, setNeedData] = useState([]);
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth())
  );
  const [startDate, setStartDate] = useState(
    new Date(endDate.getFullYear() - 1, endDate.getMonth() - 1)
  );

  // On state change
  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, []);

  useEffect(() => {
    if (token === "") return;

    var query = new URLSearchParams();
    query.set("startYear", startDate.getFullYear());
    query.set("startMonth", startDate.getMonth() + 1);
    query.set("endYear", endDate.getFullYear());
    query.set("endMonth", endDate.getMonth() + 1);

    query.set("categoryType", 0);
    TransactionApis.getMonthlyTransactionsAmounts(query, token, (data) => {
      setWantData(data);
    });

    query.set("categoryType", 1);
    TransactionApis.getMonthlyTransactionsAmounts(query, token, (data) => {
      setNeedData(data);
    });
  }, [token]);

  useEffect(() => {
    setGraphData(sanitizeData());
  }, [wantData, needData]);

  const sanitizeData = () => {
    let sanitizedData = [];

    let wantDatamap = {};
    let needDatamap = {};

    wantData.forEach((item) => {
      wantDatamap[new Date(item.year, item.month - 1)] = item.amount;
    });

    needData.forEach((item) => {
      needDatamap[new Date(item.year, item.month - 1)] = item.amount;
    });

    var curDate = startDate;

    while (
      curDate.getMonth() != endDate.getMonth() ||
      curDate.getFullYear() != endDate.getFullYear()
      ) {
      curDate = getDateNextMonth(curDate);
      sanitizedData.push({
        name: curDate.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        }),
        Wants:
          wantDatamap[curDate] == undefined
            ? 0
            : Math.max(-wantDatamap[curDate], 0),
        Needs:
          needDatamap[curDate] == undefined
            ? 0
            : Math.max(-needDatamap[curDate], 0),
      });
    }

    return sanitizedData;
  };

  return (
    <div>
      <h3>Monthly Spendings</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" interval={1}/>
          <YAxis unit="$"/>
          <Tooltip formatter={(value, name, props) => [`$${value}`, name]}/>
          <Legend/>
          <Bar dataKey="Wants" fill="#8884d8" stackId={1}/>
          <Bar dataKey="Needs" fill="#82ca9d" stackId={1}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseBarGraph;
