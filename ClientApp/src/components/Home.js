import React from 'react';
import MonthlyExpenseBarGraph from './Graphs/MonthlyExpenseBarGraph';
import ThisMonthSnapshot from './Graphs/ThisMonthSnapshot';

const Home = () => {

  return (
    <div>
      <ThisMonthSnapshot />
      <MonthlyExpenseBarGraph />
    </div>
  );
}

export default Home;
