import React from "react";
import BASE from "../../../config";

const LoginSignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogIn,
  handleSignup,
}) => {
  return (
    <>
      <form method="POST" className="space-x-2">
        <input
          type="text"
          name="username"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter email"
          className="p-2 text-xs rounded "
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
          className="p-2 text-xs rounded"
        />
        <button
          onClick={(e) => handleLogIn(e)}
          className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
        >
          Login
        </button>
      </form>
      {/* login form end */}
      {/* socila login icons */}
      <div
        className="space-x-1"
        className="px-3 space-x-2 border-l-2 border-r-2 border-black"
      >
        <a
          href={`${BASE}/api/auth/oauth/facebook`}
          class="fa fa-facebook bg-indigo-700 text-white p-1"
        ></a>

        <a
          href={`${BASE}/api/auth/oauth/google`}
          class="fa fa-google bg-yellow-700 text-red-300 p-1"
        ></a>
      </div>
      {/* signup button */}
      <button
        type="submit"
        className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 border-l-2 border-r-2 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
        onClick={(e) => handleSignup(e)}
      >
        signup
      </button>
    </>
  );
};

export default LoginSignUpForm;
