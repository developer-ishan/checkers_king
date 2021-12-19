import React, { useState, useEffect } from "react";
import AutoCompleteInput from "./components/comm/AutoCompleteInput";

const Test = () => {
  useEffect(() => {}, []);
  const [selected, setSelected] = useState({});
  return (
    <div>
      <h1>Test Components</h1>
      <AutoCompleteInput
        url="http://localhost:9500/api/user/search?q="
        selected={selected}
        setSelected={setSelected}
      />
      <h1>Selected user: {selected.username}</h1>
    </div>
  );
};

export default Test;
