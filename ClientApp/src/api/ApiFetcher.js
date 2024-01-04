class ApiFetcher {
  static getRequest = (url, callback) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => callback(data));
  };
}

export default ApiFetcher;
