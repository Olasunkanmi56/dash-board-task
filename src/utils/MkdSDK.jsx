export default function MkdSDK() {
  this._baseurl = "https://reacttask.mkdlabs.com";
  this._project_id = "reacttask";
  this._secret = "d9hedycyv6p7zw8xi34t9bmtsjsigy5t7";
  this._table = "";
  this._custom = "";
  this._method = "";

  const raw = this._project_id + ":" + this._secret;
  let base64Encode = btoa(raw);

  this.setTable = function (table) {
    this._table = table;
  };
  
  this.login = async function (email, password, role) {
    //TODO
    const loginData = {
      email: email,
      password: password,
      role: role
    };
    try {
      const loginResult = await fetch(
        this._baseurl + "/v2/api/lambda/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-project": base64Encode,
          },
          body: JSON.stringify(loginData),
        }
      );
      const jsonLogin = await loginResult.json();
       console.log(jsonLogin);
      if (loginResult.status !== 200) {
        throw new Error(jsonLogin.message);
      }
  
      // Check if the token is empty
      if (!jsonLogin.token) {
        throw new Error("Token is empty in the response.");
      }
      // Store the token in localStorage
      localStorage.setItem("token", jsonLogin.token);
      return jsonLogin;
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  };

  this.getHeader = function () {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "x-project": base64Encode,
    };
  };

  this.baseUrl = function () {
    return this._baseurl;
  };
  
  this.callRestAPI = async function (payload, method) {
    const header = {
      "Content-Type": "application/json",
      "x-project": base64Encode,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    switch (method) {
      case "GET":
        const getResult = await fetch(
          this._baseurl + `/v1/api/rest/${this._table}/GET`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonGet = await getResult.json();

        if (getResult.status === 401) {
          throw new Error(jsonGet.message);
        }

        if (getResult.status === 403) {
          throw new Error(jsonGet.message);
        }
        return jsonGet;
      
      case "PAGINATE":
        if (!payload.page) {
          payload.page = 1;
        }
        if (!payload.limit) {
          payload.limit = 10;
        }
        const paginateResult = await fetch(
          this._baseurl + `/v1/api/rest/${this._table}/${method}`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonPaginate = await paginateResult.json();

        if (paginateResult.status === 401) {
          throw new Error(jsonPaginate.message);
        }

        if (paginateResult.status === 403) {
          throw new Error(jsonPaginate.message);
        }
        return jsonPaginate;
      default:
        break;
    }
  };  

  this.check = async function (role) {
    //TODO
    try {
      const userDetails = await fetch(
        this._baseurl + "/v1/api/user/details",
        {
          method: "GET",
          headers: this.getHeader(),
        }
      );
      const jsonUserDetails = await userDetails.json();

      if (userDetails.status !== 200) {
        throw new Error(jsonUserDetails.message);
      }

      if (jsonUserDetails.role === role) {
        return true; // User has the expected role
      } else {
        return false; // User does not have the expected role
      }
    } catch (error) {
      throw new Error("Role check failed: " + error.message);
    }
  };

  return this;
}
