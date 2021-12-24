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
    <div className="self-center">
      <div className="relative max-w-md mx-auto bg-gray-300">
        {/* opponent */}
        {true && (
          <video
            ref={remoteVideoRef}
            className=""
            data-title="OPPONENTS VIDEO"
            data-intro="opponent's video will appear here"
          />
        )}
        {!opponentsVideoStream && (
          <div
            className="absolute inset-0 grid place-content-center"
            data-title="OPPONENTS VIDEO"
            data-intro="opponent's video will appear here"
          >
            <p className="text-xs text-white ">waiting for oppponent's video</p>
          </div>
        )}

        {/* you */}
        {true && (
          <video
            ref={currentUserVideoRef}
            className="absolute border-2 border-black shadow-sm h-1/4 bottom-1 right-1"
            data-title="YOUR VIDEO"
            data-intro="YOUR video will appear here"
          />
        )}
        {!currentUserVideoStream && (
          <div
            className="absolute grid w-1/4 bg-gray-500 h-1/4 bottom-1 right-1 place-content-center"
            data-title="YOUR VIDEO"
            data-intro="YOUR video will appear here"
          >
            <p className="text-xs text-white ">you</p>
          </div>
        )}
      </div>
      <div
        className="flex justify-around w-full p-2 text-center text-white bg-gray-300 "
        data-title="AUDIO VIDEO CONTROLS"
        data-intro="use these buttons to control the camera and mic"
      >
        <img
          src="https://img.icons8.com/ios/50/000000/no-camera--v1.png"
          title="shut camera"
          className="w-5 h-5"
        />
        <img
          src="https://img.icons8.com/ios/50/000000/no-microphone.png"
          title="mute mic"
          className="w-5 h-5"
        />
      </div>
    </div>
  );
};

export default GameCall;
