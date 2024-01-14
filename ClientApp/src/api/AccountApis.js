import ApiFetcher from "./ApiFetcher";

class AccountApis extends ApiFetcher {

  static getAccount = (callback = null) => {
    this.getRequest(`/api/Account`, callback);
  }

  static postAccount = (account, callback = null) => {
    this.postRequest(`/api/Account`, account, callback);
  }
}

export default AccountApis;
