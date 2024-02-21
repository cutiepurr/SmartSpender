import React from 'react';
import MonthlyExpenseBarGraph from './Graphs/MonthlyExpenseBarGraph';
import ThisMonthSnapshot from './Graphs/ThisMonthSnapshot';
import {useAuth0} from "@auth0/auth0-react";
import ThisMonthCategoryPie from "./Graphs/ThisMonthCategoryPie";

const Home = () => {
  const {isAuthenticated} = useAuth0();
  if (!isAuthenticated) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 m-3">
      <div className="col-span-1 border rounded shadow p-7"><ThisMonthSnapshot/></div>
      <div className="col-span-2 border rounded shadow p-7"><ThisMonthCategoryPie/></div>
      <div className="col-span-3 border rounded shadow p-7"><MonthlyExpenseBarGraph/></div>
    </div>
  );
}

export default Home;
