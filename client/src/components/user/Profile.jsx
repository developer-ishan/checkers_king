import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { SocketContext } from "../../context/SocketContext";
import { getUserIdentification, signout } from "../../helper/authHelper";
import { getPreviousMatches } from "../../helper/userHelper";

import Navbar from "../Landing/components/others/Navbar";
import Footer from "../Landing/components/others/Footer";
import ErrorModal from "../modal/ErrorModal";
import PreviousMatches from "./components/PreviousMatches";
import UserInfo from "./components/UserInfo";
import RatingChart from "./components/RatingChart";
import Friend from "../friend/Friend";

const Profile = () => {
  const { userId } = useParams();
  const [
    isMultipleDeviceDetectedModalOpen,
    setMultipleDeviceDetectedModalOpen,
  ] = useState(null);
  const [previousMatches, setPreviousMatches] = useState([]);
  const [socket, setSocket] = useContext(SocketContext);
  const [xLabels, setXLabels] = useState(["0"]);
  const [yLabels, setYLabels] = useState([800]);

  useEffect(() => {
    socket.on("user-error", (error) => {
      setMultipleDeviceDetectedModalOpen(error);
    });

    getPreviousMatches(userId)
      .then((res) => {
        console.log(res);
        setPreviousMatches(res);
      })
      .catch((err) => {
        console.log("Error : ", err);
      });

    return () => {
      socket.off("user-error");
    };
  }, [userId, socket]);

  useEffect(() => {
    console.log("running graph making...");
    let currRating = 800,
      matchNumber = 0;
    let xValues = [];
    let yValues = [];
    xValues.push(matchNumber.toString());
    yValues.push(currRating);

    for (let itr = previousMatches.length - 1; itr >= 0; --itr) {
      if (
        previousMatches[itr].players.length === 2 &&
        previousMatches[itr].isRated
      ) {
        matchNumber++;
        xValues.push(matchNumber.toString());
        if (previousMatches[itr].players[0].id === userId) {
          currRating += previousMatches[itr].players[0].ratingChange;
          yValues.push(currRating);
        } else {
          currRating += previousMatches[itr].players[1].ratingChange;
          yValues.push(currRating);
        }
      }
    }

    setXLabels(xValues);
    setYLabels(yValues);
  }, [userId, previousMatches]);

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
    <div className="mx-auto space-y-3 bg-gray-100 dark:bg-gray-900 max-w-screen-2xl">
      {/*TODO:either set the navbar global or do something of it  */}
      <Navbar />

      <div className="relative grid grid-cols-12 gap-3 p-2 mx-auto max-w-7xl">
        <div className="top-0 col-span-12 lg:h-screen lg:sticky lg:col-span-3 ">
          {previousMatches && (
            <UserInfo userId={userId} matchesCount={previousMatches.length} />
          )}
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div
            data-title="PLAYER GRAPH"
            data-intro="this show players performance in the past"
          >
            <RatingChart xLabels={xLabels} yLabels={yLabels} />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <PreviousMatches
              userId={userId}
              previousMatches={previousMatches}
            />
          </div>

          {/* <div className="col-span-12 lg:col-span-9">
            <Friend userId={userId} />
          </div> */}
        </div>
      </div>
      <Footer />

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
