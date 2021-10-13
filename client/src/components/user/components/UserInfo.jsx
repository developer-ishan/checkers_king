import React from "react";

const UserInfo = ({ userId }) => {
  return (
    <div className="grid w-full max-w-3xl grid-cols-12 gap-4 p-4 mx-auto space-y-2 bg-gray-800 rounded-lg shadow-lg">
      <div className="col-span-12 sm:col-span-3">
        <img
          src="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
          alt="user photo"
          className="object-cover h-full rounded-xl"
        />
      </div>
      <div className="col-span-12 space-y-2 text-white sm:col-span-9">
        <div>
          <p className="text-xs italic font-bold">username</p>
          <h1 className="text-xl font-bold">mangoman</h1>
        </div>
        <div className="">
          <p className="text-xs italic font-bold">level</p>
          <h1 className="text-xl font-bold">Grand Master</h1>
        </div>
        <div className="">
          <p className="text-xs italic font-bold">matches played</p>
          <h1 className="text-xl font-bold">140</h1>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
