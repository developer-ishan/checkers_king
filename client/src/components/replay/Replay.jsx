import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { API } from "../../config/backend";
import Board from "./components/Board";
import Lobby from "../lobby/Lobby";
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
    <div className="">
      {loading ? (
        <Lobby heading="Loading replay" />
      ) : (
        <Board moves={data.moves} playersInfo={data.players} />
      )}
    </div>
  );
};
export default Replay;
