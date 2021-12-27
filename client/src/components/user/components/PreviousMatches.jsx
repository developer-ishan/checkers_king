import React, { useEffect } from "react";
import Match from "./Match";

const PreviousMatches = ({ userId, previousMatches }) => {
  useEffect(() => {
    console.log("rendering previous matches...");
  }, [userId]);

  return (
    <div className="w-full grid-cols-12 gap-4 p-4 mx-auto space-y-3 rounded-lg shadow-lg indigo-gradient dark:dark-gradient">
      <h1
        className="text-lg font-bold text-white capitalize sm:text-3xl"
        data-title="match history"
        data-intro="all your previous matches will appear here,you can watch replay also"
      >
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
                isRated={match.isRated}
                mandatoryMoves={match.mandatoryMoves}
                winner={match.winner}
                key={match.matchId}
                botLevel={match.botLevel}
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
