import React, { useEffect, useState } from "react";
import TransactionApis from "../../api/TransactionApis";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDatePreviousMonth,
  getPreviousMonth,
} from "../../utils/DateExtensions";

const MonthlyExpenseBarGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth())
  );
  const [startDate, setStartDate] = useState(
    new Date(endDate.getFullYear() - 1, endDate.getMonth())
  );

  useEffect(() => {
    var query = new URLSearchParams();
    query.set("startYear", startDate.getFullYear());
    query.set("startMonth", startDate.getMonth() + 1);
    query.set("endYear", endDate.getFullYear());
    query.set("endMonth", endDate.getMonth() + 1);

    TransactionApis.getMonthlyTransactionsAmounts(query, (data) => {
      console.log(sanitizeData(data));
      setGraphData(sanitizeData(data));
    });
  }, []);

  const sanitizeData = (data) => {
    let sanitizedData = [];
    let datamap = {};
    data.forEach((item) => {
      datamap[new Date(item.year, item.month - 1)] = item.amount;
    });

    var curDate = endDate;
    while (
      curDate.getMonth() != startDate.getMonth() ||
      curDate.getFullYear() != startDate.getFullYear()
    ) {
      sanitizedData.push({
        name: curDate.toLocaleDateString("en-GB", {
          month: "2-digit",
          year: "2-digit",
        }),
        Spending: Math.max(-datamap[curDate], 0),
      });
      curDate = getDatePreviousMonth(curDate);
    }

    return sanitizedData;
  };

  return (
    <div>
      <BarChart data={graphData} width={730} height={250}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Spending" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default MonthlyExpenseBarGraph;
