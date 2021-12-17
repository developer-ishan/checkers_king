import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/others/Navbar";
import { SocketContext } from "../../context/SocketContext";
import Leaderboard from "./components/others/Leaderboard";
import RandomPlay from "./components/gameCreateJoin/RandomPlay";
import PlayWithFriends from "./components/gameCreateJoin/PlayWithFriends";
import Modal from "react-modal";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { playWelcomeSound } from "../../helper/audioHelper";
Modal.setAppElement("#root");

const Home = ({ games, setGames }) => {
  const [socket, setSocket] = useContext(SocketContext);

  useEffect(() => {
    // receiving the ongoing games information
    socket.on("games", (games) => {
      setGames(games);
    });

    introJs()
      .setOptions({
        disableInteraction: true,
      })
      .addHints();
    playWelcomeSound();
    console.log("mounded");
  }, []);

  return (
    <div className="min-h-screen bg-yellow-300 dark:bg-gray-900 dark:text-gray-200">
      <Navbar />
      <div className="grid grid-cols-12 mx-auto max-w-screen-2xl">
        {/* left side */}
        <div className="col-span-12 col-start-1 px-5 lg:col-span-8 ">
          <RandomPlay socket={socket} d />
          <PlayWithFriends socket={socket} />
        </div>

        {/* rightside */}
        <div className="col-span-12 lg:col-span-auto lg:col-start-9">
          <Leaderboard />
        </div>

        {/* <RandomPlay socket={socket} />
        <PlayWithFriends socket={socket} /> */}

        {/* right side */}
        {/* <div className="col-span-12 row-span-1 row-start-1 px-5 lg:col-start-9">
          <Leaderboard />
        </div> */}
        {/* <div>
          <TopPlayers />
          <RecentMatches />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
