import React, { useState, useEffect } from "react";
import { getPreviousMatches } from "../../../helper/userHelper";
import Match from "./Match";
const PreviousMatches = ({ userId }) => {
  const [previousMatches, setPreviousMatches] = useState([]);

  useEffect(() => {
    getPreviousMatches(userId).then((res) => setPreviousMatches(res));
  }, []);
  return (
    <div className="w-full grid-cols-12 gap-4 p-4 mx-auto space-y-3 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-lg font-bold text-white capitalize sm:text-3xl">
        prev matches
      </h1>
      <div className="space-y-3">
        {previousMatches &&
          previousMatches.map((match) => {
            return <Match matchId={match.matchId} players={match.players} />;
          })}
      </div>
    </div>
  );
};

export default PreviousMatches;
