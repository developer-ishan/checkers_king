import React, { useEffect } from "react";
import { useParams } from "react-router";
import Board from './components/Board'
const Replay = () => {
  const { matchId } = useParams();
  let moves = [
    "R2433",
    "B5544",
    "R3355",
    "B6644",
    "R2635",
    "B4426",
    "R1735",
    "B5344",
    "R3553",
    "B6442",
    "R2233",
    "B4224",
    "R1533",
    "B5142",
    "R3351",
    "B6042",
    "R0615",
    "B4233",
    "R1524",
    "B6253",
    "R2442",
    "B5344",
    "R4251",
    "B7362",
    "R5173",
    "B4433",
    "R1122",
    "B3311",
    "R0022",
    "B7566",
    "R7364",
    "B6655",
    "R6446",
    "B5735",
    "R1324",
    "B3513",
    "R2233",
    "B7766",
    "R3344",
    "B6655",
    "R4466",
    "B7162",
    "R0224",
    "B6253",
    "R2433",
    "B5344",
    "R3355",
  ];
  useEffect(() => {}, []);

  return (<div>
    <Board moves = {moves}/>
  </div>);
};
export default Replay;
