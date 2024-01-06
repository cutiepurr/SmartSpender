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

const emptyMessage = "Cannot be empty";

const validateDescription = (value) => {
  let error;
  if (value == "") error = emptyMessage;
  return error;
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

class Validation {
  static emptyMessage = "Cannot be empty";

  static description = (value) => {
    let error;
    if (value == "") error = emptyMessage;
    return error;
  };

  static amount = (value) => {
    let error;
    if (value == "") error = emptyMessage;
    else if (value < 0) error = "Must be greater than 0";
    return error;
  };

  static date = (value) => {
    let error;
    if (value == "") return emptyMessage;
    
    let today = new Date();
    today.setDate(today.getDate());
    if (new Date(value) >= today) error = "Can't be in the future";
    return error;
  };
}

export { validatedTransaction, validateDescription, Validation };
