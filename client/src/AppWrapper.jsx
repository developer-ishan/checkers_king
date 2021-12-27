import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import io from "socket.io-client";
import { SocketContext } from "./context/SocketContext";
import { API } from "./config/backend";
import { getUserIdentification, isAuthenticated } from "./helper/authHelper";
import { GameSoundContext } from "./context/GameSoundContext";
import ConfirmModal from "./components/modal/ConfirmModal";
import GameOptionsDisplay from "./components/game/components/GameOptionsDisplay";
import { UserContext } from "./context/UserContext";
import { Link } from "react-router-dom";
import SmallScreenInfoModal from "./components/modal/SmallScreenInfoModal";

const AppWrapper = (props) => {
  const history = useHistory();
  const [socket, setSocket] = useContext(SocketContext);
  const [gameInvites, setGameInvites] = useState([]);
  const { isMuted, toggleMute, clickSound, notificationSound } =
    useContext(GameSoundContext);
  const [userState, setUserState] = useContext(UserContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [ackFriendRequest, setAckFriendRequest] = useState([]);

  // connecting socket-client to the socket server for communication
  useEffect(() => {
    if (socket) socket.disconnect();
    const userIdToken = getUserIdentification();
    const clientSocket = io(API, {
      transports: ["websocket"],
      query: {
        token: userIdToken,
      },
    });
    setSocket(clientSocket);

    clientSocket.on("friend-game-invite-receive", (invitersInfo) => {
      console.log(invitersInfo);
      setGameInvites((old) => [...old, invitersInfo]);
    });
    clientSocket.on("friend-game-invite-accepted", (gameId) => {
      const token = isAuthenticated();
      if (token) clientSocket.emit("join-game", gameId, token);
      setGameInvites([]);
      history.push("/game");
    });
    clientSocket.on("friend-game-invite-rejected", (user) => {
      alert(`${user} rejected your request.`);
    });
    clientSocket.on(
      "got-friend-request",
      ({ userId, username, photo, msg }) => {
        console.log(`${username} sent you a friend request`);
        if (!isMuted) notificationSound.play();
        setFriendRequests((old) => [...old, { userId, username, photo, msg }]);
      }
    );
    clientSocket.on(
      "ack-friend-request",
      ({ userId, username, photo, response }) => {
        if (!isMuted) notificationSound.play();
        setAckFriendRequest((old) => [
          ...old,
          { userId, username, photo, response },
        ]);
      }
    );
    return () => {
      clientSocket.off("friend-game-invite-receive");
      clientSocket.off("friend-game-invite-accepted");
      clientSocket.off("join-game");
      clientSocket.off("got-friend-request");
      clientSocket.off("ack-friend-request");
    };
  }, [userState.socketReinitialize]);

  //accepting an invite for a game
  const acceptGameInvite = () => {
    setGameInvites([]);
    const { gameOptions, invitedBy: friend } = gameInvites[0];
    const token = isAuthenticated();
    console.log({ ...gameOptions, friend, token });
    if (gameOptions && friend && token) {
      socket.emit("friend-game-invite-accept", {
        color: gameOptions.checker,
        mandoryMoves: gameOptions.forceJump,
        isRated: gameOptions.isRated,
        friend,
        token,
      });
      history.push("/game");
    }
  };
  //rejecting an invite for a game
  const rejectGameInvite = () => {
    setGameInvites((old) => {
      return [...old.slice(1)];
    });
    socket.emit("friend-game-invite-reject", {
      token: isAuthenticated(),
      friend: gameInvites[0].invitedBy,
    });
  };

  //when modal for friend request is show
  //the response is handled in this function
  const responseToFriendRequest = (decision, id) => {
    console.log("responded to friend request", decision);

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

    //removing the first request from the request array
    //as the user took the action, no more need to show it
    setFriendRequests((old) => {
      return [...old.slice(1)];
    });
  };

  //if the user currently dont want to take
  //decision on friend request
  const ignoreFriendRequest = () => {
    console.log("friend request ignored by user");
    //removing the first request from the request array
    //as the user ignored it
    setFriendRequests((old) => {
      return [...old.slice(1)];
    });
  };
  return (
    <div>
      {props.children}

      {/* ######################### All the global modals come below #######################*/}

      {/* game invite modal */}
      {gameInvites.length > 0 && (
        <ConfirmModal
          title="game invite"
          modalState={gameInvites}
          setModalState={setGameInvites}
          cbOnAccept={acceptGameInvite}
          cbOnReject={rejectGameInvite}
          cbOnRequestClose={rejectGameInvite}
        >
          <div>
            <h2 className="font-bold text-center capitalize">
              {gameInvites[0].invitedBy.username} invited you to play.
            </h2>
            <div>
              <GameOptionsDisplay gameOptions={gameInvites[0].gameOptions} />
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* friend request modal */}
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

      {/* friend request acknowledge modal */}
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

      {/* global sound control button */}
      <button
        data-title="SOUND CONTROL"
        data-intro="you can toggle the sound by clicking this button"
        className="fixed p-2 text-black bg-white rounded-full shadow-lg dark:bg-gray-800 bottom-6 right-6"
        onClick={() => {
          toggleMute();
          if (isMuted) clickSound.play();
        }}
      >
        {isMuted ? (
          <img
            src="https://img.icons8.com/material-outlined/50/000000/no-audio--v1.png"
            className="w-6 h-6"
          />
        ) : (
          <img
            src="https://img.icons8.com/material-outlined/50/000000/speaker.png"
            className="w-6 h-6"
          />
        )}
      </button>
    </div>
  );
};

export default AppWrapper;
