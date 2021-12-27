import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/others/Navbar";
import { SocketContext } from "../../context/SocketContext";
import Leaderboard from "./components/others/Leaderboard";
import RandomPlay from "./components/gameCreateJoin/RandomPlay";
import PlayWithFriends from "./components/gameCreateJoin/PlayWithFriends";
import Modal from "react-modal";
import introJs from "intro.js";
import "intro.js/introjs.css";
import SnackBar from "./components/others/SnackBar";
import {
  getUserIdentification,
  isAuthenticated,
  signout,
} from "../../helper/authHelper";
import { Link, useHistory } from "react-router-dom";
import ErrorModal from "../modal/ErrorModal";
import { GameSoundContext } from "../../context/GameSoundContext";
import OnlineFriends from "../friend/components/OnlineFriends";
import FindUser from "./components/others/FindUser";
import GamePosters from "./components/others/GamePosters";
import Footer from "./components/others/Footer";
import { UserContext } from "../../context/UserContext";
import ConfirmModal from "../modal/ConfirmModal";
import SmallScreenInfoModal from "../modal/SmallScreenInfoModal";
Modal.setAppElement("#root");

Modal.setAppElement("#root");
const Home = ({ games, setGames }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const { welcomeSound, isMuted, notificationSound } =
    useContext(GameSoundContext);
  const [userState, setUserState] = useContext(UserContext);
  const [snackBarContent, setSnackBarContent] = useState("");
  const [onGoingGameDetails, setOnGoingGameDetails] = useState(null);
  const [
    isMultipleDeviceDetectedModalOpen,
    setMultipleDeviceDetectedModalOpen,
  ] = useState(null);
  const history = useHistory();

  useEffect(() => {
    console.log("home events mounted...");
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
    // socket.on("disconnect", () => {
    //   setMultipleDeviceDetectedModalOpen({
    //     title: "Multiple Devices/tabs Detected!!",
    //     msg: "Attention! you can connect 1 device only, close all other connections & retry!!",
    //     buttonText: "Close",
    //     redirectTo: "/",
    //   });
    // });

    introJs()
      .setOptions({
        disableInteraction: true,
      })
      .addHints();
    if (!isMuted) welcomeSound.play();
    return () => {
      console.log("home-events unomounting...");
      socket.off("games");
      socket.off("ongoing-game");
      socket.off("user-error");
    };
  }, []);

  const rejoinPlayerToGame = () => {
    const token = getUserIdentification();
    socket.emit("join-game", onGoingGameDetails.id, token);
    history.push("/game");
  };
  const quitAlreadyRunningGame = () => {
    console.log("quit from snackbar");
    socket.emit("quit-game");
    setSnackBarContent("");
  };

  const onClosingMultipleDeviceDetectedModal = () => {
    const id = getUserIdentification();
    //if user is guest we cannot do anything
    if (id.startsWith("guest")) return;
    //if a registered user ,logout and then redirect to home page
    else {
      setMultipleDeviceDetectedModalOpen(false);
      signout(() => {
        history.push("/");
        setUserState({
          ...userState,
          socketReinitialize: !userState.socketReinitialize,
        });
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
          onClose={quitAlreadyRunningGame}
          onCloseHint="opponent will be declared as winner"
        />
      )}
      {isMultipleDeviceDetectedModalOpen && (
        <ErrorModal
          modalState={isMultipleDeviceDetectedModalOpen}
          setModalState={setMultipleDeviceDetectedModalOpen}
          error={isMultipleDeviceDetectedModalOpen}
          cbOnRequestClose={onClosingMultipleDeviceDetectedModal}
        />
        /*
        <SmallScreenInfoModal
          modalState={isMultipleDeviceDetectedModalOpen}
          setModalState={setMultipleDeviceDetectedModalOpen}
          title={isMultipleDeviceDetectedModalOpen.title}
        >
          <p className="max-w-sm p-4 mx-auto text-center">
            {isMultipleDeviceDetectedModalOpen.msg}
          </p>
        </SmallScreenInfoModal>
        */
      )}

      <Navbar socket={socket} />
      <div className="py-4">
        {/* ###################### grid 1 start ################################# */}
        <div className="grid grid-cols-12 mx-auto max-w-screen-2xl">
          {/* left side */}
          <div className="col-span-12 col-start-1 px-5 lg:col-span-8 ">
            <RandomPlay socket={socket} d />
            <PlayWithFriends socket={socket} />
          </div>

          {/* rightside */}
          <div className="flex flex-col items-stretch col-span-12 px-5 mt-4 space-y-4 sm:space-y-0 md:space-x-2 lg:items-center sm:flex-row lg:flex-col lg:mt-0 lg:space-x-0 lg:space-y-4 lg:col-span-auto lg:col-start-9">
            <Leaderboard />
            <FindUser />
          </div>
        </div>
        {/* ###################### grid 1 end ################################# */}
        {/* ###################### grid 2 start ################################# */}

        <div className="grid grid-cols-12 pt-4 mx-auto space-y-4 max-w-screen-2xl lg:space-y-0">
          {/* left side */}
          <div
            className="col-span-12 col-start-1 px-5 lg:col-span-8 "
            data-title="EVENT PROMOTION"
            data-intro="here you can see ongoing events"
          >
            <GamePosters />
          </div>

          {/* rightside */}
          <div className="col-span-12 px-5 lg:col-span-auto lg:col-start-9">
            <OnlineFriends />
          </div>
        </div>
        <Footer />
        {/* <div
        className="relative mx-4 my-4 bg-white shadow-xl mt-14 max-w-screen-2xl h-44"
        id="shapedDiv"
      ></div> */}
      </div>
    </div>
  );
};

export default Home;
