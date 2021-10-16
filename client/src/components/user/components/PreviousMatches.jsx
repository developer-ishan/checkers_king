import React from "react";
import Match from "./Match";

const PreviousMatches = ({ userId }) => {
  return (
    <div className="w-full grid-cols-12 gap-4 p-4 mx-auto space-y-3 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-lg font-bold text-white capitalize sm:text-3xl">
        prev matches
      </h1>
      <div className="space-y-3">
        <Match live={true} />
        <Match live={false} />
        <Match live={false} />
        <Match live={false} />
        <Match live={false} />
        <Match live={false} />
        <Match live={false} />
      </div>
    </div>
  );
};

export default PreviousMatches;
