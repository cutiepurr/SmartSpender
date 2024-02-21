import React, {useEffect, useState} from "react";
import TransactionApis from "../../api/TransactionApis";
import {Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {getDateNextMonth} from "../../utils/DateExtensions";
import {useAuth0} from "@auth0/auth0-react";
import TargetApis from "../../api/TargetApis";

const MonthlyExpenseBarGraph = (props) => {
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [wantData, setWantData] = useState([]);
  const [needData, setNeedData] = useState([]);
  const [targets, setTargets] = useState([]);
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

    let transactionQuery = new URLSearchParams();
    transactionQuery.set("startYear", startDate.getFullYear());
    transactionQuery.set("startMonth", startDate.getMonth() + 1);
    transactionQuery.set("endYear", endDate.getFullYear());
    transactionQuery.set("endMonth", endDate.getMonth() + 1);

    transactionQuery.set("categoryType", 0);
    TransactionApis.getMonthlyTransactionsAmounts(transactionQuery, token, (data) => {
      setWantData(data);
    });

    transactionQuery.set("categoryType", 1);
    TransactionApis.getMonthlyTransactionsAmounts(transactionQuery, token, (data) => {
      setNeedData(data);
    });

    let targetQuery = new URLSearchParams();
    targetQuery.set("year", startDate.getFullYear());
    targetQuery.set("month", startDate.getMonth() + 1);
    TargetApis.getTargetsFrom(targetQuery, token, (data) => {
      setTargets(data);
    })
  }, [token]);

  useEffect(() => {
    setGraphData(sanitizeData());
  }, [wantData, needData]);

  const getTargetFromDate = (date) => {
    for (let target of targets) {
      let targetDate = new Date(target.until);
      if (targetDate > date) return target.amount;
    }
    return null;
  }

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
        Target: getTargetFromDate(curDate),
      });
    }

    return sanitizedData;
  };

  return (
    <div {...props}>
      <h3>Last 12 months' spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" interval={1}/>
          <YAxis unit="$"/>
          <Tooltip formatter={(value, name, props) => [`$${value}`, name]}/>
          <Legend/>
          <Bar dataKey="Wants" fill="#8884d8" stackId={1}/>
          <Bar dataKey="Needs" fill="#82ca9d" stackId={1}/>
          <Line dataKey="Target"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseBarGraph;
