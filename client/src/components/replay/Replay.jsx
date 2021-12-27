import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { API } from "../../config/backend";
import Board from "./components/Board";
import Lobby from "../lobby/Lobby";
import { getChatsByMatchId } from "../../helper/userHelper";
import Navbar from "../Landing/components/others/Navbar";
const Replay = () => {
  const { matchId } = useParams();
  const [data, setData] = useState(null);
  const [chats, setChats] = useState(null);
  const history = useHistory();
  useEffect(() => {
    if (matchId) {
      fetch(`${API}/api/match/details/${matchId}`)
        .then((res) => {
          if (res.ok) {
            res.json().then((apidata) => {
              console.log("replay data", apidata);
              setData(apidata);
            });
          } else {
            history.push("/404");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      getChatsByMatchId(matchId).then((res) => {
        console.log("chats", res);
        setChats(res);
      });
    } else history.push("/404");
  }, []);

  return (
    <div className="">
      {chats && data ? (
        <>
          <Navbar />
          <Board
            moves={data.moves}
            playersInfo={data.players}
            chats={chats}
            winner={data.winner}
            botLevel={data.botLevel}
            isRated={data.isRated}
            mandatoryMoves={data.mandatoryMoves}
          />
        </>
      ) : (
        <Lobby heading="Loading replay" />
      )}
    </div>
  );
};
export default Replay;
