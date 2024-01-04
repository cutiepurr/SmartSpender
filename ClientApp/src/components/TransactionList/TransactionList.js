import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import TransactionTable from "./TransactionTable";
import { Button, Row, Col } from "reactstrap";
import { getPreviousMonth, getNextMonth } from "../../utils/DateExtensions";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";
import NotFound from "../NotFound";
import EditTransaction from "./EditTransaction";

const TransactionList = () => {
  const { year, month } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0); // page for loading transaction
  const [perLoad, setPerLoad] = useState(50); // number of transactions per page
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(-1); // id of the transaction that is currently under edit mode

  useEffect(() => {
    CategoryApis.getCategories((data) => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    let query = new URLSearchParams();
    if (year != null) {
      query.set("year", year);
      if (month != null) query.set("month", month);
    }

    TransactionApis.getTransactionCounts(query, (data) => {
      setCount(data);
    });
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

  const transactionItems = transactions.map((transaction) => {
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

    let amount = transaction.amount;
    if (amount < 0) amount = `- $${-amount}`;
    else amount = `+ $${amount}`;

    let transactionViewObject = {
      description: transaction.description,
      timestamp: transactionDate,
      amount: amount,
      category: categoryName,
    };

    return (
      <div key={`view-${transaction.id}`}>
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

  const transactionColumnTitle = (
    <strong>
      <TransactionTable
        transaction={{
          description: "Description",
          timestamp: "Date",
          amount: "Amount",
          category: "Category",
        }}
      />
    </strong>
  );

  const loadMoreTransactions = () => setPage((tmp) => (tmp = page + 1));

  return (
    <div>
      {month === null ? (
        <h1>Transaction</h1>
      ) : (
        <TitleWithMonth year={year} month={month} />
      )}

      <AddTransaction categories={categories} />
      {count === 0 ? (
        <NotFound />
      ) : (
        <div>
          {transactionColumnTitle}
          {transactionItems}
          {count > (page + 1) * perLoad ? (
            <Button onClick={loadMoreTransactions}>Load more</Button>
          ) : null}
        </div>
      )}
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
    <Row style={{ textAlign: "center" }}>
      <Col>
        <Button onClick={onPrevButtonClicked}>Prev</Button>
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
        <Button onClick={onNextButtonClicked}>Next</Button>
      </Col>
    </Row>
  );
};

export default TransactionList;
