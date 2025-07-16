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
        setRecords((prevRecords) => [...prevRecords, responseTime]);
      }
    }
  }, [endTime, startTime]);

  useEffect(() => {
    const averageValue =
      records.length > 0
        ? records.reduce((a, c) => a + c) / records.length
        : null;
    setAverage(averageValue);
    const sortedRecords = records
      .slice()
      .sort((a, b) => a - b)
      .slice(0, 5);
    setFastRecord(sortedRecords);
  }, [records]);

  return (
    <Container>
      <Screen color={color} onClick={onClickScreen}>
        {text}
      </Screen>
      <Result>결과: {current}ms</Result>
      <Result>평균: {average}ms</Result>
      <Ranking>
        {fastRecord.map((v, i) => (
          <RankingItem key={i}>{`${i + 1}위: ${v}ms`}</RankingItem>
        ))}
      </Ranking>
    </Container>
  );
};

export default ResponseCheck;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const Screen = styled.div`
  background-color: ${(props) => props.color};
  width: 300px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  user-select: none;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

const Result = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Ranking = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RankingItem = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;
