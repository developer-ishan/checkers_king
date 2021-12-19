import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { SocketContext } from "../../context/SocketContext";
import { getUserIdentification, signout } from "../../helper/authHelper";
import { getPreviousMatches } from "../../helper/userHelper";

import Navbar from "../Landing/components/others/Navbar";
import ErrorModal from "../modal/ErrorModal";
import PreviousMatches from "./components/PreviousMatches";
import UserInfo from "./components/UserInfo";
import RatingChart from "./components/RatingChart";

const Profile = () => {
  const { userId } = useParams();
  const [
    isMultipleDeviceDetectedModalOpen,
    setMultipleDeviceDetectedModalOpen,
  ] = useState(null);
  const [previousMatches, setPreviousMatches] = useState([]);
  const [socket, setSocket] = useContext(SocketContext);

  useEffect(() => {
    socket.on("user-error", (error) => {
      setMultipleDeviceDetectedModalOpen(error);
    });

    getPreviousMatches(userId).then((res) => {
      console.log("previous matches : ", res);
      setPreviousMatches(res);
    });
  }, []);

  const history = useHistory();

  const onClosingMultipleDeviceDetectedModal = () => {
    const id = getUserIdentification();
    //if user is guest we cannot do anything
    if (id.startsWith("guest")) return;
    //if a registered user ,logout and then redirect to home page
    else {
      setMultipleDeviceDetectedModalOpen(null);
      signout(() => {
        history.push("/");
      });
    }
  };
  return (
    <div className="space-y-3 bg-gray-100 dark:bg-gray-900">
      {/*TODO:either set the navbar global or do something of it  */}
      <Navbar />

      <div className="relative grid grid-cols-12 gap-3 p-2 mx-auto max-w-7xl">
        <div className="h-full col-span-12 lg:col-span-3 ">
          <UserInfo userId={userId} matchesCount={previousMatches.length} />
        </div>

        <div className="h-full col-span-12 lg:col-span-9 ">
          {previousMatches.length !== 0 && (
            <RatingChart userId={userId} previousMatches={previousMatches} />
          )}
        </div>

        <div className="col-span-12 lg:col-span-9">
          <PreviousMatches userId={userId} previousMatches={previousMatches} />
        </div>
      </div>

      {isMultipleDeviceDetectedModalOpen && (
        <ErrorModal
          modalState={isMultipleDeviceDetectedModalOpen}
          setModalState={setMultipleDeviceDetectedModalOpen}
          error={isMultipleDeviceDetectedModalOpen}
          cbOnRequestClose={onClosingMultipleDeviceDetectedModal}
        />
      )}
    </div>
  );
};

export default Profile;
