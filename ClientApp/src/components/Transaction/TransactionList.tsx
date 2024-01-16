import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import AddTransaction from "./Forms/AddTransaction";
import TransactionTable from "./TransactionTable";
import {Button, Col, Container, Input, Row} from "reactstrap";
import {getNextMonth, getPreviousMonth} from "../../utils/DateExtensions";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";
import NotFound from "../NotFound";
import EditTransaction from "./Forms/EditTransaction";
import {formatMoneyAmount} from "../../utils/MoneyExtensions";
import Ribbon from "./Ribbon";
import SquareStickyLeftContainer from "../SquareStickyLeftContainer";
import {formatTransactionApiToView} from "../../utils/TransactionExtensions";
import {useAuth0} from "@auth0/auth0-react";
import {ApiTransaction} from "@/utils/Transaction";
import {categoryItem} from "@/utils/Category";

const TransactionList = () => {
  const {year, month} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [transactions, setTransactions] = useState<Array<ApiTransaction>>([]);
  const [categories, setCategories] = useState<Array<categoryItem>>([]);

  const [count, setCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(0); // page for loading transaction
  const [perLoad] = useState(50); // number of transactions per page
  const [editMode, setEditMode] = useState(-1); // id of the transaction that is currently under edit mode
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);

  // GET categories
  useEffect(() => {
    CategoryApis.getCategories((data) => setCategories(data));
  }, []);

  // Get access token
  useEffect(() => {
    getAccessTokenSilently().then(data => setToken(data));
  }, [getAccessTokenSilently]);

  // GET transaction counts and total amount
  useEffect(() => {
    if (token === "") return;

    let query = new URLSearchParams();
    if (year !== undefined) {
      query.set("year", year);
      if (month !== undefined) query.set("month", month);
    }

    TransactionApis.getTransactionCounts(query, token, (data) => setCount(data));

    TransactionApis.getTransactionTotalAmount(query, token, (data) =>
      setTotalAmount(data)
    );
  }, [year, month, token]);

  // GET all transactions
  useEffect(() => {
    if (token === "") return;

    let query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("count", perLoad.toString());
    if (year != null) {
      query.set("year", year);
      if (month != null) query.set("month", month);
    }

    TransactionApis.getTransactions(query, token, (data) => {
      if (data === null) return;
      setTransactions((transactions) => transactions.concat(data));
    });
  }, [year, month, page, perLoad, token]);

  const onSelected = (event) => {
    let id = parseInt(event.target.name);
    let isSelected = event.target.checked;
    if (isSelected) {
      setSelectedItems((items) => [...items, id]);
      setEditMode(-1);
    } else
      setSelectedItems((items) => {
        items.splice(items.indexOf(id), 1);
        return [...items];
      });
  };

  const transactionItems = transactions.map((transaction) => {
    let transactionViewObject = formatTransactionApiToView(transaction, categories);

    return (
      <div key={`view-${transaction.id}`}>
        <SquareStickyLeftContainer>
          <Input type="checkbox" name={transaction.id?.toString()} onChange={onSelected}/>
        </SquareStickyLeftContainer>
        {editMode !== transaction.id ? (
          <TransactionTable
            className="transaction-line"
            transaction={transactionViewObject}
            onClick={() => setEditMode(transaction.id ?? -1)}
          />
        ) : (
          <EditTransaction transaction={transaction} categories={categories}/>
        )}
      </div>
    );
  });

  const loadMoreTransactions = () => setPage((tmp) => (tmp = page + 1));

  return (
    <div>
      {year === undefined && month === undefined ? (
        <h1>Transaction</h1>
      ) : (
        <TitleWithMonth year={year} month={month}/>
      )}
      <Ribbon selectedItems={selectedItems}/>
      <div className="position-relative w-100">
        <div className="shadow-inset-right"></div>
        <div style={{height: "80vh"}} className="overflow-auto">
          <div style={{width: 1200}} className="mx-auto">
            <h4 className="m-2">Add Transaction</h4>
            <SquareStickyLeftContainer/>
            <AddTransaction categories={categories}/>
            <h4 className="m-2">History</h4>

            {count === 0 ? (
              <NotFound/>
            ) : (
              <div className="bg-white">
                <TransactionListHeader/>
                {transactionItems}
                {count > (page + 1) * perLoad ? (
                  <Button onClick={loadMoreTransactions}>Load more</Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className="shadow-inset-bottom"></div>
        <TransactionTotalAmount amount={totalAmount}/>
      </div>
    </div>
  );
};

const TitleWithMonth = ({year, month}) => {
  let [prevYear, prevMonth] = getPreviousMonth(parseInt(year), parseInt(month));
  let [nextYear, nextMonth] = getNextMonth(parseInt(year), parseInt(month));

  let prevMonthLink = `/transactions/${prevYear}/${prevMonth}`;
  let nextMonthLink = `/transactions/${nextYear}/${nextMonth}`;

  const onPrevButtonClicked = () => (window.location.href = prevMonthLink);

  const onNextButtonClicked = () => (window.location.href = nextMonthLink);

  return (
    <Row className="text-center">
      <Col>
        <Button color="link" onClick={onPrevButtonClicked}>
          &lt;
        </Button>
      </Col>
      <Col>
        <h1>
          {new Date(year, month - 1).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </h1>
      </Col>
      <Col>
        <Button color="link" onClick={onNextButtonClicked}>
          &gt;
        </Button>
      </Col>
    </Row>
  );
};

const TransactionListHeader = () => (
  <strong>
    <SquareStickyLeftContainer/>
    <TransactionTable
      className="sticky-top bg-white border-bottom shadow-bottom"
      transaction={{
        description: "Description",
        timestamp: "Date",
        amount: "Amount",
        category: "Category",
      }}
    />
  </strong>
);

const TransactionTotalAmount = ({amount}) => (
  <Container
    className="bg-white border-top p-3 position-absolute bottom-0"
    style={{width: "100%", zIndex: 3, height: 50}}
  >
    <h4>
      <div className="float-end">{formatMoneyAmount(amount)}</div>
      <div>Total</div>
    </h4>
  </Container>
);

export default TransactionList;
