import React, { useState, useEffect } from "react";

const Test = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  let interval = null;
  useEffect(() => {}, []);

  return (
    <div className="App">
      <header className="App-header">
        {seconds} seconds have elapsed since mounting.
      </header>
      <button
        onClick={() => {
          if (!interval) {
            interval = setInterval(() => {
              setSeconds((seconds) => seconds + 1);
            }, 1000);
          }
        }}
      >
        start
      </button>
      <br />
      <button
        onClick={() => {
          clearInterval(interval);
          interval = null;
        }}
      >
        stop
      </button>
    </div>
  );
};

export default Test;
