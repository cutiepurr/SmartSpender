import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import AddTransaction from "./Forms/AddTransaction";
import {Button, Col, Container, Row} from "reactstrap";
import {getNextMonth, getPreviousMonth} from "../../utils/DateExtensions";
import TransactionApis from "../../api/TransactionApis";
import CategoryApis from "../../api/CategoryApis";
import {formatMoneyAmount} from "../../utils/MoneyExtensions";
import Ribbon from "./Ribbon";
import SquareStickyLeftContainer from "../SquareStickyLeftContainer";
import {useAuth0} from "@auth0/auth0-react";
import {categoryItem} from "@/utils/Category";
import TransactionList from "../Transaction/TransactionList";

const TransactionListPage = () => {
  const {year, month} = useParams();
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [categories, setCategories] = useState<Array<categoryItem>>([]);

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
      setTotalAmount(data)
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
            <div>
              <h4 className="m-2">Add Transaction</h4>
              <SquareStickyLeftContainer/>
              <AddTransaction categories={categories}/>
            </div>
            <div>
              <h4 className="m-2">History</h4>
              <TransactionList year={year} month={month} categories={categories} onSelected={onSelected}
                               editId={editMode}
                               onEdit={setEditMode}/>
            </div>
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

export default TransactionListPage;
