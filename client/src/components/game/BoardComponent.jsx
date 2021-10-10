import React, { useState, useEffect } from "react";

const player = {
  0: "Empty",
  1: "Red",
  2: "Black",
  3: "Red",
  4: "Black",
};
const playerMoves = {
  0: [{}],
  1: [
    { i: 1, j: -1 },
    { i: 1, j: 1 },
  ],
  2: [
    { i: -1, j: 1 },
    { i: -1, j: -1 },
  ],
  3: [
    { i: 1, j: -1 },
    { i: -1, j: 1 },
    { i: 1, j: 1 },
    { i: -1, j: -1 },
  ],
  4: [
    { i: 1, j: -1 },
    { i: -1, j: 1 },
    { i: 1, j: 1 },
    { i: -1, j: -1 },
  ],
};

const BoardComponent = () => {
  const [board, setBoard] = useState([
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
  ]);
  const [selectedPiece, setSelectedPiece] = useState({ i: -1, j: -1 });
  const [possibleMoves, setPossibleMoves] = useState([]);

  const isValid = (x, y) => {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  };

  const isHighlighted = (cell) => {
    return possibleMoves.find((move) => move.i === cell.i && move.j === cell.j);
  };

  // logic after selection of piece & displaying possible moves
  useEffect(() => {
    const i = selectedPiece.i,
      j = selectedPiece.j;
    if (i !== -1 && j !== -1 && board[i][j] !== 0) {
      let bp = board[i][j];
      let newMoves = [];
      for (var itr = 0; itr < playerMoves[bp].length; ++itr) {
        let ti = i + playerMoves[bp][itr].i;
        let tj = j + playerMoves[bp][itr].j;
        if (isValid(ti, tj) && player[board[i][j]] !== player[board[ti][tj]]) {
          if (board[ti][tj] === 0) newMoves.push({ i: ti, j: tj });
          else {
            let tti = ti + playerMoves[bp][itr].i;
            let ttj = tj + playerMoves[bp][itr].j;
            if (isValid(tti, ttj) && board[tti][ttj] === 0)
              newMoves.push({ i: tti, j: ttj });
          }
        }
      }
      setPossibleMoves(newMoves);
    }
  }, [selectedPiece]);

  const selectPiece = (i, j) => {
    setPossibleMoves([]);
    setSelectedPiece({ i: i, j: j });
  };

  return (
    <div>
      {board.map((row, i) => (
        <div key={i} className="grid grid-cols-8 mx-24">
          {row.map((piece, j) => (
            <div
              key={`${i} ${j}`}
              className="m-0.5 p-6 text-black bg-gray-100 col"
              onClick={() => selectPiece(i, j)}
            >
              {piece !== 0 && <div>{player[board[i][j]]}</div>}
              {isHighlighted({ i, j }) !== undefined && (
                <p>{JSON.stringify(isHighlighted({ i, j }))}</p>
              )}
              {piece === 0 && <div>{`.`}</div>}
            </div>
          ))}
        </div>
      ))}
      <h1>Selected Cell :- {`(${selectedPiece.i}, ${selectedPiece.j})`}</h1>
    </div>
  );
};

export default BoardComponent;
