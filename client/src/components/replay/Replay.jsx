import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { API } from "../../config/backend";
import Board from "./components/Board";
import Lobby from "../game/Lobby";
const Replay = () => {
  const { matchId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    if (matchId)
      fetch(`${API}/api/match/details/${matchId}`)
        .then((res) => {
          if (res.ok) {
            res.json().then((apidata) => {
              console.log("replay data", apidata);
              setData(apidata);
              setLoading(false);
            });
          } else {
            history.push("/404");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    else history.push("/404");
  }, []);

  return (
    <div className="relative">
      {loading ? (
        <Lobby heading="Loading replay" />
      ) : (
        <Board moves={data.moves} />
      )}
    </div>
  );
};
export default Replay;
