import React, { useState, useEffect } from "react";

const player = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

// set of moves for each type of player
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

const BoardComponent = ({ board, color, turn, movePiece, leaveGame }) => {
  const [selectedPiece, setSelectedPiece] = useState({ i: -1, j: -1 });
  const [possibleMoves, setPossibleMoves] = useState([]);

  const isValid = (x, y) => {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  };

  // checks if a cell is a possible move for selectedPiece
  const isHighlighted = (cell) => {
    return possibleMoves.find((move) => move.i === cell.i && move.j === cell.j);
  };

  // logic after selection of piece & displaying possible moves
  useEffect(() => {
    const i = selectedPiece.i,
      j = selectedPiece.j;
    // check if the selected cell has a piece or not
    if (i !== -1 && j !== -1 && board[i][j] !== 0) {
      let bp = board[i][j];
      let newMoves = [];
      // iterating through the possible set of playerMoves
      for (var itr = 0; itr < playerMoves[bp].length; ++itr) {
        let ti = i + playerMoves[bp][itr].i;
        let tj = j + playerMoves[bp][itr].j;
        // validating the new position & pushing it into possibleMoves state
        if (isValid(ti, tj) && player[board[i][j]] !== player[board[ti][tj]]) {
          if (board[ti][tj] === 0) newMoves.push({ i: ti, j: tj });
          else {
            // deals with possible moves where opponent is taken down
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

  // select a piece on clicking it
  const selectPiece = (i, j) => {
    if (board[i][j] === 0 || player[board[i][j]] === color) {
      setPossibleMoves([]);
      setSelectedPiece({ i: i, j: j });
    }
  };

  // deselect a piece
  const deselectPiece = () => {
    setPossibleMoves([]);
    setSelectedPiece({ i: -1, j: -1 });
  };

  // invokes when a cell is clicked
  const clickCell = (i, j) => {
    if (turn === color) {
      if (selectedPiece.i === -1 && selectedPiece.j === -1) selectPiece(i, j);
      else {
        const destinationCell = isHighlighted({ i, j });
        if (destinationCell === undefined) deselectPiece(i, j);
        else {
          movePiece({ selectedPiece, destination: { i, j } });
          deselectPiece();
        }
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex">
        <button
          class="p-2 pl-5 pr-5 bg-red-500 text-gray-100 text-lg rounded-lg focus:border-4 border-red-300"
          onClick={() => leaveGame()}
        >
          Leave Game
        </button>
      </div>
      {color !== null ? (
        <h1 className="m-2">YOUR COLOR :- {color}</h1>
      ) : (
        <h1 className="m-2">SPECTATOR</h1>
      )}
      <h1 className="m-2">PLAYER TURN :- {turn}</h1>

      {turn === color ? (
        <h1>Your Turn To Move A Piece...</h1>
      ) : (
        <h1>Waiting For Opponent To Move...</h1>
      )}

      {board.map((row, i) => (
        <div key={i} className="grid grid-cols-8 mx-24">
          {row.map((piece, j) => (
            <div
              key={`${i} ${j}`}
              className="m-0.5 p-6 text-black bg-gray-100 col"
              onClick={() => clickCell(i, j)}
            >
              {piece !== 0 && <div>{player[board[i][j]]}</div>}
              {isHighlighted({ i, j }) !== undefined && <p>HERE</p>}
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
