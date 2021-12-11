import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import {
  authenticate,
  isAuthenticated,
  login,
  signout,
  register,
} from "../../../helper/authHelper";
import { getMySummary } from "../../../helper/userHelper";
import ErrorModal from "../../modal/ErrorModal";
import LoginSignUpForm from "./LoginSignUpForm";
Modal.setAppElement("#root");

require("dotenv").config();
const Navbar = () => {
  const [userState, setUserState] = useContext(UserContext);
  const history = useHistory();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({
    username: undefined,
    active: false,
    _id: undefined,
    f_photo: undefined,
    g_photo: undefined,
  });
  useEffect(() => {
    const html = document.querySelector("html");
    if (!("DarkMode" in localStorage)) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
        setDarkMode(true);
      } else {
        html.classList.remove("dark");
        setDarkMode(false);
      }
    } else {
      if (localStorage.getItem("DarkMode") === "true") {
        html.classList.add("dark");
        setDarkMode(true);
      } else {
        html.classList.remove("dark");
        setDarkMode(false);
      }
    }
  }, []);
  useEffect(() => {
    let token = isAuthenticated();
    if (token) {
      setAuth(token);
      getMySummary(token)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [auth]);
  const handleLogIn = (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;
    setLoginLoading(true);
    login({ email, password })
      .then((result) => {
        console.log("login result:", result);
        if (result.success) {
          authenticate(result, () => {
            setAuth(result.token);
            setLoginLoading(false);
          });
        } else {
          setError({
            title: "invalid credential",
            msg: `${result.err}`,
            buttonText: "okay",
            redirectTo: "",
          });
          setLoginLoading(false);
          setIsErrorModalOpen(true);
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };
  const handleSignup = (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;
    if (password.length < 8) {
      alert("min 8 character password required");
      return;
    }
    setSignUpLoading(true);
    register({ email, password })
      .then((result) => {
        console.log("signu result:", result);
        if (result.success) {
          console.log("User Signed up successfully!!");
          setEmail("");
          setPassword("");
          setError({
            title: "email verification",
            msg: "a verification mail has been sent to your mail id. click on the link to verify account",
            buttonText: "okay",
            redirectTo: "",
          });
          setIsErrorModalOpen(true);
        } else {
          setError({
            title: "SignUp Error",
            msg: `${result.err}`,
            buttonText: "okay",
            redirectTo: "",
          });
          setSignUpLoading(false);
          setIsErrorModalOpen(true);
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };
  const handleToggle = () => {
    const html = document.querySelector("html");
    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("DarkMode", "false");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("DarkMode", "true");
      setDarkMode(true);
    }
  };

  return (
    <header class="w-full mb-4 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border-t border-gray-100 shadow-md body-font">
      <div class="flex flex-col items-center justify-between px-6 py-3  md:flex-row">
        {/* logo */}
        <a
          href="/"
          class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
        >
          <img src="/images/checkers-icon.png" alt="" />
          <p className="m-2 text-xs leading-4 tracking-wider uppercase dark:text-white">
            checkers <br /> king
          </p>
        </a>
        {/* dark mode toggle */}
        <div class="flex justify-end items-center space-x-2 mx-auto relative">
          <span class="text-xs font-extralight">Light </span>
          <div>
            <input
              type="checkbox"
              name=""
              id="checkbox"
              class="hidden"
              checked={darkMode}
              onClick={handleToggle}
            />
            <label for="checkbox" class="cursor-pointer">
              <div class="w-9 h-5 flex items-center bg-gray-300 rounded-full p2">
                <div class="w-4 h-4 switch-ball bg-white rounded-full shadow"></div>
              </div>
            </label>
          </div>
          <span class="text-xs font-semibold">Dark</span>
        </div>
        {/* login and signups*/}
        <nav class="flex flex-wrap items-center text-base md:ml-auto space-x-2 flex-1">
          {!auth && (
            <div className="flex items-center justify-around ml-auto">
              <LoginSignUpForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogIn={handleLogIn}
                handleSignup={handleSignup}
                loginLoading={loginLoading}
                signUpLoading={signUpLoading}
              />
            </div>
          )}

          {auth && (
            <div className="flex flex-col items-center justify-between ml-auto md:flex-row">
              {/* logged in user info */}
              <div className="flex items-center p-2">
                <div className="w-8 h-8 ">
                  <img
                    src={userState.photo}
                    className="w-full rounded-full"
                  ></img>
                  {/* {user?.f_photo ? (
                    <img
                      src={user?.f_photo}
                      className="w-full rounded-full"
                    ></img>
                  ) : user?.g_photo ? (
                    <img
                      src={user?.g_photo}
                      className="w-full rounded-full"
                    ></img>
                  ) : (
                    <img
                      className="w-full rounded-full"
                      src="https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
                    ></img>
                  )} */}
                </div>
                <div>
                  {user?.username && (
                    <h1>
                      <a href={`/user/${user._id}`} className="inline-block">
                        {user.username}
                      </a>
                    </h1>
                  )}
                </div>
              </div>
              {/* logout button */}
              <button
                onClick={() => {
                  signout(() => {
                    setAuth(false);
                    setUser({
                      username: undefined,
                      active: false,
                      _id: undefined,
                      f_photo: undefined,
                      g_photo: undefined,
                    });
                    history.push("/");
                  });
                }}
                className="w-full px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none sm:w-min active:bg-indigo-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
      {error && (
        <ErrorModal
          modalState={isErrorModalOpen}
          setModalState={setIsErrorModalOpen}
          error={error}
        />
      )}
    </header>
  );
};

export default Navbar;
