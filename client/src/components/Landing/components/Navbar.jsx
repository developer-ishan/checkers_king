import React from "react";

const Navbar = () => {
  return (
    <header class="w-full mb-4 text-gray-700 bg-white border-t border-gray-100 shadow-md body-font">
      <div class="container flex flex-col items-start justify-between px-6 py-3 mx-auto md:flex-row">
        {/* logo */}
        <a class="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
          <img src="/images/checkers-icon.png" alt="" />
        </a>
        {/* login and signups*/}
        <nav class="flex flex-wrap items-center justify-around text-base md:ml-auto space-x-2">
          {/* login form start */}
          <form action="" className="space-x-2">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="enter username"
              className="p-2 text-xs rounded "
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter password"
              className="p-2 text-xs rounded"
            />
            <button
              type="submit"
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
            <a href="#" class="fa fa-facebook bg-indigo-700 text-white p-1"></a>
            <a href="#" class="fa fa-google bg-yellow-700 text-red-300 p-1"></a>
          </div>
          {/* signup button */}
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 border-l-2 border-r-2 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
          >
            New User
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
