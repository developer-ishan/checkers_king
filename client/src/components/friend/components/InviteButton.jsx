import React, { useContext, useState } from "react";
import { GameSoundContext } from "../../../context/GameSoundContext";
import { SocketContext } from "../../../context/SocketContext";
import { isAuthenticated } from "../../../helper/authHelper";
import InviteFriendsOptionsModal from "../../modal/InviteFriendsOptionsModal";

const InviteButton = ({ friend }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const { clickSound, isMuted } = useContext(GameSoundContext);
  const [isGameOptionModalOpen, setIsGameOptionModalOpen] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    checker: "Red",
    forceJump: true,
    isRated: true,
  });
  const handleSendInvite = () => {
    console.log(gameOptions);
    console.log(friend);
    const token = isAuthenticated();
    if (token)
      socket.emit(
        "friend-game-invite-send",
        {
          gameOptions,
          token,
          friend,
        },
        (resp) => {
          if(!resp.success){
            alert(resp.msg);
          }
          else if (resp.online) {
            alert(`invite sent to ${resp.username}, waiting for response`);
          } else {
            alert(resp.msg);
          }
          setIsGameOptionModalOpen(false);
        }
      );
  };
  return (
    <div className="">
      <button
        className="block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
        onClick={() => {
          setIsGameOptionModalOpen(true);
        }}
      >
        invite
      </button>
      <InviteFriendsOptionsModal
        modalState={isGameOptionModalOpen}
        setModalState={setIsGameOptionModalOpen}
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
        handleSendInvite={handleSendInvite}
      />
    </div>
  );
};

export default InviteButton;
