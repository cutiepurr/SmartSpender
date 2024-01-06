const validateTransaction = (transaction) => {
  if (
    transaction.description === null ||
    transaction.amount === null ||
    transaction.timestamp === null ||
    transaction.description === "" ||
    transaction.amount === "" ||
    transaction.timestamp === ""
  ) {
    alert("Field cannot be null");
    return false;
  }

  transaction.timestamp = new Date(transaction.timestamp);
  if (transaction.amount <= 0) {
    alert("Amount must be greater than 0");
    return false;
  }

  if (transaction.timestamp > new Date()) {
    alert("Date and time cannot be in the future");
    return false;
  }

  return true;
};

const validatedTransaction = (transaction) => {
  let validation = validateTransaction(transaction);
  if (!validation) return null;

  let amount = parseInt(transaction.amount);
  if (transaction.amountSign === "-") amount = -amount;

  return {
    description: transaction.description,
    amount: amount,
    timestamp: new Date(transaction.timestamp).toISOString(),
    categoryID: parseInt(transaction.category),
  };
};

export { validatedTransaction };
