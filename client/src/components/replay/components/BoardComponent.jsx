import React, { useState, useEffect } from "react";

const player = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

const BoardComponent = ({ boardMatrix }) => {
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
        {boardMatrix.map((row, i) => (
          <div key={i} className="grid grid-cols-8">
            {row.map((piece, j) => (
              <div
                key={`${i} ${j}`}
                // here we are getting the background color of these small boxes
                className={getStyle(i, j)}
              >

                {/* putting the playing piece */}
                {piece !== 0 && getPiece(boardMatrix[i][j])}
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
