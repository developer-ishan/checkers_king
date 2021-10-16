import Cookies from "js-cookie";
import BASE from "../config";
import { isAuthenticated } from "./authHelper";
export const getMySummary = (token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/user/summary`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export const getUserById = (userId) => {
  const token = isAuthenticated();
  if (token && Cookies.get("userId") === userId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(`${BASE}/api/user/`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  } else {
    var myHeaders = new Headers();

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(`${BASE}/api/user/summary/${userId}`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  }
};

export const updateUser = (updatedData) => {
  console.log(JSON.stringify(updatedData));
  var myHeaders = new Headers();
  const token = isAuthenticated();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify(updatedData),
  };

  return fetch(`${BASE}/api/user/`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
