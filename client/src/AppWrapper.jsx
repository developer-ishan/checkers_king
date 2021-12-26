import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import io from "socket.io-client";
import { SocketContext } from "./context/SocketContext";
import { API } from "./config/backend";
import { getUserIdentification, isAuthenticated } from "./helper/authHelper";
import { GameSoundContext } from "./context/GameSoundContext";
import ConfirmModal from "./components/modal/ConfirmModal";
import GameOptionsDisplay from "./components/game/components/GameOptionsDisplay";

const AppWrapper = (props) => {
  const history = useHistory();
  const [socket, setSocket] = useContext(SocketContext);
  const [gameInvites, setGameInvites] = useState([]);
  const { isMuted, toggleMute, clickSound } = useContext(GameSoundContext);

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
    return () => {};
  }, []);
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
  const rejectGameInvite = () => {
    setGameInvites((old) => {
      return [...old.slice(1)];
    });
    socket.emit("friend-game-invite-reject", {
      token: isAuthenticated(),
      friend: gameInvites[0].invitedBy,
    });
  };
  return (
    <div>
      {props.children}

      {/* All the global modals come below */}
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
