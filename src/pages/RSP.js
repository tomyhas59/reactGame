import React, { useCallback, useEffect, useState, useRef } from "react";
import SRP from "../rsp.png";
import styled from "styled-components";
import useCustomRef from "../hooks/useCustomRef";

const RSP = () => {
  const [computerChoice, setComputerChoice] = useState("scissors");
  const rspX = {
    scissors: "0",
    rock: "-220px",
    paper: "-440px",
  };
  const [score, setScore] = useState(0);
  const [clickable, setClickable] = useState(true);
  const [message, setMessage] = useState("");
  const [intervalId] = useCustomRef();

  const changeComputerHand = useCallback(() => {
    if (computerChoice === "scissors") {
      setComputerChoice("rock");
    } else if (computerChoice === "rock") {
      setComputerChoice("paper");
    } else if (computerChoice === "paper") {
      setComputerChoice("scissors");
    }
  }, [computerChoice, setComputerChoice]);

  useEffect(() => {
    intervalId.current = setInterval(changeComputerHand, 50);
    return () => {
      clearInterval(intervalId.current);
    };
  }, [computerChoice, changeComputerHand]);

  const onClickRsp = useCallback(
    (props) => {
      if (!clickable) {
        return;
      }
      // 클릭 시 기존의 intervalId를 제거
      clearInterval(intervalId.current);
      setClickable(false);

      // 이전 점수 값을 사용하여 현재 점수를 업데이트
      if (computerChoice === props) {
        setScore((prevScore) => prevScore + 1);
        setMessage("무승부");
      } else {
        if (
          (props === "scissors" && computerChoice === "paper") ||
          (props === "rock" && computerChoice === "scissors") ||
          (props === "paper" && computerChoice === "rock")
        ) {
          setScore((prevScore) => prevScore + 2);
          setMessage("승리");
        } else {
          setScore((prevScore) => prevScore - 2);
          setMessage("패배");
        }
      }
      // 클릭 후 1초 후에 intervalId 설정
      setTimeout(() => {
        intervalId.current = setInterval(changeComputerHand, 50);
        setClickable(true);
      }, 1000);
    },
    [computerChoice, clickable, changeComputerHand]
  );

  return (
    <div>
      <ImgContainer>
        <img
          src={SRP}
          style={{
            transform: `translateX(${rspX[computerChoice]})`,
            height: "200px",
          }}
        />
      </ImgContainer>
      <div>
        <button
          id="scissors"
          className="btn"
          onClick={() => onClickRsp("scissors")}
        >
          가위
        </button>
        <button id="rock" className="btn" onClick={() => onClickRsp("rock")}>
          바위
        </button>
        <button id="paper" className="btn" onClick={() => onClickRsp("paper")}>
          보
        </button>
      </div>
      <div>{message}</div>
      <div>점수: {score}</div>
    </div>
  );
};

export default RSP;

const ImgContainer = styled.div`
  width: 160px;
  overflow: hidden;
`;
