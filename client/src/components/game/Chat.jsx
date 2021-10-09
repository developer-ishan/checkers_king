import React from "react";

const Chat = () => {
  return (
    <div className="flex flex-col p-8 text-black bg-white">
      <div className="p-6 border-2">Chat Messages</div>
      <div className="m-4">
        <input
          class="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Type a message"
        />
        <button className="px-4 py-2 mx-4 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
