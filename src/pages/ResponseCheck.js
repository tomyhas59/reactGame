import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ResponseCheck = () => {
  const [color, setColor] = useState("skyblue");
  const [text, setText] = useState("클릭해서 시작하세요");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [records, setRecords] = useState([]);
  const [timeOutId, setTimeOutId] = useState(null);
  const [current, setCurrent] = useState(null);
  const [average, setAverage] = useState(null);
  const [fastRecord, setFastRecord] = useState([]);

  const onClickScreen = () => {
    if (color === "skyblue") {
      setColor("red");
      setText("초록색이 되면 클릭하세요");
      const timeoutId = setTimeout(() => {
        setStartTime(new Date());
        setText("클릭하세요");
        setColor("greenyellow");
      }, Math.floor(Math.random() * 1000) + 2000);
      setTimeOutId(timeoutId);
    } else if (color === "red") {
      clearTimeout(timeOutId);
      setColor("skyblue");
      setText("너무 성급하시군요");
    } else if (color === "greenyellow") {
      setEndTime(new Date());
      setColor("skyblue");
      setText("클릭해서 시작하세요");
    }
  };

  useEffect(() => {
    if (endTime && startTime) {
      const responseTime = endTime - startTime;
      if (responseTime > 0) {
        setCurrent(responseTime);
        setRecords([...records, responseTime]);
      }
    }
  }, [endTime, startTime, records]);

  useEffect(() => {
    const averageValue =
      records.length > 0 ? records.reduce((a, c) => a + c) / records.length : 0;
    setAverage(averageValue);
    const sortedRecords = [...records].sort((a, b) => a - b).slice(0, 5);
    setFastRecord(sortedRecords);
  }, [records]);

  return (
    <div>
      <Screen color={color} onClick={onClickScreen}>
        {text}
      </Screen>
      <div>결과: {current}ms</div>
      <div>평균: {average}ms</div>
      {fastRecord.map((v, i) => (
        <div key={i}>{`${i + 1}위: ${v}ms`}</div>
      ))}
    </div>
  );
};

export default ResponseCheck;

const Screen = styled.div`
  background-color: ${(props) => props.color};
  width: 300px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  user-select: none;
  cursor: pointer;
`;
