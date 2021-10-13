import React, { useState } from "react";
import BASE from "../../../config";
import {
  authenticate,
  isAuthenticated,
  login,
} from "../../../helper/authHelper";
import LoginSignUpForm from "./LoginSignUpForm";

require("dotenv").config();
const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLogIn = (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;
    login({ email, password })
      .then((result) => {
        if (result.success) {
          authenticate(result.token, () => {
            setUserLoggedIn(true);
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
          {!userLoggedIn && !isAuthenticated() && (
            <LoginSignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogIn={handleLogIn}
            />
          )}
          {userLoggedIn && <h1>welcome player!</h1>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
