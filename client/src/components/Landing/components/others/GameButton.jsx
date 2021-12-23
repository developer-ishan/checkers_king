import React, { useContext } from "react";
import { GameSoundContext } from "../../../../context/GameSoundContext";

const GameButton = ({
  onClickFn,
  className,
  shadowColor = "#FBC638",
  children,
}) => {
  let classes = "transform -skew-x-15 ";
  classes = classes + " " + className;
  const { clickSound, isMuted } = useContext(GameSoundContext);

  return (
    <button
      className={classes}
      onClick={() => {
        onClickFn();
        if (!isMuted) clickSound.play();
      }}
      style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
    >
      {children}
    </button>
  );
};

export default GameButton;
