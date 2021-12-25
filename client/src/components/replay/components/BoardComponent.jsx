import React from "react";
import { Link } from "react-router-dom";
import { API } from "../../../config/backend";

const BoardComponent = ({ boardMatrix, playersInfo, botLevel }) => {
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
            <img
              src="/images/crown.png"
              alt="Crown_Image"
              className="w-8 h-8 text-white"
            />
          </div>
        ); //red queen
      case 4:
        return (
          <div className="absolute grid w-5/6 bg-gray-800 border-2 border-gray-900 border-solid rounded-full shadow-inner sm:border-4 md:border-8 place-content-center h-5/6">
            {/* <img src="https://img.icons8.com/nolan/50/crown.png" /> */}
            <img
              src="/images/crown.png"
              alt="Crown_Image"
              className="w-8 h-8 text-white"
            />
          </div>
        ); //black queen

      default:
        break;
    }
  };
  const botProfile = () => {
    return (
      <Link
        className="flex items-center "
        title={`this is a bot,not a real player`}
      >
        <img
          src={`/images/bot.png`}
          alt="bot's profile pic"
          className="w-8 h-8 mx-1 rounded-full"
        />

        {`Bot_Lvl${botLevel}`}
      </Link>
    );
  };
  const redPlayerInfo = () => {
    let player = null;
    //match is against a real player
    playersInfo.forEach((p) => {
      if (p.color === "Red") {
        player = p;
      }
    });
    if (!player) return botProfile();

    return (
      <Link
        to={`/user/${player.id}`}
        className="flex items-center "
        title={`click to see ${player.userName}'s full profile`}
      >
        <img
          src={`${player.photo}`}
          alt="player's profile pic"
          className="w-8 h-8 mx-1 rounded-full"
        />

        {player.userName}
      </Link>
    );
  };
  const blackPlayerInfo = () => {
    let player = null;
    //match is against a real player
    playersInfo.forEach((p) => {
      if (p.color === "Black") {
        player = p;
      }
    });
    if (!player) return botProfile();

    return (
      <Link
        to={`/user/${player.id}`}
        className="flex items-center "
        title={`click to see ${player.userName}'s full profile`}
      >
        <img
          src={`${player.photo}`}
          alt="player's profile pic"
          className="w-8 h-8 mx-1 rounded-full"
        />

        {player.userName}
      </Link>
    );
  };

  return (
    <div
      className="mx-auto mb-3"
      style={{
        height: "90vmin",
        width: "90vmin",
      }}
    >
      <div
        className="flex items-center justify-start p-1 bg-indigo-500"
        style={{ width: "90vmin" }}
        data-title="RED PLAYER"
        data-intro="you can click on players name to see more details"
      >
        {redPlayerInfo()}
      </div>

      {/* board start*/}
      <div
        style={{
          height: "90vmin",
          width: "90vmin",
          border: "0.8rem double #fff",
        }}
        className="grid grid-cols-1 mx-auto grid-rows-8"
        data-title="REPLAY BOARD"
        data-intro="here you will see the match replay"
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
      <div
        className="flex items-center justify-start p-1 bg-indigo-500"
        style={{ width: "90vmin" }}
        data-title="BLACK PLAYER"
        data-intro="you can click on players name to see more details"
      >
        {blackPlayerInfo()}
      </div>
    </div>
  );
};

export default BoardComponent;
