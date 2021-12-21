import React, { useState, useEffect } from "react";
const Chat = ({ sendChatMsg, chats, color, playersInfo }) => {
  const [msg, setMsg] = useState("");
  //refrence to the daummy element present at the end of chats
  const messagesEndRef = React.createRef();
  //this function will bring that div in focuse
  //resulting in scroll
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  //so the ides is whenever there is change in chat
  //run the scroll to bottom
  useEffect(() => {
    console.log("scrolling chat", chats);
    if (chats.length) scrollToBottom();
  }, [chats]);

  const handleMsg = () => {
    const userMsg = msg;
    setMsg("");
    sendChatMsg(userMsg);
  };

  const handleEnterKey = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      handleMsg();
    }
  };

  return (
    <div className="flex flex-col flex-grow w-full h-full max-w-md text-black dark:text-white">
      {/* message window showing chats */}
      <div
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
      </div>
      {/* message input and send controls */}
      {color && (
        <div className="flex p-1 bg-white border-2 shadow dark:bg-gray-700 rounded-3xl">
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
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
