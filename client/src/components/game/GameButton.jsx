import React from "react";

const GameButton = ({
  onClickFn,
  className,
  shadowColor = "#FBC638",
  children,
}) => {
  let classes = "transform -skew-x-15 ";
  classes = classes + " " + className;
  return (
    <button
      className={classes}
      onClick={() => onClickFn()}
      style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
    >
      {children}
    </button>
  );
};

export default GameButton;
