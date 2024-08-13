import React, { useRef, useState, useCallback } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";

const Baseball = () => {
  const [input, onChangeInput, setInput] = useInput();
  const [logs, setLogs] = useState([]);
  const [tries, setTries] = useState([]);
  const [outCount, setOutCount] = useState(1);
  const inputRef = useRef(null);
  const [answer, setAnswer] = useState(getNumber());

  function getNumber() {
    const numbers = [];
    for (let n = 0; n < 9; n += 1) {
      numbers.push(n + 1);
    }
    const array = [];
    for (let n = 0; n <= 3; n += 1) {
      const index = Math.floor(Math.random() * numbers.length);
      array.push(numbers[index]);
      numbers.splice(index, 1);
    }
    return array;
  }

  const checkInput = useCallback(
    (input) => {
      if (input.length !== 4) {
        alert("4자리 숫자를 입력해 주세요");
        setInput("");
        inputRef.current.focus();
        return false;
      }
      if (new Set(input).size !== 4) {
        alert("숫자가 중복되었습니다");
        setInput("");
        inputRef.current.focus();
        return false;
      }
      if (tries.includes(input)) {
        alert("이미 시도한 값입니다");
        setInput("");
        inputRef.current.focus();
        return false;
      }
      return true;
    },
    [setInput, tries]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        if (lastLog.includes("홈") || lastLog.includes("패")) {
          return;
        }
      }
      if (!checkInput(input)) {
        return;
      }

      let strike = 0;
      let ball = 0;

      for (let i = 0; i < answer.length; i++) {
        const index = input.indexOf(answer[i]);
        if (index > -1) {
          if (index === i) {
            strike += 1;
          } else {
            ball += 1;
          }
        }
      }

      if (strike === 0 && ball === 0) {
        const newOutCount = outCount + 1;
        setOutCount(newOutCount);
        if (newOutCount >= 3) {
          setLogs([
            ...logs,
            `${newOutCount} 아웃, 패배! 정답은 ${answer.join("")}`,
          ]);
        }
        setLogs([...logs, `${input}: ${newOutCount} 아웃`]);
      } else if (input === answer.join("")) {
        setLogs([...logs, "홈런!"]);
      } else if (tries.length >= 9) {
        setLogs([...logs, `패배! 정답은 ${answer.join("")}`]);
      } else {
        setLogs([...logs, `${input}: ${strike} 스트라이크 ${ball} 볼`]);
      }
      setInput("");
      inputRef.current.focus();
      setTries([...tries, input]);
    },
    [logs, checkInput, input, answer, tries, setInput, outCount]
  );

  const restartGame = useCallback(() => {
    setLogs([]);
    setTries([]);
    setOutCount(1);
    setAnswer(getNumber());
  }, []);

  return (
    <Container>
      <Title>숫자 야구 게임</Title>
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          value={input}
          onChange={onChangeInput}
          ref={inputRef}
          maxLength={4}
          placeholder="4자리 숫자"
        />
        <SubmitButton type="submit">확인</SubmitButton>
      </Form>
      <LogsContainer>
        {logs.map((log, i) => (
          <LogEntry
            key={i}
            isGameOver={log.includes("홈") || log.includes("패")}
          >
            <LogText>{log}</LogText>
            {log.includes("홈") ||
              (log.includes("패") && (
                <RestartButton onClick={restartGame}>재시작</RestartButton>
              ))}
          </LogEntry>
        ))}
      </LogsContainer>
    </Container>
  );
};

export default Baseball;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  font-family: "Roboto", sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.2rem;
  width: 120px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    border-color: #4caf50;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #45a049;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const LogsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const LogEntry = styled.div`
  background-color: ${({ isGameOver }) => (isGameOver ? "#ffebee" : "#fff")};
  border: 1px solid ${({ isGameOver }) => (isGameOver ? "#f44336" : "#ddd")};
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const RestartButton = styled(SubmitButton)`
  background-color: #ff5722;
  margin-top: 10px;
  &:hover {
    background-color: #e64a19;
  }
`;
