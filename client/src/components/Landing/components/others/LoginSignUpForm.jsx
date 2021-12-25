import React from "react";
import BASE from "../../../../config";

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
    <div className="flex flex-col p-3 space-y-2">
      {/* input fields */}
      <form method="POST" className="space-y-2">
        <input
          type="text"
          name="username"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          className="w-full max-w-md p-2 text-xs rounded dark:text-black dark:bg-gray-100"
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          minLength="8"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full max-w-md p-2 text-xs rounded dark:text-black dark:bg-gray-100"
          title="password must be minimum 8 character long"
        />
      </form>
      {/* login form end */}

      {/* btn groups */}
      <div className="space-y-2">
        {/* login btn */}
        <button
          onClick={(e) => handleLogIn(e)}
          className="flex items-center justify-center w-full px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none hover:bg-indigo-600 active:border-indigo-600 active:bg-teal-600 hover:shadow-md focus:outline-none ease"
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
            <p className="mx-auto">Login</p>
          )}
        </button>

        {/* signup button */}
        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none hover:bg-indigo-600 active:border-indigo-600 active:bg-indigo-600 hover:shadow-md focus:outline-none ease"
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
            <p className="mx-auto">SignUP</p>
          )}
        </button>
        <p className="text-xs text-center capitalize">or login using</p>
        {/* social groups */}
        <div className="flex space-x-1 text-center">
          <a
            href={`${BASE}/api/auth/oauth/facebook`}
            className="fa fa-facebook bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 w-full  rounded"
          ></a>

          <a
            href={`${BASE}/api/auth/oauth/google`}
            className="fa fa-google bg-red-600 hover:bg-red-700 text-white px-4 py-2 w-full  rounded"
          ></a>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpForm;
