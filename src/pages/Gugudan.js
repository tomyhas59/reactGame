import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
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
    <Container>
      <div>
        {num1} 곱하기 {num2}는?
      </div>
      <form onSubmit={onSubmit}>
        <Input
          type="number"
          value={value}
          onChange={onChangeValue}
          ref={inputRef}
        />
        <Button type="submit">입력!</Button>
      </form>
      <div>{message}</div>
    </Container>
  );
};

export default Gugudan;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
