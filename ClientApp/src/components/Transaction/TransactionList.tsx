import {Button, Input} from "reactstrap";
import React, {useEffect, useState} from "react";
import NotFound from "../NotFound";
import EditTransaction from "./Forms/EditTransaction";
import {formatTransactionApiToView} from "../../utils/TransactionExtensions";
import SquareStickyLeftContainer from "../SquareStickyLeftContainer";
import TransactionTable from "./TransactionTable";
import {useAuth0} from "@auth0/auth0-react";
import {ApiTransaction} from "../../utils/Transaction";
import {CategoryItem} from "../../utils/Category";
import TransactionApis from "../../api/TransactionApis";

interface props {
  categories: Array<CategoryItem>;
  year: any;
  month: any;
  onSelected: any;
  editId: number;
  onEdit: any
}

const TransactionList: React.FC<props> = ({year, month, categories, onSelected, editId, onEdit}) => {
  const {getAccessTokenSilently} = useAuth0();

  // States
  const [token, setToken] = useState("");

  const [transactions, setTransactions] = useState<Array<ApiTransaction>>([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0); // page for loading transaction
  const [perLoad] = useState(50); // number of transactions per page

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
  }, [year, month, token]);

  const getAllTransactions = () => {
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
      setTransactions(data);
    });
  }

  // GET all transactions
  useEffect(getAllTransactions, [year, month, page, perLoad, token]);

  const transactionItems = transactions.map((transaction) => {
    let transactionViewObject = formatTransactionApiToView(transaction, categories);

    return (
      <div key={`view-${transaction.id}`}>
        <SquareStickyLeftContainer>
          <Input type="checkbox" name={transaction.id?.toString()} onChange={onSelected}/>
        </SquareStickyLeftContainer>
        {editId !== transaction.id ? (
          <TransactionTable
            className="hover:bg-slate-50 hover:cursor-pointer"
            transaction={transactionViewObject} onClick={() => onEdit(transaction.id ?? -1)}/>
        ) : (
          <EditTransaction
            transaction={transaction} categories={categories}
            onChanged={() => {
              onEdit(-1);
              getAllTransactions()
            }}/>
        )}
      </div>
    );
  });

  const loadMoreTransactions = () => setPage(_ => _ = page + 1);

  if (count === 0) return <NotFound/>;

  return (
    <div>
      {transactionItems}
      {count > (page + 1) * perLoad ? (
        <Button onClick={loadMoreTransactions}>Next</Button>
      ) : null}
    </div>
  );
};

export default TransactionList;