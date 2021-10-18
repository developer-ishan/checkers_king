import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  authenticate,
  isAuthenticated,
  login,
  signout,
  register,
} from "../../../helper/authHelper";
import { getMySummary } from "../../../helper/userHelper";
import LoginSignUpForm from "./LoginSignUpForm";

require("dotenv").config();
const Navbar = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({
    username: undefined,
    active: false,
    _id: undefined,
    f_photo: undefined,
    g_photo: undefined,
  });
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
    login({ email, password })
      .then((result) => {
        if (result.success) {
          authenticate(result, () => {
            setAuth(result.token);
          });
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };
  const handleSignup = (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;
    register({ email, password })
      .then((result) => {
        if (result.success) {
          console.log("User Signed up successfully!!")
          setEmail("");
          setPassword("");
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };

  return (
    <header class="w-full mb-4 text-gray-700 bg-white border-t border-gray-100 shadow-md body-font">
      <div class="flex flex-col items-center justify-between px-6 py-3  md:flex-row">
        {/* logo */}
        <a
          href="!#"
          class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
        >
          <img src="/images/checkers-icon.png" alt="" />
          <p className="m-2 text-xs leading-4 tracking-wider uppercase">
            checker's <br /> king
          </p>
        </a>
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
              />
            </div>
          )}

          {auth && (
            <div className="flex flex-col items-center justify-between ml-auto md:flex-row">
              {/* logged in user info */}
              <div className="flex items-center p-2">
                <div className="w-8 h-8 ">
                  {user?.f_photo ? (
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
                  )}
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
    </header>
  );
};

export default Navbar;
