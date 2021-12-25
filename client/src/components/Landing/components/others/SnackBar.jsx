import React from "react";

const SnackBar = ({
  setSnackBarContent,
  time = 3000,
  message = "some text....",
  btnText = "okay",
  btnAction = undefined,
  showBtn = true,
  stayOnScreen = false,
  onClose = null,
  onCloseHint = "close",
}) => {
  !stayOnScreen &&
    setTimeout(() => {
      setSnackBarContent("");
    }, time);
  const handleButtonClick = () => {
    if (btnAction === undefined) return;
    btnAction();
  };
  const handleClose = () => {
    if (onClose) onClose();
    else setSnackBarContent("");
  };
  return (
    <div className="fixed z-50 w-full max-w-xs p-4 text-sm text-black capitalize bg-white border-2 border-indigo-500 rounded shadow-lg dark:bg-gray-300 top-8 right-10">
      <div className="flex items-center justify-around">
        {message}
        {showBtn && (
          <button
            className="block px-4 py-2 mx-2 ml-auto text-xs font-bold text-white uppercase transition-all duration-150 bg-purple-500 rounded shadow outline-none sm:w-auto active:bg-purple-600 hover:shadow-md hover:bg-purple-600 focus:outline-none ease"
            onClick={() => handleButtonClick()}
          >
            {btnText}
          </button>
        )}
        <button
          className="px-2 py-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-600"
          onClick={handleClose}
          title={onCloseHint}
        >
          x
        </button>
      </div>
    </div>
  );
};

export default SnackBar;
