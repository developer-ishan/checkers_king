import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../../context/SocketContext";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import ChatWindow from "./ChatWindow";

const Chat = ({ gameId, playerId, color, playersInfo }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);

  useEffect(() => {
    socket.on("receive-msg", (newMessage) => {
      const { user, msg } = newMessage;
      setChats([...chats, { user, msg }]);
    });
    socket.on("old-chats-on-rejoin", (chats) => {
      setChats(chats);
    });

    return () => {
      socket.off("receive-msg");
      socket.off("old-chats-on-rejoin");
    };
  }, [chats]);

  const sendChatMsg = (msg) => {
    if (msg === "") return;
    socket.emit("send-msg", { gameId, msg });
    setChats([...chats, { user: playerId, msg: `${msg}` }]);
  };

  const handleMsg = () => {
    const userMsg = msg;
    setMsg("");
    setShowEmojiPalette(false);
    sendChatMsg(userMsg);
  };

  const handleEnterKey = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      handleMsg();
    }
  };

  const handleEmojiInMsg = (event) => {
    let emoji = event.native;
    setMsg(msg + emoji);
  };

  return (
    <div className="flex flex-col flex-grow w-full h-full max-w-md text-black dark:text-white">
      {/* message window showing chats */}
      {/* <div
        id="chatwindow"
        className="relative flex-grow w-full p-1 my-2 space-y-2 overflow-y-auto bg-white border-2 dark:bg-gray-700 rounded-xl"
      >
        {chats.length > 0 &&
          chats.map((chat) => {
            return chat.player === "you" ? (
              <div className="w-3/4 ml-auto">
                <p className="w-full p-1 ml-auto text-right bg-indigo-300 rounded rounded-tr-none dark:bg-gray-500 max-w-max">{`${chat.msg}`}</p>
              </div>
            ) : (
              <div className="w-3/4 mr-auto">
                <p className="w-full p-1 text-left bg-red-300 rounded rounded-tl-none dark:bg-gray-400 max-w-max">{`${chat.msg}`}</p>
              </div>
            );
          })}
        {chats.length == 0 && (
          <p className="absolute inset-0 grid text-sm text-center text-gray-400 lg:text-lg xl:text-xl place-content-center">
            chat message appear here...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div> */}
      <ChatWindow
        chats={chats}
        playersInfo={playersInfo}
        noChatMessage="typeout something.."
        bottomColor={color}
      />
      {/* message input and send controls */}
      {color && (
        <div className="relative flex p-1 bg-white border-2 shadow dark:bg-gray-700 rounded-3xl">
          {showEmojiPalette && (
            <span className="absolute bottom-full">
              <Picker onSelect={handleEmojiInMsg} emojiTooltip={true} />
            </span>
          )}
          <p
            className="mx-1 mt-2 border-none cursor-pointer"
            onClick={() => setShowEmojiPalette(!showEmojiPalette)}
          >
            {String.fromCodePoint(0x1f60a)}
          </p>
          <input
            className="w-full px-3 py-2 text-xs leading-tight text-gray-700 border border-none appearance-none rounded-3xl dark:bg-gray-800 dark:text-white "
            id="msg"
            type="text"
            value={msg}
            autoComplete="off"
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => handleEnterKey(e)}
            placeholder="Type a message"
          />
          <button
            className="p-2 font-semibold text-white rounded-full hover:text-white hover:border-transparent"
            onClick={() => handleMsg()}
          >
            <img
              src="https://img.icons8.com/external-outline-juicy-fish/60/000000/external-send-arrows-outline-outline-juicy-fish.png"
              className="w-5 h-5 transform hover:scale-110"
              alt="SendArrow"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
