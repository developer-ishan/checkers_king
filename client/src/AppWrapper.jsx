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

const AppWrapper = (props) => {
  const history = useHistory();
  const [socket, setSocket] = useContext(SocketContext);
  const [gameInvites, setGameInvites] = useState([]);
  const { isMuted, toggleMute, clickSound } = useContext(GameSoundContext);
  const [userState, setUserState] = useContext(UserContext);

  const handleDistinctMerge = (oArr1, oArr2) => {
    for (let i = 0; i < oArr2.length; ++i) {
      let found = false;
      for (let j = 0; j < oArr1.length && !found; ++j) {
        if (oArr1[i].userId === oArr2[j].userId) found = true;
      }
      if (!found) oArr1.push(oArr2[i]);
    }
    return oArr1;
  };

  const findOnlineFriendWithId = (oldFriendState, userId) => {
    return oldFriendState.find((friend) => friend.userId === userId);
  };

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

    clientSocket.on("friend-online", (onlineFriends) => {
      console.log("friend came online...", onlineFriends);
      setUserState((u) => {
        const friends = handleDistinctMerge(u.friends, onlineFriends);
        return { ...u, friends: friends };
      });
    });

    clientSocket.on("friend-offline", (offlineFriend) => {
      console.log("offline-friend caught...", offlineFriend);
      if (offlineFriend) {
        setUserState((u) => {
          const friends = u.friends.filter(
            (f) => f.userId !== offlineFriend.userId
          );
          return { ...u, friends: friends };
        });
      }
    });

    clientSocket.on("user-status", (userStatus) => {
      console.log("user-status caught");
      console.log(userStatus);
      if (userStatus)
        setUserState((u) => {
          const friends = u.friends.map((f) => {
            if (f.userId === userStatus.id)
              return { ...f, status: userStatus.status };
            else return f;
          });
          return { ...u, friends: friends };
        });
    });

    return () => {
      clientSocket.off("friend-game-invite-receive");
      clientSocket.off("friend-game-invite-accepted");
      clientSocket.off("join-game");
      clientSocket.off("friend-online");
      clientSocket.off("friend-offline");
      clientSocket.off("user-status");
    };
  }, [userState.socketReinitialize]);
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
