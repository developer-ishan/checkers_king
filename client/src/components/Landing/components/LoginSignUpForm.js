import React from "react";
import BASE from "../../../config";

const LoginSignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogIn,
  loginLoading,
  signUpLoading,
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
          className="p-2 text-xs rounded dark:text-black dark:bg-gray-100"
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          minLength="8"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
          className="p-2 text-xs rounded dark:text-black dark:bg-gray-100"
          title="password must be minimum 8 character long"
        />
        <button
          onClick={(e) => handleLogIn(e)}
          className="flex items-center justify-between px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
        >
          {loginLoading ? (
            <>
              <img
                src="https://img.icons8.com/ios-filled/50/000000/loading.png"
                className="w-3 h-3 mr-2 animate-spin"
              />
              Logging In
            </>
          ) : (
            <>Login</>
          )}
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
        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 border-l-2 border-r-2 rounded shadow outline-none active:bg-indigo-600 hover:shadow-md focus:outline-none ease"
        onClick={(e) => handleSignup(e)}
      >
        {signUpLoading ? (
          <>
            <img
              src="https://img.icons8.com/ios-filled/50/000000/loading.png"
              className="w-3 h-3 mr-2 animate-spin"
            />
            signing up
          </>
        ) : (
          <>SignUP</>
        )}
      </button>
    </>
  );
};

export default LoginSignUpForm;
