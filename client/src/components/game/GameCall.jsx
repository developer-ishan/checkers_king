import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

const GameCall = ({ socket, gameId }) => {
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [currentUserVideoStream, setCurrentUserVideoStream] = useState(null);
  const [opponentsVideoStream, setOpponentsVideoStream] = useState(null);
  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("your peerid is:", id);
      console.log("sending gameId:", gameId);
      socket.emit("opponent-video-ready", { peerId: id, gameId });
    });

    //when you get called
    peer.on("call", (call) => {
      console.log("received call......");
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      // TODO:later turn audio to true
      getUserMedia({ video: true, audio: false }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        setCurrentUserVideoStream(mediaStream);
        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          setOpponentsVideoStream(remoteStream);
        });
      });
    });

    //you are calling the opponent
    socket.on("opponent-video-ready", (opponentPeerId) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      // TODO:later turn audio to true
      getUserMedia({ video: true, audio: false }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        setCurrentUserVideoStream(mediaStream);

        const call = peer.call(opponentPeerId, mediaStream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          setOpponentsVideoStream(remoteStream);
        });
      });
    });
  }, []);

  return (
    <div>
      <div className="relative max-w-md mx-auto bg-indigo-300">
        {/* opponent */}
        {true && <video ref={remoteVideoRef} className="" />}
        {!opponentsVideoStream && (
          <div className="absolute inset-0 grid place-content-center">
            <p className="text-xs text-white ">waiting for oppponent's video</p>
          </div>
        )}

        {/* you */}
        {true && (
          <video
            ref={currentUserVideoRef}
            className="absolute border-2 border-black shadow-sm h-1/4 bottom-1 right-1"
          />
        )}
        {!currentUserVideoStream && (
          <div className="absolute grid w-1/4 bg-gray-500 h-1/4 bottom-1 right-1 place-content-center">
            <p className="text-xs text-white ">you</p>
          </div>
        )}
      </div>
      <div className="w-full p-2 mt-2 text-center text-white bg-indigo-500">
        video controls
      </div>
    </div>
  );
};

export default GameCall;
