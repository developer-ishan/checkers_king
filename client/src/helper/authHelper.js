import BASE from "../config";
import Cookies from "js-cookie";

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
    Cookies.set("token", data.token);
    Cookies.set("userId", data.userId);
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

// generates a random ID number for the guest joining for first time
const generateRandomId = () => {
  const incrementor1 = 123456789,
    multiplier1 = 987654321;
  const incrementor2 = 987654321,
    multiplier2 = 123456789;
  const randomNumber =
    Math.floor(Math.random() * multiplier1 + incrementor1) +
    Math.floor(Math.random() * multiplier2 + incrementor2);
  return "guest" + randomNumber.toString();
};

export const getUserIdentification = () => {
  const token = isAuthenticated();
  if (token) return token;
  else {
    var guestId = Cookies.get("guestId");
    if (!guestId) {
      guestId = generateRandomId();
      Cookies.set("guestId", guestId);
    }
    return guestId;
  }
};
