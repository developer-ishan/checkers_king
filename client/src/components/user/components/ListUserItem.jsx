import React from "react";
import { Link } from "react-router-dom";

const ReceivedRequestListItem = ({ data }) => {
  return (
    <div
      className="flex flex-row items-center justify-between py-4"
      data-title="players info"
      data-intro="you can click on the name to see more info"
    >
      <img
        src={`${data.photo}`}
        alt="user-1"
        className="w-12 h-12 rounded-full"
      />
      <div className="text-sm">
        <span className="block font-semibold">
          <Link to={`${data.userId}`}>{`${data.username}`}</Link>
        </span>
      </div>
      <Link
        to={`${data.userId}`}
        className="block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
      >
        {data.status === "REQUESTED" ? "requested" : "view"}
      </Link>
    </div>
  );
};

export default ReceivedRequestListItem;
