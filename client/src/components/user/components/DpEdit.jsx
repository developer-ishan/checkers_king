import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { Line } from "rc-progress";
import BASE from "../../../config";
import { isAuthenticated } from "../../../helper/authHelper";

const DpEdit = () => {
  const [userState, setUserState] = useContext(UserContext);

  const [state, setState] = useState({ selectedFile: null, loaded: 0 });

  const checkMimeType = (event) => {
    let files = event.target.files;
    let err = []; // create empty array
    const types = ["image/png", "image/jpeg", "image/gif"];
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        err[x] = files[x].type + " is not a supported format\n";
        // assign message to array
      }
    }
    for (var z = 0; z < err.length; z++) {
      // loop create alert massage
      event.target.value = null;
      alert(err[z]);
    }
    return true;
  };

  const maxSelectFile = (event) => {
    let files = event.target.files; // create file object
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      event.target.value = null; // discard selected file
      alert(msg);
      return false;
    }
    return true;
  };

  const checkFileSize = (event) => {
    let files = event.target.files;
    let size = 2000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      alert(err[z]);
      event.target.value = null;
    }
    return true;
  };

  const onChangeHandler = (event) => {
    var files = event.target.files;
    setState({
      selectedFile: files,
      loaded: 0,
    });
    if (maxSelectFile(event) && checkMimeType(event) && checkMimeType(event)) {
      // if return true allow to setState
      setState({
        selectedFile: files,
        loaded: 0,
      });
    }
  };

  const onClickHandler = () => {
    const data = new FormData();
    for (var x = 0; x < state.selectedFile.length; x++) {
      data.append("photo", state.selectedFile[x]);
    }
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
        setUserState(prevState => {
          return {
            ...prevState,
            photo: `${BASE}/public/dp/${res.data.filename}`
          }
        })
      })
      .catch((err) => {
        console.log(err);
        alert("upload fail");
      });
  };
  return (
    <div className="container" style={{marginBottom: "10px"}}>
      <div className="row">
        <div className="col-md-6">
          <form method="post" action="#" id="#">
            <div className="form-group">
              <input
                type="file"
                className="form-control"
                onChange={onChangeHandler}
              />
            </div>
            <div className="form-group">
              {state.selectedFile && <Line
                percent={Math.round(state.loaded, 2)}
                strokeWidth="4"
                strokeColor="#2db7f5"
              />}
              
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
