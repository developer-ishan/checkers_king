import React, { createContext, useEffect, useState } from "react";

export const GameContext = createContext();

export const GameProvider = (props) => {
  const [game, setGame] = useState({
    board: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
    ],
    turn: null,
    id: null,
    userId: null
  });
  const [color, setColor] = useState(null);

  useEffect(() => {
    console.log("game provider loaded...");
  }, []);

  return (
    <GameContext.Provider
      value={{ gameValue: [game, setGame], colorValue: [color, setColor] }}
    >
      {props.children}
    </GameContext.Provider>
  );
};
