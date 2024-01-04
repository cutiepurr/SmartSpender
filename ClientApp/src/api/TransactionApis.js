import ApiFetcher from "./ApiFetcher";

class TransactionApis extends ApiFetcher {
  static getTransactions = (query, callback) => {
    this.getRequest(`/api/Transactions?${query.toString()}`, callback);
  };
  static getTransactionCounts = (query, callback) => {
    this.getRequest(`/api/Transactions/count?${query.toString()}`, callback);
  };
}

export default TransactionApis;
