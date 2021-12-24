import React, { useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { Line } from "rc-progress";
import BASE from "../../../config";
import { isAuthenticated } from "../../../helper/authHelper";
import { GameSoundContext } from "../../../context/GameSoundContext";

const DpEdit = ({ state, setState }) => {
  const [userState, setUserState] = useContext(UserContext);
  const { clickSound, isMuted } = useContext(GameSoundContext);

  const checkFileSize = (file) => {
    let size = 2000000;
    if (file.size > size) return false;
    return true;
  };

  const checkFileType = (file) => {
    const types = ["image/png", "image/jpeg", "image/gif"];
    if (types.every((type) => file.type !== type)) return false;

    return true;
  };

  const onClickHandler = () => {
    if (!isMuted) clickSound.play();
    //just for safety
    if (state.selectedFile.length === 0) return;

    const file = state.selectedFile[0];
    //checking file type
    if (!checkFileType(file)) {
      alert(file.type + " is not supported format\n");
      setState({
        ...state,
        selectedFile: null,
      });
      return;
    }
    //checking file size
    if (!checkFileSize(file)) {
      alert("file too large, please pick a smaller file\n");
      setState({
        ...state,
        selectedFile: null,
      });
      return;
    }

    //if everything ok
    const data = new FormData();
    data.append("photo", file);
    const token = isAuthenticated();
    axios
      .post(`${BASE}/api/user/dp`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (ProgressEvent) => {
          setState({
            ...state,
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      })

      .then((res) => {
        // then print response status
        console.log(res.statusText);
        alert("upload success");
        setState({
          ...state,
          selectedFile: null,
        });
        setUserState((prevState) => {
          return {
            ...prevState,
            photo: `${BASE}/public/dp/${res.data.filename}`,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        alert("upload fail");
      });
  };
  return (
    <div className="container" style={{ marginBottom: "10px" }}>
      <div className="row">
        <div className="col-md-6">
          <form method="post" action="#" id="#">
            <div className="form-group">
              {state.selectedFile && (
                <Line
                  percent={Math.round(state.loaded, 2)}
                  strokeWidth="4"
                  strokeColor="#2db7f5"
                />
              )}

              <button
                type="button"
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={onClickHandler}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DpEdit;
