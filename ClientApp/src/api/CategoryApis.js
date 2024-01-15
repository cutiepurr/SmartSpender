import ApiFetcher from "./ApiFetcher";

class CategoryApis extends ApiFetcher {
  /**
   * GET all categories
   * @param {Function} callback Callback function upon successful request
   */
  static getCategories = (callback) => {
    this.getRequest(`/api/Category`, null, callback);
  };
}

export default CategoryApis;
