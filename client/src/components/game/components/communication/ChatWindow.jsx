import React, { useEffect } from "react";

const ChatWindow = ({
  chats = [],
  playersInfo,
  noChatMessage,
  bottomColor,
}) => {
  //refrence to the daummy element present at the end of chats
  const messagesEndRef = React.createRef();
  //this function will bring that div in focuse
  //resulting in scroll

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    //so the ides is whenever there is change in chat
    //run the scroll to bottom
    if (chats.length) scrollToBottom();
  }, [chats]);
  const getColorByUserId = (id) => {
    if (playersInfo[0].id === id) return playersInfo[0].color;
    return playersInfo[1].color;
  };
  return (
    <div className="relative h-full max-h-screen px-1 pt-2 space-y-2 overflow-y-auto bg-white rounded-lg dark:bg-gray-800">
      {chats.length > 0 &&
        chats.map((chat) => {
          return getColorByUserId(chat.user) === bottomColor ? (
            <div className="w-3/4 ml-auto">
              <p className="w-full p-1 ml-auto text-right bg-indigo-300 rounded rounded-tr-none dark:bg-gray-500 max-w-max">{`${chat.msg}`}</p>
            </div>
          ) : (
            <div className="w-3/4 mr-auto">
              <p className="w-full p-1 text-left bg-red-300 rounded rounded-tl-none dark:bg-gray-400 max-w-max">{`${chat.msg}`}</p>
            </div>
          );
        })}
      {chats.length === 0 && (
        <p className="absolute inset-0 grid text-sm text-center text-gray-400 lg:text-lg xl:text-xl place-content-center">
          {noChatMessage}
        </p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
