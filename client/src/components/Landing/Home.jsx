import React from "react";
import Navbar from "./components/Navbar";
import UserAction from "./components/UserAction";

const Home = () => {
  return (
    <div className="bg-gray-100 bg-red-300 ">
      <Navbar />
      <div className="grid grid-cols-12">
        {/* left side */}
        <div className="grid col-span-12 col-start-1 px-5 md:col-span-8">
          <UserAction />
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
