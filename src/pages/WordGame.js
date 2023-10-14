import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";

const WordGame = () => {
  const [wordInput, onChangeWordInput, setWordInput] = useInput();
  const [numberInput, onChangeNumberInput, setNumberInput] = useInput();
  const [word, setWord] = useState("");
  const [start, setStart] = useState(false);
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState(1);
  const wordRef = useRef(null);

  function onNumberBtn() {
    if (!isNaN(numberInput)) {
      // isNaN 숫자가 있으면 false
      setNumber(numberInput);
      setStart(true);
    }
  }

  function onWordBtn() {
    if (number) {
      if (
        (!word && wordInput.length === 3) ||
        (word[word.length - 1] === wordInput[0] && wordInput.length === 3)
      ) {
        setWord(wordInput);
        if (order + 1 > number) {
          setOrder(1);
        } else {
          setOrder(order + 1);
        }
      } else {
        alert("세 글자만 됩니다");
      }
      setWordInput("");
      wordRef.current.focus();
    }
  }

  function onEnter(e) {
    if (e.key === "Enter") {
      onWordBtn();
    }
  }

  if (start) {
    return (
      <div>
        <div>
          <span>{number}명 참가</span>
        </div>
        <div>{order}번째 차례</div>
        <div>
          제시어: <span id="word">{word}</span>
        </div>
        <input
          ref={wordRef}
          type="text"
          value={wordInput}
          onChange={onChangeWordInput}
          onKeyDown={onEnter}
        />
        <button onClick={onWordBtn}>입력</button>
      </div>
    );
  } else {
    return (
      <div>
        <input
          placeholder="참가자 몇 명?"
          value={numberInput}
          onChange={onChangeNumberInput}
        />
        <button onClick={onNumberBtn}>확인</button>
      </div>
    );
  }
};

export default WordGame;
