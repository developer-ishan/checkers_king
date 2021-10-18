import React, { useEffect, useState } from "react";
import BoardComponent from "./BoardComponent";

const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;
const TOP_ROW = 0;
const BOTTOM_ROW = 7;

const Board = ({ moves }) => {
  const initialBoard = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
  ];
  const [boardStates, setBoardStates] = useState([initialBoard]);
  const [moveNum, setMoveNum] = useState(-1);
  useEffect(() => {}, []);
  const parseMove = (move) => {
    return {
      turn: move.substring(0, 1),
      i: parseInt(move.substring(1, 2)),
      j: parseInt(move.substring(2, 3)),
      di: parseInt(move.substring(3, 4)),
      dj: parseInt(move.substring(4, 5)),
    };
  };
  const executeNextMove = (move) => {
    const { turn, i, j, di, dj } = parseMove(move);
    // alert("next: "+move);
    const curState = boardStates[boardStates.length - 1];
    const updatedBoard = curState.map(function (arr) {
      return arr.slice();
    });
    const distanceI = di - i;
    const distanceJ = dj - j;
    const oneCellForwardI = i + Math.abs(distanceI) / distanceI;
    const oneCellForwardJ = j + Math.abs(distanceJ) / distanceJ;
    const destinationPiece = updatedBoard[di][dj];
    const piece = updatedBoard[i][j];

    const middlePiece = updatedBoard[oneCellForwardI][oneCellForwardJ];
    if (middlePiece !== piece) {
      updatedBoard[oneCellForwardI][oneCellForwardJ] = 0;
    }
    updatedBoard[di][dj] = updatedBoard[i][j];
    updatedBoard[i][j] = 0;
    setBoardStates([...boardStates, updatedBoard]);
  };
  const prevMove = () => {
    if (boardStates.length > 1) {
      const updateStates = boardStates.slice(0, boardStates.length - 1);
      setBoardStates(updateStates);
    }
  };
  const nextMove = () => {
    let newMoveNum = moveNum;
    if (moveNum < moves.length - 1) {
      const newMoveNum = moveNum + 1;
      executeNextMove(moves[newMoveNum]);
      setMoveNum(newMoveNum);
    } else {
      alert("Match finished");
      setMoveNum(moveNum + 1);
    }
  };
  return (
    <div className="dark:bg-gray-900">
      <BoardComponent boardMatrix={boardStates[boardStates.length - 1]} />
      <div class="inline-flex">
        {moves && boardStates.length > 1 && (
          <button
            onClick={prevMove}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Prev
          </button>
        )}
        {moves && moveNum < moves.length && (
          <button
            onClick={nextMove}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next
          </button>
        )}
      </div>
      <div>{boardStates.length}</div>
    </div>
  );
};
export default Board;
