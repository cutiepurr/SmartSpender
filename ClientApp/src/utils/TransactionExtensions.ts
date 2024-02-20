import {formatMoneyAmount} from "./MoneyExtensions";
import {ApiTransaction} from "@/utils/Transaction";
import {categoryItem} from "@/utils/Category";

const formatTransactionApiToView = (transaction: ApiTransaction, categories: Array<categoryItem>) => {
  if (transaction == null) return null;

  let transactionDate = new Date(transaction.timestamp).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  let transactionCategory = categories.find(
    (c) => c.categoryId === transaction.categoryId
  );
  let categoryName = transactionCategory === undefined ? "Uncategorised" : transactionCategory.name;

  let amount = formatMoneyAmount(transaction.amount);

  return {
    id: transaction.id,
    description: transaction.description,
    timestamp: transactionDate,
    amount: amount,
    category: categoryName,
  };
};

export {formatTransactionApiToView}