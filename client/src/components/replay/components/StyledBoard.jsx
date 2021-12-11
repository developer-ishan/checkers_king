import React from "react";

const player = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

const BoardComponent = ({ boardMatrix, color }) => {
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

  //this function return piece(goti)
  const getPiece = (pieceType) => {
    switch (pieceType) {
      case 0:
        return;
      case 1:
        return (
          <div className="absolute w-5/6 bg-red-500 border-2 border-red-700 border-solid rounded-full shadow-inner sm:border-4 md:border-8 h-5/6"></div>
        ); //red pawn
      case 2:
        return (
          <div className="absolute w-5/6 bg-gray-800 border-2 border-gray-900 border-solid rounded-full shadow-inner sm:border-4 md:border-8 h-5/6"></div>
        ); //black pawn
      case 3:
        return (
          <div className="absolute grid w-5/6 text-yellow-500 bg-red-500 border-2 border-red-700 border-solid rounded-full shadow-inner sm:border-4 md:border-8 place-content-center h-5/6">
            {/* <img src="https://img.icons8.com/nolan/50/crown.png" /> */}
            <img src="/images/crown.png" className="w-8 h-8 text-white" />
          </div>
        ); //red queen
      case 4:
        return (
          <div className="absolute grid w-5/6 bg-gray-800 border-2 border-gray-900 border-solid rounded-full shadow-inner sm:border-4 md:border-8 place-content-center h-5/6">
            {/* <img src="https://img.icons8.com/nolan/50/crown.png" /> */}
            <img src="/images/crown.png" className="w-8 h-8 text-white" />
          </div>
        ); //black queen

      default:
        break;
    }
  };
  //this ensure that the players color remains on the lower side
  console.log("rotation color:", color);
  const rot = color === "Black" ? 0 : 180;
  console.log("rotation degree:", rot);

  return (
    <div className="mb-3">
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
