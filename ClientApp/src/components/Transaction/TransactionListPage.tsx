import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import AddTransaction from "./Forms/AddTransaction";
import {getNextMonth, getPreviousMonth} from "../../utils/DateExtensions";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";
import {formatMoneyAmount} from "../../utils/MoneyExtensions";
import Ribbon from "./Ribbon";
import SquareStickyLeftContainer from "../SquareStickyLeftContainer";
import {useAuth0} from "@auth0/auth0-react";
import {CategoryItem} from "@/utils/Category";
import TransactionList from "../Transaction/TransactionList";
import TransactionTable from "./TransactionTable";

const TransactionListPage = () => {
  const {year, month} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [categories, setCategories] = useState<Array<CategoryItem>>([]);

  const [totalAmount, setTotalAmount] = useState(0);
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

    TransactionApis.getTransactionTotalAmount(query, token, (data) =>
      setTotalAmount(data.total)
    );
  }, [year, month, token]);

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

  return (
    <div className=" md:h-screen overflow-auto">
      {year === undefined && month === undefined ? (
        <h1>Transaction</h1>
      ) : (
        <TitleWithMonth year={year} month={month}/>
      )}
      <div className="w-full">
        <div className="mx-auto">
          <div>
            <h4 className="m-2">Add Transaction</h4>
            <SquareStickyLeftContainer/>
            <AddTransaction categories={categories}/>
          </div>
          <div>
            <div className="sticky top-0 z-10 bg-white">
              <Ribbon selectedItems={selectedItems}/>
              <TransactionTotalAmount amount={totalAmount}/>
              <TransactionListHeader/>
            </div>
            <TransactionList year={year} month={month} categories={categories} onSelected={onSelected}
                             editId={editMode}
                             onEdit={setEditMode}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const TitleWithMonth = ({year, month}) => {
  let [prevYear, prevMonth] = getPreviousMonth(parseInt(year), parseInt(month));
  let [nextYear, nextMonth] = getNextMonth(parseInt(year), parseInt(month));

  let prevMonthLink = `/transactions/${prevYear}/${prevMonth}`;
  let nextMonthLink = `/transactions/${nextYear}/${nextMonth}`;

  return (
    <div className="grid grid-cols-3 text-center">
      <div><Link to={prevMonthLink}><i className="fa-solid fa-chevron-left"></i></Link></div>
      <div>
        <h1>
          {new Date(year, month - 1)
            .toLocaleDateString("en-GB", {month: "long", year: "numeric",})}
        </h1>
      </div>
      <div><Link to={nextMonthLink}><i className="fa-solid fa-chevron-right"></i></Link></div>
    </div>
  );
};

const TransactionTotalAmount = ({amount}) => (
  <div
    className="container text-2xl border-b p-3 w-full"
  >
    <h4>
      <div className="float-end">{formatMoneyAmount(amount)}</div>
      <div>Total</div>
    </h4>
  </div>
);

const TransactionListHeader = () => (
  <strong className="hidden md:block">
    <SquareStickyLeftContainer/>
    <TransactionTable
      className="sticky top-30 border-b drop-shadow"
      transaction={{
        description: "Description",
        timestamp: "Date",
        amount: "Amount",
        category: "Category",
      }}
    />
  </strong>
);

export default TransactionListPage;
