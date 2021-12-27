import React, { useState, useEffect, useContext } from "react";
import { GameSoundContext } from "../../../../context/GameSoundContext";

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

const BoardComponent = ({ board, color, turn, movePiece, lastMove }) => {
  const [selectedPiece, setSelectedPiece] = useState({ i: -1, j: -1 });
  const [possibleMoves, setPossibleMoves] = useState([]);
  const { clickSound, jumpSound, selectSound, crownSound, slideSound, isMute } =
    useContext(GameSoundContext);

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
      console.log(lastMove);
    }
  }, [selectedPiece]);

  // select a piece on clicking it
  const selectPiece = (i, j) => {
    if (board[i][j] === 0 || player[board[i][j]] === color) {
      if (!isMute) selectSound.play();
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
          /* for every valid move
          1.we play slide sound for norma move
          2.or play jump sound in case of cutting opponent's piece
          */
          if (!isMute) {
            let dy = Math.abs(destinationCell.i - selectedPiece.i);
            let dx = Math.abs(destinationCell.j - selectedPiece.j);
            if (
              (dy === 2 && dx === 2) ||
              (dy === 0 && dx === 2) ||
              (dy === 2 && dx === 0)
            )
              jumpSound.play();
            else slideSound.play();
          }
          //check if the new position is crown
          // board[i][j]<=2 this condition ensure that sound play
          //for a normal goti only not for already king goti
          if (
            ((i === 0 && color === "Black") || (i === 7 && color === "Red")) &&
            board[i][j] <= 2
          ) {
            console.log("crown goti", board[i][j]);
            if (!isMute) crownSound.play();
          }
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

  const moveStartPosStyle =
    "grid relative place-items-center text-black bg-yellow-300";
  const moveEndPosStyle =
    "grid relative place-items-center text-black bg-green-400";

  //this function will return one of the sytle
  //from above depending upon coordinate
  const getStyle = (i, j) => {
    if (lastMove) {
      const { selectedPiece, destination } = lastMove;
      if (i === selectedPiece.i && j === selectedPiece.j)
        return moveStartPosStyle;

      if (i === destination.i && j === destination.j) return moveEndPosStyle;
    }
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

  const getLastMovePosition = (i, j) => {
    const { selectedPiece, destination } = lastMove;
    if (selectedPiece.i === i && selectedPiece.j === j)
      return <div className="bg-white-200"></div>;
    else if (destination.i === i && destination.j)
      return <div className="bg-white-200"></div>;
    return <div></div>;
  };

  //this function return piece(goti)
  const getPiece = (pieceType) => {
    const cursorStyle = (color) => {
      if (turn === color)
        return {
          cursor: "default",
        };
      return {
        cursor: "not-allowed",
      };
    };
    const title = `${turn} player's turn`;
    switch (pieceType) {
      case 0:
        return;
      case 1:
        return (
          <div
            className="absolute w-5/6 bg-red-500 border-2 border-red-700 border-solid rounded-full shadow-inner sm:border-4 md:border-8 h-5/6"
            style={cursorStyle("Red")}
            title={title}
          ></div>
        ); //red pawn
      case 2:
        return (
          <div
            className="absolute w-5/6 bg-gray-800 border-2 border-gray-900 border-solid rounded-full shadow-inner sm:border-4 md:border-8 h-5/6"
            style={cursorStyle("Black")}
            title={title}
          ></div>
        ); //black pawn
      case 3:
        return (
          <div
            className="absolute grid w-5/6 text-yellow-500 bg-red-500 border-2 border-red-700 border-solid rounded-full shadow-inner sm:border-4 md:border-8 place-content-center h-5/6"
            style={cursorStyle("Red")}
            title={title}
          >
            {/* <img src="https://img.icons8.com/nolan/50/crown.png" /> */}
            <img
              src="/images/crown.png"
              alt="Crown_Logo"
              className="w-8 h-8 text-white"
            />
          </div>
        ); //red queen
      case 4:
        return (
          <div
            className="absolute grid w-5/6 bg-gray-800 border-2 border-gray-900 border-solid rounded-full shadow-inner sm:border-4 md:border-8 place-content-center h-5/6"
            style={cursorStyle("Black")}
            title={title}
          >
            {/* <img src="https://img.icons8.com/nolan/50/crown.png" /> */}
            <img
              src="/images/crown.png"
              alt="Crown_Logo"
              className="w-8 h-8 text-white"
            />
          </div>
        ); //black queen

      default:
        break;
    }
  };
  //this ensure that the players color remains on the lower side
  const rot = color === "Black" ? 0 : 180;

  return (
    <div
      className=""
      data-title="GAME BOARD"
      data-intro="here the game will be played!"
    >
      {/* board start*/}
      <div
        style={{
          height: "90vmin",
          width: "90vmin",
          transform: `rotateX(${rot}deg) rotateY(${rot}deg)`,
          border: "0.8rem double #fff",
        }}
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
                {lastMove && getLastMovePosition(i, j)}
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
    </div>
  );
};

export default BoardComponent;
