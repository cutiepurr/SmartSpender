import ApiFetcher from "./ApiFetcher";

export default class TargetApis extends ApiFetcher {
  /**
   * GET targets
   * @param {string} token
   * @param {Function} callback Callback function upon successful request
   */
  static getTargets = (token, callback = null) => {
    this.getRequest(`/api/MonthlyTarget`, token, callback);
  };

  /**
   * GET targets
   * @param {string} token
   * @param {Function} callback Callback function upon successful request
   */
  static getTargetFromDate = (year, month, token, callback = null) => {
    this.getRequest(`/api/MonthlyTarget/${year}/${month}`, token, callback);
  };

  /**
   * PUT target
   * @param {string} id
   * @param {Object} body
   * @param {string} token
   * @param {Function} callback Callback function upon successful request
   */
  static putTarget = (id, body, token, callback = null) => {
    this.putRequest(`/api/MonthlyTarget/${id}`, JSON.stringify(body), token, callback);
  };

  /**
   * POST target
   * @param {Object} body
   * @param {string} token
   * @param {Function} callback Callback function upon successful request
   */
  static postTarget = (body, token, callback = null) => {
    this.postRequest(`/api/MonthlyTarget/`, JSON.stringify(body), token, callback);
  };
};