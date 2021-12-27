import React, { useState, useEffect, useRef, useContext } from "react";
import { getUserById, updateUser } from "../../../helper/userHelper";
import EdiText from "react-editext";
import Cookies from "js-cookie";
import DpEdit from "./DpEdit";
import BASE from "../../../config";
import { GameSoundContext } from "../../../context/GameSoundContext";
import FriendshipButton from "./FriendshipButton";
import ManageFriends from "./ManageFriends";
import { UserContext } from "../../../context/UserContext";

const UserInfo = ({ userId, matchesCount }) => {
  const [user, setUser] = useState({ username: "", active: true, photo: "" });
  const [userName, setUserName] = useState("");
  const [userNameValidationMsg, setUserNameValidationMsg] = useState("");
  const [descValidationMsg, setDescValidationMsg] = useState("");
  const [desc, setDesc] = useState("");
  const [newDp, setNewDp] = useState({ selectedFile: null, loaded: 0 });
  const fileSelector = useRef(null);
  const { clickSound, isMuted } = useContext(GameSoundContext);
  const [userState, setUserState] = useContext(UserContext);

  useEffect(() => {
    console.log("MOUNTED");
    getUserById(userId)
      .then((data) => {
        const { username, desc, photo, rating } = data;
        setUserName(username);
        setDesc(desc);
        setUser({ ...data, photo });
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const canEdit = () => {
    // return Cookies.get("userId") === userId;
    return userState.userId === userId;
  };
  const onChangeHandler = (event) => {
    var files = event.target.files;
    setNewDp({
      selectedFile: files,
      loaded: 0,
    });
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
  const get_league = (rating) => {
    if (rating < 800) return ["🥉", "Bronze"];
    if (rating < 1000) return ["🥈", "Silver"];
    if (rating < 1200) return ["🥇", "Gold"];
    if (rating < 1400) return ["✨", "Platinum"];
    if (rating < 1600) return ["💎", "Diamond"];
    if (rating < 1800) return ["🔴💎", "Ruby"];
    if (rating < 2000) return ["🧑🏻‍💼", "Master"];
    if (rating < 2200) return ["🧑🏻‍🎓", "Grandmaster"];
    return ["🏆🏅", "Champion"];
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
    <div
      className="grid w-full grid-cols-12 gap-4 p-4 mx-auto space-y-2 capitalize rounded-lg shadow-lg indigo-gradient dark:dark-gradient"
      data-title="general information"
      data-intro="here you can see the basic details of the user"
    >
      <div className="flex flex-col justify-center col-span-12 sm:col-span-4 lg:col-span-12">
        <div
          className="relative group"
          data-title="PROFILE PIC"
          data-intro="hover on the image to see edit or view options"
        >
          <img
            src={user.photo}
            alt="User_DP"
            className="w-32 h-32 mx-auto rounded-full lg:w-40 lg:h-40"
            // className="object-cover h-full mx-auto rounded-xl"
          />
          <div className="absolute inset-0 grid w-32 h-32 mx-auto transition duration-200 bg-gray-300 rounded-full opacity-0 lg:w-40 lg:h-40 place-content-center group-hover:opacity-90">
            {canEdit() && (
              <button
                className="text-white capitalize"
                onClick={() => {
                  if (!isMuted) clickSound.play();
                  fileSelector.current.click();
                }}
              >
                edit
              </button>
            )}
            {!canEdit() && (
              <a
                className="text-white capitalize"
                rel="noreferrer"
                target="_blank"
                href={`${BASE}/public/dp/${user.photo}`}
                onClick={() => {
                  if (!isMuted) clickSound.play();
                }}
              >
                view
              </a>
            )}
          </div>
          <input
            type="file"
            className="hidden form-control"
            accept="image/*"
            ref={fileSelector}
            onChange={onChangeHandler}
          />
        </div>
        {canEdit() &&
          newDp.selectedFile &&
          fileSelector.current.files.length !== 0 && (
            <DpEdit state={newDp} setState={setNewDp} />
          )}
        {canEdit() ? (
          <ManageFriends />
        ) : (
          <FriendshipButton userId={userId} userName={userName} />
        )}
      </div>
      <div className="flex-wrap items-center justify-around col-span-12 space-y-2 text-white sm:text-center lg:text-left sm:flex lg:block sm:col-span-8 lg:col-span-12">
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
            editButtonClassName="bg-indigo-500 text-white text-xs rounded"
            editOnViewClick={true}
            editButtonContent=""
            saveButtonContent="✔️"
            cancelButtonContent="🛑"
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
          <p className="text-xs italic font-bold">league</p>
          <h1 className="text-xl font-bold">{get_league(user?.rating)}</h1>
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
