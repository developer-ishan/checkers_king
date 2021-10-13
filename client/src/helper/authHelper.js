import BASE from "../config";

export const register = (user) => {
  return fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const login = (user) => {
  return fetch(`${BASE}/api/auth/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const authenticate = (data, next) => {
  if (typeof Window !== "undefined") {
    localStorage.setItem("token", JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof Window !== "undefined") {
    return fetch(`${BASE}/signout`, {
      method: "GET",
    })
      .then((response) => {
        localStorage.removeItem("jwt");
        console.log("signout successful");
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  }
};

export const isAuthenticated = () => {
  if (typeof Window !== "undefined") {
    if (localStorage.getItem("token")) {
      return JSON.parse(localStorage.getItem("token"));
    }
    return false;
  } else return false;
};
