import React from "react";
import Match from "./Match";

const PreviousMatches = ({ userId, previousMatches }) => {
  return (
    <div className="w-full grid-cols-12 gap-4 p-4 mx-auto space-y-3 rounded-lg shadow-lg indigo-gradient dark:dark-gradient">
      <h1 className="text-lg font-bold text-white capitalize sm:text-3xl">
        prev matches
      </h1>
      <div className="space-y-3">
        {previousMatches &&
          previousMatches.map((match) => {
            return (
              <Match
                matchId={match.matchId}
                players={match.players}
                userId={userId}
                key={match.matchId}
              />
            );
          })}
        {previousMatches.length === 0 && (
          <h1 className="text-center text-white capitalize">
            user has not played any match yet
          </h1>
        )}
      </div>
    </div>
  );
};

export default PreviousMatches;
