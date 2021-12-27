import introJs from "intro.js";
import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { Link, useHistory } from "react-router-dom";
import { GameSoundContext } from "../../../../context/GameSoundContext";
import { SocketContext } from "../../../../context/SocketContext";
import { UserContext } from "../../../../context/UserContext";
import {
  authenticate,
  isAuthenticated,
  login,
  signout,
  register,
} from "../../../../helper/authHelper";
import { getMySummary } from "../../../../helper/userHelper";
import ErrorModal from "../../../modal/ErrorModal";
import SmallScreenInfoModal from "../../../modal/SmallScreenInfoModal";
import LoginSignUpForm from "./LoginSignUpForm";
Modal.setAppElement("#root");

require("dotenv").config();
const Navbar = () => {
  const [userState, setUserState] = useContext(UserContext);
  const [socket, setSocket] = useContext(SocketContext);
  const { clickSound, selectSound, isMuted } = useContext(GameSoundContext);
  const history = useHistory();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState({
    username: undefined,
    active: false,
    _id: undefined,
    photo: undefined,
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
  }, [socket]);

  useEffect(() => {
    let token = isAuthenticated();
    if (token) {
      console.log("getting user details with token...");
      setAuth(token);
      getMySummary(token)
        .then((data) => {
          if (!data.photo) setUser({ ...data, photo: "/images/default.png" });
          else setUser(data);
          setUserState({ ...userState, userId: data._id });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [socket]);

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
            setEmail("");
            setPassword("");
            setLoginLoading(false);
            setIsLoginModalOpen(false);
            console.log("reloading due to nav", result.userId);
            history.push("/");
            setUserState({
              ...userState,
              userId: result.userId,
              socketReinitialize: !userState.socketReinitialize,
            });
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
          setIsLoginModalOpen(false);
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
          setSignUpLoading(false);
          setIsErrorModalOpen(true);
          setIsLoginModalOpen(false);
        } else {
          setError({
            title: "SignUp Error",
            msg: `${result.err}`,
            buttonText: "okay",
            redirectTo: "",
          });
          setSignUpLoading(false);
          setIsErrorModalOpen(true);
          setIsLoginModalOpen(false);
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };

  const handleToggle = () => {
    const html = document.querySelector("html");
    if (!isMuted) selectSound.play();
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
    <div className="bg-white shadow-md dark:bg-gray-700">
      <header className="flex flex-col items-center w-full mx-auto text-gray-700 max-w-screen-2xl sm:flex-row dark:text-white body-font">
        {/* logo and toggle btn */}
        <div className="flex items-center justify-between w-full max-w-sm px-6 py-3 md:flex-row">
          <span
            data-title="Welcome!"
            data-intro="i am a website tour , i will navigate you throught the website you can also use keyboard arrow keys to navigate"
          ></span>
          {/* logo */}
          <Link
            to="/"
            className="flex items-center font-medium text-gray-900 title-font md:mb-0"
            data-title="Welcome!"
            data-intro="we hope you will enjoy the game. see u on the leaderboard 🤠"
          >
            <img src="/images/checkers-icon.png" alt="" />
            <p className="m-2 text-xs leading-4 tracking-wider uppercase dark:text-white">
              checkers <br /> king
            </p>
          </Link>
          {/* dark mode toggle */}
          <div
            className="relative flex items-center justify-end mx-auto space-x-2"
            data-title="dark mode"
            data-intro="click on the toggle to change the theme"
          >
            <span className="text-xs font-semibold">Light </span>
            <div>
              <input
                type="checkbox"
                name=""
                id="checkbox"
                className="hidden"
                checked={darkMode}
                onClick={handleToggle}
              />
              <label for="checkbox" className="cursor-pointer">
                <div className="flex items-center h-5 bg-gray-300 rounded-full w-9 p2">
                  <div className="w-4 h-4 bg-white rounded-full shadow switch-ball"></div>
                </div>
              </label>
            </div>
            <span className="text-xs font-semibold">Dark</span>
          </div>
        </div>

        {/* login handle */}
        <div
          className="flex flex-col items-center justify-end w-full px-2 sm:flex-row"
          data-title="Account"
          data-intro="manage your account here , you will need one to save your matches"
        >
          {/* if not logged in show signup button */}
          {!auth && (
            <button
              className="block w-full px-4 py-2 mx-2 ml-auto text-xs font-bold text-white uppercase transition-all duration-150 bg-purple-500 rounded shadow outline-none sm:w-auto active:bg-purple-600 hover:shadow-md hover:bg-purple-600 focus:outline-none ease"
              onClick={() => {
                setIsLoginModalOpen(true);
                if (!isMuted) clickSound.play();
              }}
            >
              login
            </button>
          )}

          {/* if logged in show user profiles */}
          {auth && (
            <div className="flex flex-col items-center justify-end w-full md:w-auto sm:flex-row md:flex-row">
              {/* logged in user info */}
              <div className="flex items-center p-2">
                <div className="w-8 h-8 ">
                  <img
                    src={user?.photo}
                    className="w-full h-full rounded-full"
                  ></img>
                </div>
                <div>
                  {user?.username && (
                    <h1>
                      <Link to={`/user/${user._id}`} className="inline-block">
                        {user.username}
                      </Link>
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
                    setUserState((prevState) => {
                      return {
                        ...prevState,
                        socketReinitialize: !userState.socketReinitialize,
                      };
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
          <button
            className="block w-full px-4 py-2 mx-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-gray-500 rounded shadow outline-none sm:w-auto active:bg-yellow-500 hover:shadow-md hover:bg-gray-600 focus:outline-none ease"
            data-hint="click on this button to take tour of website"
            data-hintposition="top-left"
            onClick={() => {
              introJs().start();
              if (!isMuted) clickSound.play();
            }}
          >
            take tour!
          </button>
        </div>
        {/* modal containing the login form */}
        <SmallScreenInfoModal
          title="login"
          modalState={isLoginModalOpen}
          setModalState={setIsLoginModalOpen}
        >
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
        </SmallScreenInfoModal>
        {error && (
          <ErrorModal
            modalState={isErrorModalOpen}
            setModalState={setIsErrorModalOpen}
            error={error}
          />
        )}
      </header>
    </div>
  );
};

export default Navbar;
