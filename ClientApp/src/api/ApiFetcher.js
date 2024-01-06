class ApiFetcher {
  static getRequest = (url, callback) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (callback !== null) callback(data);
      });
  };

  static postRequest = (url, body, callback) => {
    fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok && callback !== null) callback();
      else alert("Cannot add");
    });
  };

  static putRequest = (url, body, callback) => {
    fetch(url, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok && callback !== null) callback();
      else alert("Cannot edit");
    });
  };

  static deleteRequest = (url, body, callback) => {
    fetch(url, {
      method: "DELETE",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      if (response.ok && callback !== null) callback();
      else alert("Cannot delete");
    });
  };
}

export default ApiFetcher;
