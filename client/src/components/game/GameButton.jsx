import React, { Children } from "react";

const GameButton = ({
  onClickFn,
  className,
  text,
  children,
  shadowColor = "#FBC638",
}) => {
  console.log(Children);
  let classes = "block transform -skew-x-15";
  classes = classes + " " + className;
  console.log(classes);
  return (
    <>
      <button
        href=""
        onClick={onClickFn}
        className={classes}
        style={{ boxShadow: `6px 6px 0 ${shadowColor}` }}
      >
        {children}
      </button>
    </>
  );
};

export default GameButton;
