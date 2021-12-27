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
  const [friendRequests, setFriendRequests] = useState([]);
  const [ackFriendRequest, setAckFriendRequest] = useState([]);
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

    socket.on("got-friend-request", ({ userId, username, photo, msg }) => {
      console.log(`${username} sent friend request`);
      if (!isMuted) notificationSound.play();
      setFriendRequests((old) => [...old, { userId, username, photo, msg }]);
    });

    socket.on("ack-friend-request", ({ userId, username, photo, response }) => {
      if (!isMuted) notificationSound.play();
      setAckFriendRequest((old) => [
        ...old,
        { userId, username, photo, response },
      ]);
    });

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
      socket.off("got-friend-request");
      socket.off("ack-friend-request");
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
  const responseToFriendRequest = (decision, id) => {
    console.log("response to friend request", decision);
    //removing the first request from the request array
    //as the user took the action, no more need to show it

    socket.emit(
      "respond-friend-request",
      {
        token: isAuthenticated(),
        senderId: id,
        response: decision,
      },
      (resp) => {
        alert(resp.msg);
      }
    );
    setFriendRequests((old) => {
      return [...old.slice(1)];
    });
  };
  const ignoreFriendRequest = () => {
    console.log("friend request ignored by user");
    //removing the first request from the request array
    //as the user ignored it
    setFriendRequests((old) => {
      return [...old.slice(1)];
    });
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

      {/* modal showing received friend request */}
      {friendRequests.length > 0 && (
        <ConfirmModal
          title="friend Request"
          modalState={friendRequests}
          setModalState={setFriendRequests}
          cbOnAccept={() =>
            responseToFriendRequest(true, friendRequests[0].userId)
          }
          cbOnReject={() =>
            responseToFriendRequest(false, friendRequests[0].userId)
          }
          cbOnRequestClose={() => ignoreFriendRequest(friendRequests[0].userId)}
        >
          <p className="text-center capitalize">
            <strong>
              <Link to={`/user/${friendRequests[0].userId}`}>
                {friendRequests[0].username}
              </Link>
            </strong>{" "}
            has sent you friend request
          </p>
          <p className="p-2 mt-1 text-center capitalize bg-indigo-300 rounded-lg dark:bg-gray-600">
            {friendRequests[0].msg}
          </p>
        </ConfirmModal>
      )}

      {/* modal for friendrequest response : accepted or rejected */}
      {ackFriendRequest.length > 0 && (
        <SmallScreenInfoModal
          title="notification"
          modalState={ackFriendRequest}
          setModalState={ackFriendRequest}
          cbOnRequestClose={() =>
            setAckFriendRequest((old) => [...old.slice(1)])
          }
        >
          <p className="p-2 text-center capitalize">
            <strong>
              <Link to={`/user/${ackFriendRequest[0].userId}`}>
                {ackFriendRequest[0].username}
              </Link>
            </strong>
            {ackFriendRequest[0].response
              ? " has accepted you friend reques"
              : " has reject you friend request"}
          </p>
        </SmallScreenInfoModal>
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
        {/* <div
        className="relative mx-4 my-4 bg-white shadow-xl mt-14 max-w-screen-2xl h-44"
        id="shapedDiv"
      ></div> */}
      </div>
    </div>
  );
};

export default Home;
