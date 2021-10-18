import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import UserAction from "./components/UserAction";
import HomeSong from "../../static/home.mp3";
import { SocketContext } from "../../context/SocketContext";

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
      className="bg-yellow-300 dark:bg-gray-900 dark:text-gray-200"
      onMouseMove={() => playMusic()}
    >
      <Navbar />
      <div className="grid grid-cols-12">
        {/* left side */}
        <div className="grid col-span-12 col-start-1 px-5 lg:col-span-8">
          <UserAction socket={socket} />
        </div>

        {/* right side */}
        {/* <div>
          <TopPlayers />
          <RecentMatches />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
