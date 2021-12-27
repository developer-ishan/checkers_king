import Cookies from "js-cookie";
import BASE from "../config";
import { isAuthenticated } from "./authHelper";
export const getMySummary = (token) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
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
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(`${BASE}/api/user/`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  } else {
    let myHeaders = new Headers();

    let requestOptions = {
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
  let myHeaders = new Headers();
  const token = isAuthenticated();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  let requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify(updatedData),
  };

  return fetch(`${BASE}/api/user/`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export const getPreviousMatches = (userId) => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/match/${userId}`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export const getChatsByMatchId = (matchId) => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/chat/${matchId}`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
export const getFriendShipStatus = (userId) => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/friend/status/${userId}`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
export const getAllFriendsOfUser = () => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/friend/`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
export const getAllFriendRequestsToUser = () => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/friend/requests`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
export const getAllSentRequestByUser = () => {
  const token = isAuthenticated();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${BASE}/api/friend/requestssent`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
export const getLeaderBoard = (pageno = 1, quantity = 10) => {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return fetch(
    `${BASE}/api/game/leaderboard?pageNo=${pageno}&size=${quantity}`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
