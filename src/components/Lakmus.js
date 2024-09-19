"use client";

import axios from "axios";
import { useState } from "react";

export default function Lakmus() {
  const [apiResponse, setApiResponse] = useState(null);
  const [text, setText] = useState("");

  const handeBtnClick = async () => {
    const response = await axios.get("/api/testing");
    setApiResponse(response.data);
  };

  const handleTextInput = (e) => {
    setText(e.target.value);
  };

  const handleTextSubmit = async () => {
    const response = await axios.post("/api/testing", { text });

    setText("");
  };

  return (
    <>
      {apiResponse && <p>{JSON.stringify(apiResponse.lakmuses)}</p>}
      <button onClick={handeBtnClick}>Get API response</button>
      <button onClick={() => setApiResponse("")}>Clear API response</button>
      <textarea
        onChange={handleTextInput}
        className="w-1/2 h-1/2 shadow shadow-lg"
        value={text}
      />
      <>
        <button onClick={handleTextSubmit}>Submit</button>
      </>
    </>
  );
}
