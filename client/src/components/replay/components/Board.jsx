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
    setBoardStates((boardStates) => {
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
      return [...boardStates, updatedBoard];
    });
  };
  const prevMove = () => {
    if (boardStates.length > 1) {
      setBoardStates((boardStates) => {
        return boardStates.slice(0, boardStates.length - 1);
      });
      setMoveNum((moveNum) => {
        if (boardStates.length > 1) {
          return moveNum - 1;
        } else {
          return moveNum;
        }
      });
    }
  };
  const nextMove = () => {
    setMoveNum((moveNum) => {
      if (moveNum < moves.length - 1) {
        const newMoveNum = moveNum + 1;
        executeNextMove(moves[newMoveNum]);
        return newMoveNum;
      } else {
        alert("Match finished");
        return moveNum + 1;
      }
    });
  };
  return (
    <div
      className="h-full min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1525034687081-c702010cb70d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
        backgroundSize: "cover",
      }}
    >
      <div className="grid grid-cols-12 px-2 mt-4">
        <div className="col-span-12 col-start-1 text-center text-white md:col-span-8">
          <BoardComponent boardMatrix={boardStates[boardStates.length - 1]} />
        </div>
        <div className="col-span-12 lg:col-span-3 lg:col-start-9">
          <button
            onClick={prevMove}
            className="px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400"
          >
            Prev
          </button>
          {/* )} */}
          {/* {moves && moveNum < moves.length && ( */}
          <button
            onClick={nextMove}
            className="px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400"
          >
            Next
          </button>
        </div>
        <div className="inline-flex">
          {/* {moves && boardStates.length > 1 && ( */}

          {/* )} */}
        </div>
      </div>
      <div>{boardStates.length}</div>
    </div>
  );
};
export default Board;
