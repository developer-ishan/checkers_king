import React, { useContext, useEffect, useState } from "react";
import { GameSoundContext } from "../../../context/GameSoundContext";
import ChatWindow from "../../game/components/communication/ChatWindow";
import BoardComponent from "./BoardComponent";

const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;
const TOP_ROW = 0;
const BOTTOM_ROW = 7;

const Board = ({
  moves,
  playersInfo,
  chats,
  winner,
  botLevel,
  isRated,
  mandatoryMoves,
}) => {
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
  const { clickSound, isMuted } = useContext(GameSoundContext);
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

      if (piece === RED_PAWN && di === BOTTOM_ROW)
        updatedBoard[di][dj] = RED_QUEEN;
      if (piece === BLACK_PAWN && di === TOP_ROW)
        updatedBoard[di][dj] = BLACK_QUEEN;
      return [...boardStates, updatedBoard];
    });
  };
  const prevMove = () => {
    if (boardStates.length > 1) {
      if (!isMuted) clickSound.play();
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
        if (!isMuted) clickSound.play();
        const newMoveNum = moveNum + 1;
        executeNextMove(moves[newMoveNum]);
        return newMoveNum;
      } else {
        alert(`${winner} Won!!`);
        return moveNum;
      }
    });
  };
  return (
    <div
      className="h-full min-h-screen pt-4 "
      style={{
        backgroundImage: "var(--game-bg)",
        backgroundSize: "cover",
      }}
    >
      <div className="grid grid-cols-12 px-2 auto-rows-min">
        {/* left side :containing board */}
        <div className="col-span-12 col-start-1 text-center text-white md:col-span-8">
          <BoardComponent
            boardMatrix={boardStates[boardStates.length - 1]}
            playersInfo={playersInfo}
            botLevel={botLevel}
          />
        </div>
        {/* right side: containing controls and chats */}
        <div className="flex flex-col col-span-12 lg:col-span-3 lg:col-start-9">
          {/* button controls */}
          <div
            data-title="REPLAY CONTROLS"
            data-intro="you can go backward and forward several times using these buttons"
          >
            <div className="text-center">
              <p
                className="font-bold text-center"
                data-title="MOVES"
                data-intro="this will show the current move and the total moves"
              >
                move:{moveNum + 1}/{moves.length}
              </p>
              <p className="font-bold capitalize">
                {isRated ? "Rated" : "Unrated"}
              </p>
              <p className="font-bold capitalize">
                madatoryMoves:{mandatoryMoves ? "ON" : "OFF"}
              </p>
            </div>
            <button
              data-title="PREVIOUS MOVE"
              data-intro="click this button to see previous state of board"
              onClick={() => prevMove()}
              className="w-full px-4 py-2 my-2 font-bold text-gray-800 bg-gray-100 rounded-l hover:bg-gray-200"
            >
              Prev
            </button>
            {/* {moves && moveNum < moves.length && ( */}
            <button
              data-title="NEXT MOVE"
              data-intro="click this button to see next next of board"
              onClick={() => nextMove()}
              className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded-r hover:bg-gray-700"
            >
              Next
            </button>
          </div>
          {/* chats replay */}
          {/* there is no chat for playing against bot */}
          {/* {playersInfo.length > 1 && ( */}
          <div
            className="flex-grow my-2"
            data-title="MATCH CHATS"
            data-intro="left side chats are from red piece player and right side are from black piece player"
          >
            <ChatWindow
              chats={chats.messages}
              playersInfo={playersInfo}
              noChatMessage="there were no chats in the match"
              bottomColor="Black"
            />
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};
export default Board;
