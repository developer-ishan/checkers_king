import React, { useState } from "react";
import { isAuthenticated } from "../../../../helper/authHelper";
import AutoCompleteInput from "../../../comm/AutoCompleteInput";
import { Redirect, useHistory } from "react-router-dom";
import BASE from "../../../../config";

const FindUser = () => {
  const [selected, setSelected] = useState(null);
  const history = useHistory();
  const takeToUserProfile = () => {
    if (!selected) return;
    history.push(`/user/${selected._id}`);
    // return <Redirect to="/user/61b4d195197b61f1f058d41e" />;
  };

  return (
    <div
      data-title="FIND USER"
      data-intro="you can find user by their usernames"
      className="items-stretch w-full bg-white rounded-lg shadow-xl lg:mx-auto lg:w-10/12 dark:bg-gray-700"
    >
      <div className="h-auto p-4 bg-indigo-500 rounded-t-lg dark:bg-gray-800">
        <h2 className="text-lg font-semibold tracking-wide text-center text-white capitalize">
          find user
        </h2>
      </div>
      <div className="grid px-2 py-4 rounded-b-lg place-content-center">
        <div className="space-y-5">
          <AutoCompleteInput
            url={`${BASE}/api/user/search?q=`}
            selected={selected}
            setSelected={setSelected}
            placeholder="Type Username..."
            className="w-full py-1 border-4 border-dashed outline-none ring-0 dark:bg-gray-700 "
          />
          <button
            className="block w-full px-4 py-2 mx-auto text-sm font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-indigo-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
            onClick={() => takeToUserProfile()}
          >
            find
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindUser;
