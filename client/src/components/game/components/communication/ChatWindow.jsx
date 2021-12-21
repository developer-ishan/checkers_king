import React from "react";

const ChatWindow = ({ chats }) => {
  return (
    <div>
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
      {chats.length === 0 && (
        <p className="absolute inset-0 grid text-sm text-center text-gray-400 lg:text-lg xl:text-xl place-content-center">
          typeout something..
        </p>
      )}
    </div>
  );
};

export default ChatWindow;
