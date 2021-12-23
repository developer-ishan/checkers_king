import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/others/Navbar";
import { SocketContext } from "../../context/SocketContext";
import Leaderboard from "./components/others/Leaderboard";
import RandomPlay from "./components/gameCreateJoin/RandomPlay";
import PlayWithFriends from "./components/gameCreateJoin/PlayWithFriends";
import Modal from "react-modal";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { playWelcomeSound } from "../../helper/audioHelper";
import SnackBar from "./components/others/SnackBar";
import { getUserIdentification, signout } from "../../helper/authHelper";
import { useHistory } from "react-router-dom";
import ErrorModal from "../modal/ErrorModal";
import OnlineFriends from "../friend/components/OnlineFriends"
Modal.setAppElement("#root");
const Home = ({ games, setGames }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [snackBarContent, setSnackBarContent] = useState("");
  const [onGoingGameDetails, setOnGoingGameDetails] = useState(null);
  const [
    isMultipleDeviceDetectedModalOpen,
    setMultipleDeviceDetectedModalOpen,
  ] = useState(null);
  const history = useHistory();
  useEffect(() => {
    // receiving the ongoing games information
    socket.on("games", (games) => {
      setGames(games);
    });
    socket.on("ongoing-game", (gameDetails) => {
      console.log("rejoin snackbar", gameDetails);
      setSnackBarContent("got disconnected...?");
      setOnGoingGameDetails(gameDetails);
    });
    socket.on("user-error", (error) => {
      setMultipleDeviceDetectedModalOpen(error);
    });

    introJs()
      .setOptions({
        disableInteraction: true,
      })
      .addHints();
    playWelcomeSound();
    console.log("mounded");
  }, []);
  const rejoinPlayerToGame = () => {
    const token = getUserIdentification();
    socket.emit("join-game", onGoingGameDetails.id, token);
    history.push("/game");
  };
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
    <div className="min-h-screen bg-yellow-300 dark:bg-gray-900 dark:text-gray-200">
      {snackBarContent && (
        <SnackBar
          message={snackBarContent}
          setSnackBarContent={setSnackBarContent}
          btnText="rejoin"
          btnAction={rejoinPlayerToGame}
          stayOnScreen={true}
        />
      )}
      {isMultipleDeviceDetectedModalOpen && (
        <ErrorModal
          modalState={isMultipleDeviceDetectedModalOpen}
          setModalState={setMultipleDeviceDetectedModalOpen}
          error={isMultipleDeviceDetectedModalOpen}
          cbOnRequestClose={onClosingMultipleDeviceDetectedModal}
        />
      )}
      <Navbar />
      <div className="grid grid-cols-12 mx-auto max-w-screen-2xl">
        {/* left side */}
        <div className="col-span-12 col-start-1 px-5 lg:col-span-8 ">
          <RandomPlay socket={socket} d />
          <PlayWithFriends socket={socket} />
        </div>

        {/* rightside */}
        <div className="col-span-12 lg:col-span-auto lg:col-start-9">
          <Leaderboard />
        </div>
        <div className="col-span-12 lg:col-span-auto lg:col-start-9">
          <OnlineFriends />
        </div>
      </div>
    </div>
  );
};

export default Home;
