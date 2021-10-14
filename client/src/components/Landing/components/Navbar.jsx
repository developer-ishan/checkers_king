import React, { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom'
import {
  authenticate,
  isAuthenticated,
  login,
  signout,
  register
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
  useEffect(async () => {
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
          authenticate(result, () => {
            setAuth(result.token);
          });
        }
      })
      .catch((err) => console.log("ERROR:", err));
  };

  return (
    <header class="w-full mb-4 text-gray-700 bg-white border-t border-gray-100 shadow-md body-font">
      <div class="container flex flex-col items-start justify-between px-6 py-3 mx-auto md:flex-row">
        {/* logo */}
        <a
          href="!#"
          class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
        >
          <img src="/images/checkers-icon.png" alt="" />
        </a>
        {/* login and signups*/}
        <nav class="flex flex-wrap items-center justify-around text-base md:ml-auto space-x-2">
          {!auth && (
            <LoginSignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogIn={handleLogIn}
              handleSignup={handleSignup}
            />
          )}

          {auth && <div>
            {user?.username && <a href={`/user/${user._id}`}><h1>{user.username}</h1></a>}
            {user?.f_photo ? (
              <img src={user?.f_photo}></img>
            ) : user?.g_photo ? (
              <img src={user?.g_photo}></img>
            ) : (
              <img src="https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"></img>
            )}
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
                  history.push("/")
                });
              }}
            >
              Logout
            </button>
          </div>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
