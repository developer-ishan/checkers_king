import React from "react";
import { useParams } from "react-router";
import Navbar from "../Landing/components/Navbar";
import PreviousMatches from "./components/PreviousMatches";
import UserInfo from "./components/UserInfo";

const Profile = () => {
  const { userId } = useParams();
  return (
    <div className="space-y-3 bg-gray-100 ">
      {/*TODO:either set the navbar global or do something of it  */}
      <Navbar />
      <div className="relative grid grid-cols-12 gap-3 p-2 mx-auto max-w-7xl">
        <div className="h-full col-span-12 lg:col-span-3 ">
          <UserInfo userId={userId} />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <PreviousMatches userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
