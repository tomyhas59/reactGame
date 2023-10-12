import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";

const Baseball = () => {
  const [input, onChangeInput, setInput] = useInput();
  const [logs, setLogs] = useState([]);
  const [tries, setTries] = useState([]);
  const [outNumber, setOutNumber] = useState([]);
  const [outCount, setOutCount] = useState(0); // 아웃 횟수를 세는 변수 추가
  const inputRef = useRef(null);

  const getNumber = () => {
    const numbers = [];
    for (let n = 0; n < 9; n += 1) {
      numbers.push(n + 1);
    }
    const array = [];
    for (let n = 0; n <= 3; n += 1) {
      const index = Math.floor(Math.random() * numbers.length); // 0~8 정수
      array.push(numbers[index]);
      numbers.splice(index, 1);
    }
    return array;
  };

  let answer = getNumber();

  const checkInput = (input) => {
    if (input.length !== 4) {
      alert("4자리 숫자를 입력해 주세요");
      setInput("");
      inputRef.current.focus();
      return;
    }
    if (new Set(input).size !== 4) {
      alert("숫자가 중복되었습니다");
      setInput("");
      inputRef.current.focus();
      return;
    }
    if (tries.includes(input)) {
      alert("이미 시도한 값입니다");
      setInput("");
      inputRef.current.focus();
      return;
    }
    return true;
  };

  const onSubmit = (e) => {
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
      setOutNumber([...outNumber, input]);
      setOutCount(outCount + 1);
    }

    if (strike === 0 && ball === 0) {
      setLogs([...logs, `${outCount}아웃`]);
    } else if (input === answer.join("")) {
      setLogs([...logs, "홈런!"]);
    } else if (tries.length >= 9) {
      setLogs([...logs, `패배! 정답은 ${answer.join("")}`]);
    } else if (outNumber.length >= 2) {
      setLogs([
        ...logs,
        `${outCount + 1}아웃, 패배! 정답은 ${answer.join("")}`,
      ]);
    } else {
      setLogs([...logs, `${input}: ${strike}스트라이크 ${ball}볼`]);
    }
    setInput("");
    inputRef.current.focus();
    setTries([...tries, input]);
  };

  const restartGame = () => {
    setLogs([]);
    setTries([]);
    setOutNumber([]);
    setOutCount(0);
    answer = getNumber();
  };

  return (
    <div>
      <div>숫자 4자리를 입력해 주세요</div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={onChangeInput}
          ref={inputRef}
        />
        <button type="submit">확인</button>
      </form>
      <div>
        결과:
        <div>
          {logs.map((log, i) =>
            log.includes("홈") || log.includes("패") ? (
              <>
                <div key={i}>{log}</div>
                <button onClick={restartGame}>재시작</button>
              </>
            ) : (
              <div key={i}>{log}</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Baseball;
