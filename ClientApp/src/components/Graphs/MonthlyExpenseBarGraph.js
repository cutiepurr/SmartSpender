import React, {useEffect, useState} from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {getDateNextMonth} from "../../utils/DateExtensions";
import {useAuth0} from "@auth0/auth0-react";
import ApiFetcher from "../../api/ApiFetcher";

const MonthlyExpenseBarGraph = (props) => {
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [wantData, setWantData] = useState([]);
  const [needData, setNeedData] = useState([]);
  const [targets, setTargets] = useState([]);

  const endDate = new Date(new Date().getFullYear(), new Date().getMonth());
  const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth() - 1);

  // On state change
  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (token === "") return;

    ApiFetcher.getRequest("/api/Graph/12month", token, data => {
      setWantData(data.wants);
      setNeedData(data.needs);
      setTargets(data.targets);
    })
  }, [token]);

  useEffect(() => {
    if (wantData !== undefined && needData !== undefined) setGraphData(sanitizeData());
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
      curDate.getMonth() !== endDate.getMonth() ||
      curDate.getFullYear() !== endDate.getFullYear()
      ) {
      curDate = getDateNextMonth(curDate);
      let wants = wantDatamap[curDate] === undefined
        ? 0
        : Math.max(-wantDatamap[curDate], 0)
      let needs = needDatamap[curDate] === undefined
        ? 0
        : Math.max(-needDatamap[curDate], 0)
      sanitizedData.push({
        name: curDate.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        }),
        Wants: wants,
        Needs: needs,
        Total: wants + needs,
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
          <YAxis unit="$" padding={{top: 20}}/>
          <Tooltip formatter={(value, name, props) => [`$${value}`, name]}/>
          <Legend/>
          <Bar dataKey="Wants" fill="#8884d8" stackId={1}/>
          <Bar dataKey="Needs" fill="#82ca9d" stackId={1}/>
          <Scatter dataKey="Total" fill="#6b6f80" legendType="none" shape={<></>}/>
          <Line dataKey="Target"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseBarGraph;
