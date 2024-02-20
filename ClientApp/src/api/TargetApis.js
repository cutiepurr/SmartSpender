import ApiFetcher from "./ApiFetcher";

export default class TargetApis extends ApiFetcher {
  /**
   * GET targets
   * @param token
   * @param {Function} callback Callback function upon successful request
   */
  static getTargets = (token, callback = null) => {
    this.getRequest(`/api/MonthlyTarget`, token, callback);
  };
};