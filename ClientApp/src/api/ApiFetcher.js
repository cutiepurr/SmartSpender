class ApiFetcher {
  static getRequest = (url, callback) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => callback(data));
  };

  static postRequest = (url, body, callback) => {
    fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) callback();
      else alert("Cannot add transaction");
    });
  };
}

export default ApiFetcher;
