import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/others/Navbar";
import HomeSong from "../../static/home.mp3";
import { SocketContext } from "../../context/SocketContext";
import Leaderboard from "./components/others/Leaderboard";
import RandomPlay from "./components/gameCreateJoin/RandomPlay";
import PlayWithFriends from "./components/gameCreateJoin/PlayWithFriends";
const Home = ({ games, setGames }) => {
  const [music] = useState(new Audio(HomeSong));
  const [socket, setSocket] = useContext(SocketContext);

  useEffect(() => {
    // receiving the ongoing games information
    socket.on("games", (games) => {
      setGames(games);
    });
  }, []);

  const playMusic = () => {
    // music.play();
    //TODO:later turn it on
  };

  // playMusic();
  return (
    <div
      className="h-screen bg-yellow-300 dark:bg-gray-900 dark:text-gray-200"
      onMouseMove={() => playMusic()}
    >
      <Navbar />
      <div className="grid grid-cols-12 mx-auto max-w-screen-2xl">
        {/* left side */}
        <div className="col-span-12 col-start-1 px-5 lg:col-span-8">
          <RandomPlay socket={socket} />
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
