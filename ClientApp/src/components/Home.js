import React from 'react';
import MonthlyExpenseBarGraph from './Graphs/MonthlyExpenseBarGraph';
import ThisMonthSnapshot from './Graphs/ThisMonthSnapshot';
import {useAuth0} from "@auth0/auth0-react";

const Home = () => {
  const {isAuthenticated} = useAuth0();
  return (
    <div>
      {
        isAuthenticated ?
          <>
            <ThisMonthSnapshot/>
            <MonthlyExpenseBarGraph className="p-3"/>
          </>
          : null
      }
    </div>
  );
}

export default Home;
