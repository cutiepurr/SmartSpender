import React, {useEffect, useState} from "react";
import TransactionApis from "../../api/TransactionApis";
import {Col, Row} from "reactstrap";
import {useAuth0} from "@auth0/auth0-react";

const ThisMonthSnapshot = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [wantAmount, setWantAmount] = useState(0);
  const [needAmount, setNeedAmount] = useState(0);

  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, []);

  useEffect(() => {
    if (token === "") return;
    
    let query = new URLSearchParams();
    query.set("year", year);
    query.set("month", month);

    query.set("categoryType", 0);
    TransactionApis.getTransactionTotalAmount(query, token, (data) => setWantAmount(data));
    query.set("categoryType", 1);
    TransactionApis.getTransactionTotalAmount(query, token, (data) => setNeedAmount(data));
  }, [token]);

  const formatMoney = (amount) => {
    if (amount < 0) amount = -amount;
    else amount = 0;
    return `$${amount}`;
  };

  return (
    <Row tag="h3" className="p-3 m-3 border shadow">
      <div>This month's spending</div>
      <Col>
        <div>Total</div>
        <div>{formatMoney(wantAmount + needAmount)}</div>
      </Col>
      <Col>
        <div>Wants</div>
        <div>{formatMoney(wantAmount)}</div>
      </Col>
      <Col>
        <div>Needs</div>
        <div>{formatMoney(needAmount)}</div>
      </Col>
    </Row>
  );
};

export default ThisMonthSnapshot;