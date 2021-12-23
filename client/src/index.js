import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import { GameProvider } from "./context/GameContext";
import { GameSoundProvider } from "./context/GameSoundContext";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <GameProvider>
        <UserProvider>
          <GameSoundProvider>
            <App />
          </GameSoundProvider>
        </UserProvider>
      </GameProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
