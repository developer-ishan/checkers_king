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

const BoardComponent = ({ board, color, turn, movePiece, quitGame }) => {
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

  // for styling the boxes of the board
  const whiteBoxStyle =
    "grid relative place-items-center text-black bg-pink-300 ";
  const blackBoxStyle =
    "grid relative place-items-center text-white bg-indigo-600";

  //this function will return one of the sytle
  //from above depending upon coordinate
  const getStyle = (i, j) => {
    if ((i + j) % 2 === 0) return blackBoxStyle;
    else return whiteBoxStyle;
  };

  //takes coordinate of a box as argument
  //and return true if they are same as the selected box
  //else return false
  const isSelected = (currentI, currentJ) => {
    if (selectedPiece.i === currentI && selectedPiece.j === currentJ)
      return true;
    return false;
  };

  //this function return piece
  const getPiece = (pieceType) => {
    switch (pieceType) {
      case 0:
        return;
      case 1:
        return (
          <div className="absolute w-5/6 bg-red-500 rounded-full h-5/6"></div>
        ); //red pawn
      case 2:
        return (
          <div className="absolute w-5/6 bg-black rounded-full h-5/6"></div>
        ); //black pawn
      case 3:
        return (
          <div className="absolute grid w-5/6 text-yellow-500 bg-red-500 rounded-full place-content-center h-5/6">
            Q
          </div>
        ); //red queen
      case 4:
        return (
          <div className="absolute grid w-5/6 text-yellow-500 bg-black rounded-full place-content-center h-5/6">
            Q
          </div>
        ); //black queen

      default:
        break;
    }
  };
  return (
    <div className="">
      {/* board start*/}
      <div
        style={{ height: "90vmin", width: "90vmin" }}
        className="grid grid-cols-1 mx-auto grid-rows-8"
      >
        {/* small boxes of the board */}
        {board.map((row, i) => (
          <div key={i} className="grid grid-cols-8">
            {row.map((piece, j) => (
              <div
                key={`${i} ${j}`}
                // here we are getting the background color of these small boxes
                className={getStyle(i, j)}
                onClick={() => clickCell(i, j)}
              >
                {/* if current box is highligted then putting a overlay on the box*/}
                {isHighlighted({ i, j }) !== undefined && (
                  <div className="absolute inset-0 bg-green-500 border-4 border-green-800"></div>
                )}

                {/*if current box is selected then putting a overlay on the box*/}
                {isSelected(i, j) && (
                  <div className="absolute inset-0 bg-yellow-500 border-4 border-yellow-800"></div>
                )}
                {/* putting the playing piece */}
                {piece !== 0 && getPiece(board[i][j])}
              </div>
            ))}
          </div>
        ))}
        {/* small boxes end */}
      </div>
      {/* board end */}
      <h1>Selected Cell :- {`(${selectedPiece.i}, ${selectedPiece.j})`}</h1>
    </div>
  );
};

export default BoardComponent;
