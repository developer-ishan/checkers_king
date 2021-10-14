import React, { useState, useEffect } from "react";
import { getUserById } from "../../../helper/userHelper";

const UserInfo = ({ userId }) => {
  const [user, setUser] = useState({ username: "", active: true, photo: "" });
  useEffect(() => {
    getUserById(userId)
      .then((data) => {
        console.log(data);
        let f_photo, g_photo;
        if (data.facebook) f_photo = data.facebook.photo;
        if (data.google) f_photo = data.google.photo;
        let photo = f_photo
          ? f_photo
          : g_photo
          ? g_photo
          : "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png";
        console.log(photo);
        setUser({ ...data, photo });
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="grid w-full max-w-3xl grid-cols-12 gap-4 p-4 mx-auto space-y-2 bg-gray-800 rounded-lg shadow-lg">
      <div className="col-span-12 sm:col-span-3">
        <img src={user.photo} className="object-cover h-full rounded-xl" />
      </div>
      <div className="col-span-12 space-y-2 text-white sm:col-span-9">
        <div>
          <p className="text-xs italic font-bold">username</p>
          <h1 className="text-xl font-bold">{user?.username}</h1>
        </div>
        <div className="">
          <p className="text-xs italic font-bold">Rating</p>
          <h1 className="text-xl font-bold">{user?.rating}</h1>
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
