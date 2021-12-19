import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../../helper/userHelper";
import EdiText from "react-editext";
import Cookies from "js-cookie";
import DpEdit from "./DpEdit";
import BASE from "../../../config";

const UserInfo = ({ userId, matchesCount }) => {
  const [user, setUser] = useState({ username: "", active: true, photo: "" });
  const [userName, setUserName] = useState("");
  const [userNameValidationMsg, setUserNameValidationMsg] = useState("");
  const [descValidationMsg, setDescValidationMsg] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    console.log("MOUNTED");
    getUserById(userId)
      .then((data) => {
        console.log(data);
        const { username, desc, photo } = data;
        setUserName(username);
        setDesc(desc);
        setUser({ ...data, photo });
      })
      .catch((err) => console.log(err));
  }, []);

  const canEdit = () => {
    return Cookies.get("userId") === userId;
  };
  const userNameValidation = (userName) => {
    if (userName.length < 1) {
      setUserNameValidationMsg("username cannot be empty");
      return false;
    }
    setUserNameValidationMsg("checking");
    updateUser({ username: userName, desc: desc }).then((res) => {
      console.log("update response", res);
      if (!res.success) {
        setUserNameValidationMsg(res.msg);
        return false;
      } else {
        setUserNameValidationMsg("successfully updated");
        window.location.reload(false);
      }
    });
    // return true;
  };
  const descValidation = (desc) => {
    if (desc.length < 1) {
      setDescValidationMsg("description cannot be empty");
      return false;
    }
    setDescValidationMsg("updating...");
    updateUser({ username: userName, desc: desc }).then((res) => {
      console.log("update response", res);
      if (!res.success) {
        setDescValidationMsg(res.msg);
        return false;
      } else {
        setDescValidationMsg("successfully updated");
        window.location.reload(false);
      }
    });
  };
  return (
    <div className="grid w-full grid-cols-12 gap-4 p-4 mx-auto space-y-2 rounded-lg shadow-lg indigo-gradient dark:dark-gradient">
      <div className="col-span-12 sm:col-span-4 lg:col-span-12">
        <img
          src={`${BASE}/public/dp/${user.photo}`}
          alt="User_DP"
          // className="object-cover h-full mx-auto rounded-xl"
        />
        {canEdit() && <DpEdit />}
      </div>
      <div className="col-span-12 space-y-2 text-white sm:col-span-8 lg:col-span-12">
        <div className="">
          <p className="text-xs italic font-bold">username</p>
          <EdiText
            type="text"
            hint="chage your username"
            inputProps={{
              className: "text-black rounded",
              placeholder: "enter username",
            }}
            viewContainerClassName="flex flex-col md:flex-row lg:flex-col space-around"
            saveButtonClassName="bg-green-400 text-white text-xs p-1 rounded m-1"
            editButtonClassName="bg-indigo-500 text-white text-xs p-1 rounded"
            editButtonContent="edit"
            saveButtonContent="save"
            cancelButtonContent="cancel"
            cancelButtonClassName="bg-red-500 text-white text-xs p-1 rounded m-1"
            validation={userNameValidation}
            validationMessage={userNameValidationMsg}
            value={userName}
            onSave={setUserName}
            showButtonsOnHover={true}
            submitOnEnter={true}
            cancelOnEscape={true}
            canEdit={canEdit}
            cancelOnUnfocus={true}
          />
          {/* <h1 className="text-xl font-bold ">{user?.username}</h1> */}
        </div>
        <div className="">
          <p className="text-xs italic font-bold">Rating</p>
          <h1 className="text-xl font-bold">{user?.rating}</h1>
        </div>
        <div className="">
          <p className="text-xs italic font-bold">matches played</p>
          <h1 className="text-xl font-bold">{matchesCount}</h1>
        </div>
        <div className="">
          <p className="text-xs italic font-bold">about</p>
          <EdiText
            type="textarea"
            hint="write something about yourself"
            inputProps={{
              className: "text-black rounded",
              placeholder: "tell others what you like",
            }}
            viewContainerClassName="flex flex-col md:flex-row lg:flex-col space-around"
            saveButtonClassName="bg-green-400 text-white text-xs p-1 rounded m-1"
            editButtonClassName="bg-indigo-500 text-white text-xs p-1 rounded"
            editButtonContent="edit"
            saveButtonContent="save"
            cancelButtonContent="cancel"
            cancelButtonClassName="bg-red-500 text-white text-xs p-1 rounded m-1"
            validation={descValidation}
            validationMessage={descValidationMsg}
            value={desc}
            onSave={setDesc}
            showButtonsOnHover={true}
            submitOnEnter={true}
            cancelOnEscape={true}
            canEdit={canEdit}
            cancelOnUnfocus={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
