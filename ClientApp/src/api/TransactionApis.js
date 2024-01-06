import ApiFetcher from "./ApiFetcher";

class TransactionApis extends ApiFetcher {
  /**
   * GET transactions
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactions = (query, callback=null) => {
    this.getRequest(`/api/Transactions?${query.toString()}`, callback);
  };

  /**
   * GET the number of transactions
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactionCounts = (query, callback=null) => {
    this.getRequest(`/api/Transactions/count?${query.toString()}`, callback);
  };

  /**
   * GET the total amount for the certain month of the year.
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactionTotalAmount = (query, callback=null) => {
    this.getRequest(`/api/Transactions/amount?${query.toString()}`, callback);
  };

  /**
   * GET the total amount for each month of the specified period
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getMonthlyTransactionsAmounts = (query, callback=null) => {
    this.getRequest(`/api/Transactions/amount/during?${query.toString()}`, callback);
  };

  /**
   * POST transaction
   * @param {Object} transaction Must include description, timestamp, and amount
   * @param {Function} callback Callback function upon successful request
   */
  static postTransaction = (transaction, callback=null) => {
    this.postRequest(`api/Transactions`, JSON.stringify(transaction), callback);
  };

  /**
   * PUT transaction
   * @param {Object} transaction Must include id, description, timestamp, and amount
   * @param {Function} callback Callback function upon successful request
   */
  static putTransaction = (transaction, callback=null) => {
    this.putRequest(`api/Transactions/${transaction.id}`, JSON.stringify(transaction), callback);
  };

  /**
   * DELETE transaction
   * @param {long} transactionId
   * @param {Function} callback Callback function upon successful request
   */
  static deleteTransaction = (transactionId, callback=null) => {
    this.deleteRequest(`api/Transactions/${transactionId}`, null, callback);
  };

  /**
   * DELETE transaction
   * @param {Array} idArray
   * @param {Function} callback Callback function upon successful request
   */
  static deleteTransactions = (idArray, callback=null) => {
    this.deleteRequest(`api/Transactions`, idArray, callback);
  };
}

export default TransactionApis;
