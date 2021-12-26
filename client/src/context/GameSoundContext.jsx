import React, { createContext, useState } from "react";

export const GameSoundContext = createContext();
//this is the url of folder in public folder
const BASE = "/sounds";
export const GameSoundProvider = (props) => {
  const [sound, setSound] = useState({
    welcomeSound: new Audio(`${BASE}/welcome.mp3`),
    clickSound: new Audio(`${BASE}/click.mp3`),
    jumpSound: new Audio(`${BASE}/jump.mp3`),
    selectSound: new Audio(`${BASE}/select.mp3`),
    winSound: new Audio(`${BASE}/win.mp3`),
    loseSound: new Audio(`${BASE}/lose.mp3`),
    crownSound: new Audio(`${BASE}/crown.mp3`),
    slideSound: new Audio(`${BASE}/slide.mp3`),
    notificationSound: new Audio(`${BASE}/notification.mp3`),
  });
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (isMuted) setIsMuted(false);
    else setIsMuted(true);
  };

  return (
    <GameSoundContext.Provider value={{ ...sound, isMuted, toggleMute }}>
      {props.children}
    </GameSoundContext.Provider>
  );
};
