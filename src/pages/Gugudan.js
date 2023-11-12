import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";

const Gugudan = () => {
  const [value, onChangeValue, setValue] = useInput("");
  const [num1, setNum1] = useState(Math.ceil(Math.random() * 9));
  const [num2, setNum2] = useState(Math.ceil(Math.random() * 9));
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!value) {
      alert("숫자를 입력해주세요");
      return;
    }
    if (num1 * num2 === parseInt(value)) {
      setMessage(`${num1} X ${num2}= ${value} 정답`);
      setNum1(Math.floor(Math.random() * 9 + 1));
      setNum2(Math.floor(Math.random() * 9 + 1));
    } else {
      setMessage("오답!");
    }
    setValue("");
    inputRef.current.focus();
  };

  return (
    <div>
      <div>
        {num1} 곱하기 {num2}는?
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="number"
          value={value}
          onChange={onChangeValue}
          ref={inputRef}
        />
        <button type="submit">입력!</button>
      </form>
      <div>{message}</div>
    </div>
  );
};

export default Gugudan;
