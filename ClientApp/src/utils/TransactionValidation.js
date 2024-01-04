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

export {
    validateTransaction
}
