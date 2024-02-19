import {formatMoneyAmount} from "./MoneyExtensions";

const formatTransactionApiToView = (transaction, categories) => {
  if (transaction == null) return null;

  let transactionDate = new Date(transaction.timestamp).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  
  let transactionCategory = categories.find(
    (c) => c.id === transaction.categoryId
  );
  let categoryName =
    transactionCategory == undefined
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

export {formatTransactionApiToView}