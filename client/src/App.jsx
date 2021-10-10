import { useEffect, useState } from "react";
import io from "socket.io-client";
import Game from "./components/game/Game";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const clientSocket = io("http://localhost:8000", {
      transports: ["websocket"],
    });
    setSocket(clientSocket);
  }, []);

  return (
    <div className="h-full bg-gradient-to-r from-green-400 to-blue-500">
      <header>
        <p className="text-4xl text-center text-white capitalize">
          hello peter
        </p>
      </header>
      <div>
        <Game />
      </div>
    </div>
  );
}

export default App;
