import BASE from "../config";
import Cookies from 'js-cookie';

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
    Cookies.set("token",data.token)
    Cookies.set("userId",data.userId)
    // localStorage.setItem("token", JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof Window !== "undefined") {
    return fetch(`${BASE}/signout`, {
      method: "GET",
    })
      .then((response) => {
        Cookies.remove("token");
        Cookies.remove("userId");
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
  const token = Cookies.get("token");
  if (typeof Window !== "undefined") {
    if (token) {
      return token;
    }
    return false;
  } else return false;
};
