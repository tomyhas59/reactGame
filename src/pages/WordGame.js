import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
const WordGame = () => {
  const [wordInput, onChangeWordInput, setWordInput] = useInput();
  const [numberInput, onChangeNumberInput, setNumberInput] = useInput();
  const [word, setWord] = useState("");
  const [start, setStart] = useState(false);
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState(1);
  const wordRef = useRef(null);
  const numberRef = useRef(null);

  function onNumberBtn() {
    if (!numberInput || isNaN(numberInput)) {
      alert("숫자를 입력해 주세요");
      setNumberInput("");
      numberRef.current.focus();
    } else if (!isNaN(numberInput) && numberInput > 0) {
      setNumber(numberInput);
      setStart(true);
    }
  }

  function onWordBtn() {
    if (number) {
      if (!isNaN(wordInput)) {
        alert("문자를 입력해주세요");
        setWordInput("");
        return;
      }
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
      <Container>
        <InfoBlock>
          <InfoText>
            <Participant>{number}명 참가</Participant>
          </InfoText>
          <InfoText>{order}번째 차례</InfoText>
          <InfoText>
            제시어: <WordSpan id="word">{word}</WordSpan>
          </InfoText>
        </InfoBlock>
        <Input
          ref={wordRef}
          type="text"
          value={wordInput}
          onChange={onChangeWordInput}
          onKeyDown={onEnter}
          placeholder="단어를 입력하세요"
        />
        <Button onClick={onWordBtn}>입력</Button>
      </Container>
    );
  } else {
    return (
      <Container>
        <Input
          type="number"
          ref={numberRef}
          placeholder="참가자 몇 명?"
          value={numberInput}
          onChange={onChangeNumberInput}
        />
        <Button onClick={onNumberBtn}>확인</Button>
      </Container>
    );
  }
};

export default WordGame;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const InfoBlock = styled.div`
  margin-bottom: 20px;
`;

const InfoText = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
`;

const Participant = styled.span`
  font-weight: bold;
`;

const WordSpan = styled.span`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
