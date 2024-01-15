class ApiFetcher {
  static getRequest = (url, token = null, callback = null) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (callback !== null) callback(data);
      });
  };

  static postRequest = (url, body, token = null, callback = null) => {
    fetch(url, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok && callback !== null) callback();
      else alert("Cannot add");
    });
  };

  static putRequest = (url, body, token = null, callback = null) => {
    fetch(url, {
      method: "PUT",
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok && callback !== null) callback();
      else alert("Cannot edit");
    });
  };

  static deleteRequest = (url, body, token = null, callback = null) => {
    fetch(url, {
      method: "DELETE",
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
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
