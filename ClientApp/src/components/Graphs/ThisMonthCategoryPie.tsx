import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import ApiFetcher from "../../api/ApiFetcher";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";

const ThisMonthCategoryPie = ({...props}) => {
  const COLORS = ['#0088FE', '#f23f4b'];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const {getAccessTokenSilently} = useAuth0();
  const [token, setToken] = useState<string>("");
  const [innerGraphData, setInnerGraphData] = useState<Array<object>>([]);
  const [outerGraphData, setOuterGraphData] = useState<Array<object>>([]);

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (token === "") return;

    let query = new URLSearchParams();
    query.set("year", year.toString());
    query.set("month", month.toString());

    // @ts-ignore
    ApiFetcher.getRequest(`/api/Transactions/amount/category?${query.toString()}`, token, data => {
      getGraphData(data)
    })
  }, [token, month, year]);

  const getGraphData = (data) => {
    let innerData = data.map(item => {
      return {
        name: item.category.name,
        amount: -Math.round(item.amount * 100) / 100
      };
    });
    setInnerGraphData(innerData);

    let wants = data.filter(item => item.category.categoryType === 0).reduce((partialSum, item) => partialSum + item.amount, 0);
    let needs = data.filter(item => item.category.categoryType === 1).reduce((partialSum, item) => partialSum + item.amount, 0);
    setOuterGraphData([
      {
        name: "All Needs",
        amount: -needs
      },
      {
        name: "All Wants",
        amount: -wants,
      },
    ])
  };

  return (
    <div {...props}>
      <h3>{today.toLocaleDateString("en-gb", {month: "long", year: "numeric"})} spending by categories</h3>
      <ResponsiveContainer width="100%" height={300} className="mx-auto" style={{maxWidth: 700}}>
        <PieChart width={500} height={300}>
          <Tooltip formatter={(value, name, props) => [`$${value}`, name]}/>
          <Legend align="right" verticalAlign="middle" layout="vertical"/>
          <Pie data={innerGraphData} dataKey="amount" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" startAngle={90}
               endAngle={450}>
            {innerGraphData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index <= 5 ? 0 : 1]}/>
            ))}
          </Pie>
          <Pie data={outerGraphData} dataKey="amount" cx="50%" cy="50%" innerRadius={90} outerRadius={95} fill="#82ca9d"
               label={({value, name}) => `${name} - $${value}`} startAngle={90} endAngle={450} legendType="none">
            {outerGraphData?.map((entry, index) =>
              <Cell key={`cell-${index}`} fill={COLORS[index]}/>
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThisMonthCategoryPie;