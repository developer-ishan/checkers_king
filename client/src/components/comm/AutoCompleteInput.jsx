import React, { useState, useEffect } from "react";

const AutoCompleteInput = ({ url, headers, selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  useEffect(() => {}, []);

  return (
    <div>
      <input
        className="g-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setLoading(true);
          fetch(url + e.target.value, {
            method: "get",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  console.log(data);
                  setGuesses(data);
                });
              } else alert(res.status);
              setLoading(false);
            })
            .catch((err) => console.log(31, err));
        }}
      />
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : input ? (
          guesses.map((user, index) => (
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              key={user._id}
              onClick={(e) => {
                setSelected(user);
              }}
            >
              {user.username}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteInput;
