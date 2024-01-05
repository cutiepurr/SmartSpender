import React, { useEffect, useState } from "react";
import TransactionApis from "../../api/TransactionApis";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

const MonthlyExpenseBarGraph = () => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    var curDate = new Date();
    var query = new URLSearchParams();
    query.set("startYear", curDate.getFullYear() - 1);
    query.set("startMonth", curDate.getMonth() + 1);
    query.set("endYear", curDate.getFullYear());
    query.set("endMonth", curDate.getMonth() + 1);

    TransactionApis.getMonthlyTransactionsAmounts(query, (data) => {
      console.log(sanitizeData(data));
      setGraphData(sanitizeData(data));
    });
  }, []);

  const sanitizeData = (data) => {
    let sanitizedData = [];
    for (let yearData of data) {
      for (let monthData of yearData.months) {
        sanitizedData.push({
            name: `${monthData.month}/${yearData.year}`,
            amount: monthData.amount,
        });
      }
    }
    return sanitizedData;
  };

  return (
    <div>
        <BarChart data={graphData} width={730} height={250}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
    </div>
  );
};

export default MonthlyExpenseBarGraph;
