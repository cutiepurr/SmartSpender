import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import TransactionTable from "./TransactionTable";
import { Button, Row, Col, Container, Input } from "reactstrap";
import { getPreviousMonth, getNextMonth } from "../../utils/DateExtensions";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";
import NotFound from "../NotFound";
import EditTransaction from "./EditTransaction";
import { formatMoneyAmount } from "../../utils/MoneyExtensions";
import Ribbon from "./Ribbon";

const TransactionList = () => {
  const { year, month } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(0); // page for loading transaction
  const [perLoad, setPerLoad] = useState(50); // number of transactions per page
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(-1); // id of the transaction that is currently under edit mode
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    CategoryApis.getCategories((data) => {
      setCategories(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    let query = new URLSearchParams();
    if (year != null) {
      query.set("year", year);
      if (month != null) query.set("month", month);
    }

    TransactionApis.getTransactionCounts(query, (data) => setCount(data));

    TransactionApis.getTransactionTotalAmount(query, (data) =>
      setTotalAmount(data)
    );
  }, [year, month]);

  useEffect(() => {
    let query = new URLSearchParams();
    query.set("page", page);
    query.set("count", perLoad);
    if (year != null) {
      query.set("year", year);
      if (month != null) query.set("month", month);
    }

    TransactionApis.getTransactions(query, (data) => {
      if (data === null) return;
      setTransactions((transactions) => transactions.concat(data));
    });
  }, [year, month, page, perLoad]);

  const sanitizeTransaction = (transaction) => {
    let transactionDate = new Date(
      `${transaction.timestamp}.000Z`
    ).toLocaleString("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    let transactionCategory = categories.find(
      (c) => c.id === transaction.categoryID
    );
    let categoryName =
      transactionCategory === undefined
        ? "Uncategorised"
        : transactionCategory.name;

    let amount = formatMoneyAmount(transaction.amount);

    return {
      id: transaction.id,
      description: transaction.description,
      timestamp: transactionDate,
      amount: amount,
      category: categoryName,
    };
  };

  const onSelected = (event) => {
    var id = parseInt(event.target.name);
    var isSelected = event.target.checked;
    if (isSelected) setSelectedItems((items) => [...items, id]);
    else
      setSelectedItems((items) => {
        items.splice(items.indexOf(id), 1);
        return [...items];
      });
  };

  const transactionItems = transactions.map((transaction) => {
    let transactionViewObject = sanitizeTransaction(transaction);

    return (
      <div key={`view-${transaction.id}`}>
        <SquareStickyLeftContainer>
          <Input type="checkbox" name={transaction.id} onChange={onSelected} />
        </SquareStickyLeftContainer>
        {editMode !== transaction.id ? (
          <TransactionTable
            className="transaction-line"
            transaction={transactionViewObject}
            onClick={() => setEditMode(transaction.id)}
          />
        ) : (
          <EditTransaction transaction={transaction} categories={categories} />
        )}
      </div>
    );
  });

  const loadMoreTransactions = () => setPage((tmp) => (tmp = page + 1));

  return (
    <div>
      {year==undefined && month === undefined ? (
        <h1>Transaction</h1>
      ) : (
        <TitleWithMonth year={year} month={month} />
      )}
      <Ribbon selectedItems={selectedItems} />
      <div className="position-relative w-100">
        <div className="shadow-inset-right"></div>
        <div style={{ height: "80vh" }} className="overflow-auto">
          <div style={{ width: 1200 }} className="mx-auto">
            <SquareStickyLeftContainer />
            <AddTransaction categories={categories} />
            {count === 0 ? (
              <NotFound />
            ) : (
              <div className="bg-white">
                <TransactionListHeader />
                {transactionItems}
                {count > (page + 1) * perLoad ? (
                  <Button onClick={loadMoreTransactions}>Load more</Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className="shadow-inset-bottom"></div>
        <TransactionTotalAmount amount={totalAmount} />
      </div>
    </div>
  );
};

const TitleWithMonth = ({ year, month }) => {
  let [prevYear, prevMonth] = getPreviousMonth(year, month);
  let [nextYear, nextMonth] = getNextMonth(year, month);

  let prevMonthLink = `/transactions/${prevYear}/${prevMonth}`;
  let nextMonthLink = `/transactions/${nextYear}/${nextMonth}`;

  const onPrevButtonClicked = () => (window.location.href = prevMonthLink);

  const onNextButtonClicked = () => (window.location.href = nextMonthLink);

  return (
    <Row className="text-center">
      <Col>
        <Button color="link" onClick={onPrevButtonClicked}>
          Prev
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
          Next
        </Button>
      </Col>
    </Row>
  );
};

const TransactionListHeader = () => (
  <strong>
    <SquareStickyLeftContainer />
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

const TransactionTotalAmount = ({ amount }) => (
  <Container
    className="bg-white border-top p-3 position-absolute bottom-0"
    style={{ width: "100%", zIndex: 3, height: 50 }}
  >
    <h4>
      <div className="float-end">{formatMoneyAmount(amount)}</div>
      <div>Total</div>
    </h4>
  </Container>
);

const SquareStickyLeftContainer = (props) => (
  <div
    className="float-start px-2 bg-white border-end sticky-left"
    {...props}
    style={{ width: 50, height: 50, zIndex: 2 }}
  >
    {props.children}
  </div>
);

export default TransactionList;
