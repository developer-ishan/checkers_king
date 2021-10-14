import React from "react";
import { useParams } from "react-router";
import Navbar from "../Landing/components/Navbar";
import PreviousMatches from "./components/PreviousMatches";
import UserInfo from "./components/UserInfo";

const Profile = () => {
  const { userId } = useParams();
  return (
    <div className="p-3 space-y-3 bg-gray-100">
      {/*TODO:either set the navbar global or do something of it  */}
      <Navbar />
      <UserInfo userId={userId} />
      <PreviousMatches userId={userId} />
    </div>
  );
};

export default Profile;
