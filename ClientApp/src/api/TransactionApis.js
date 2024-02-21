import ApiFetcher from "./ApiFetcher";

class TransactionApis extends ApiFetcher {
  /**
   * GET transactions
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactions = (query, token, callback = null) => {
    this.getRequest(`/api/Transactions?${query.toString()}`, token, callback);
  };

  /**
   * GET the number of transactions
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactionCounts = (query, token, callback = null) => {
    this.getRequest(`/api/Transactions/count?${query.toString()}`, token, callback);
  };

  /**
   * GET the total amount for the certain month of the year.
   * @param {URLSearchParams} query Params for the API's URL
   * @param {Function} callback Callback function upon successful request
   */
  static getTransactionTotalAmount = (query, token, callback = null) => {
    this.getRequest(`/api/Transactions/amount?${query.toString()}`, token, callback);
  };

  /**
   * POST transaction
   * @param {Object} transaction Must include description, timestamp, and amount
   * @param {Function} callback Callback function upon successful request
   */
  static postTransaction = (transaction, token, callback = null) => {
    this.postRequest(`api/Transactions`, JSON.stringify(transaction), token, callback);
  };

  /**
   * PUT transaction
   * @param {Object} transaction Must include id, description, timestamp, and amount
   * @param {Function} callback Callback function upon successful request
   */
  static putTransaction = (transaction, token, callback = null) => {
    this.putRequest(`api/Transactions/${transaction.id}`, JSON.stringify(transaction), token, callback);
  };

  /**
   * DELETE transaction
   * @param {long} transactionId
   * @param {Function} callback Callback function upon successful request
   */
  static deleteTransaction = (transactionId, token, callback = null) => {
    this.deleteRequest(`api/Transactions/${transactionId}`, token, null, callback);
  };

  /**
   * DELETE transaction
   * @param {Array} idArray
   * @param {Function} callback Callback function upon successful request
   */
  static deleteTransactions = (idArray, token, callback = null) => {
    this.deleteRequest(`api/Transactions`, idArray, token, callback);
  };
}

export default TransactionApis;
