import React, { ChangeEvent, useState } from "react";
import "./App.css";

function App() {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const textToType = "The quick brown fox jumps over the lazy dog.";
  // const textToType =
  //   "Peter Piper picked a peck of pickled peppers. How many pickled peppers did Peter Piper pick?";

  let lastMatchingIndex = -1;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === textToType[i]) {
      lastMatchingIndex = i;
    } else {
      break;
    }
  }

  const isDone =
    typedText.length > 0 && lastMatchingIndex === textToType.length - 1;

  if (!endTime && isDone) {
    setEndTime(Date.now());
  }

  const correctlyTyped = textToType.slice(0, lastMatchingIndex + 1);
  const incorrectlyTyped = typedText.slice(lastMatchingIndex + 1);
  const untyped = textToType.slice(
    lastMatchingIndex + 1 + incorrectlyTyped.length
  );

  const getCharClassName = (i: number) => {
    let typedClassName = "Untyped";
    if (i <= lastMatchingIndex) {
      typedClassName = "Correct";
    } else if (typedText.length > i) {
      typedClassName = "Incorrect";
    }
    return typedClassName;
  };

  return (
    <div className="App">
      <div className="TextWrapper">
        <div className="ShadowText">
          {correctlyTyped
            .split("")
            .concat(incorrectlyTyped.split(""))
            .concat(untyped.split(""))
            .map((char, i) => {
              return (
                <span className={getCharClassName(i)} key={i}>
                  {char === " " ? "\u00b7" : char}
                </span>
              );
            })}
        </div>
        <div className="TextToType">
          {textToType.split("").map((char, i) => {
            return (
              <span className={getCharClassName(i)} key={i}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
      <textarea
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setTypedText(e.target.value);
          if (startTime === null) {
            setStartTime(Date.now());
          }
          if (!textToType.startsWith(typedText)) {
            setMistakes(mistakes + 1);
          }
        }}
        className="InputField"
        value={typedText}
        disabled={!!endTime}
      />
      {startTime && !endTime && (
        <div>
          <strong>Go!</strong>
        </div>
      )}
      {endTime && startTime && (
        <div>
          Total seconds: <strong>{(endTime - startTime) / 1000}</strong>
          <br />
          WPM:{" "}
          <strong>
            {Math.floor(
              textToType.split(" ").length / ((endTime - startTime) / 1000 / 60)
            )}
          </strong>
          <br />
          Mistakes: <strong>{mistakes}</strong>
          <br />
          <button
            onClick={() => {
              setStartTime(null);
              setEndTime(null);
              setTypedText("");
              setMistakes(0);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
