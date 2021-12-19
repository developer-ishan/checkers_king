import React, { useState, useEffect } from "react";

const AutoCompleteInput = ({ url, selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  useEffect(() => {}, []);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setLoading(true);
          fetch(url + e.target.value, {
            method: "get",
            headers: {
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
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AutoCompleteInput;
