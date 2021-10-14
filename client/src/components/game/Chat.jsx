import React, { useState, useEffect } from "react";
const Chat = ({ sendChatMsg, chats }) => {
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
    scrollToBottom();
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
    <div className="flex flex-col p-8 space-y-2 text-black bg-white">
      <div className="w-full p-2 text-center border-2">Chat Messages</div>

      <div
        id="chatwindow"
        className="w-full h-64 p-1 space-y-2 overflow-auto border-2"
      >
        {chats.length > 0 &&
          chats.map((chat) => {
            return (
              <p
                className={
                  chat.player === "you"
                    ? "text-right bg-indigo-300 p-1 rounded w-3/4 ml-auto"
                    : "text-left bg-red-300 p-1 rounded w-3/4"
                }
              >{`${chat.msg}`}</p>
            );
          })}
        {chats.length == 0 && (
          <p className="text-xs text-gray-400">
            why so serious? typeout something..
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <input
        className="w-full px-3 py-2 text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="msg"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => handleEnterKey(e)}
        placeholder="Type a message"
      />
      <button
        className="w-full px-4 py-2 mt-2 font-semibold text-white bg-indigo-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white hover:border-transparent"
        onClick={() => handleMsg()}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
