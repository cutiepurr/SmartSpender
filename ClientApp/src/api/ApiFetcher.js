import {toast} from "react-hot-toast";

class ApiFetcher {
  /**
   *
   * @param url
   * @param {string} token
   * @param callback
   */
  static getRequest = (url, token, callback = null) => {
    let headers;
    if (token !== "") headers = {
      Authorization: `Bearer ${token}`,
    }

    fetch(url, {
      headers: headers
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
      else {
        response.text().then(text => {
          try {
            let json = JSON.parse(text);
            toast.error(`${json.status} ${json.title}`);
          } catch (e) {
            toast.error(text);
          }
        })
      }
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
      else {
        response.text().then(text => {
          try {
            let json = JSON.parse(text);
            toast.error(`${json.status} ${json.title}`);
          } catch (e) {
            toast.error(text);
          }
        })
      }
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
      else {
        response.text().then(text => {
          try {
            let json = JSON.parse(text);
            toast.error(`${json.status} ${json.title}`);
          } catch (e) {
            toast.error(text);
          }
        })
      }
    });
  };
}

export default ApiFetcher;
