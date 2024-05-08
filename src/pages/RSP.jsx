import React, { useCallback, useEffect, useRef, useState } from "react";
import SRP from "../img/rsp.png";
import styled from "styled-components";

const RSP = () => {
  const [computerChoice, setComputerChoice] = useState("가위");
  const rspX = {
    가위: "0",
    바위: "-220px",
    보: "-440px",
  };
  const rspXKeys = Object.keys(rspX);

  const [score, setScore] = useState(0);
  const [clickable, setClickable] = useState(true);
  const [message, setMessage] = useState("");
  const intervalId = useRef(null);

  const changeComputerHand = useCallback(() => {
    if (computerChoice === "가위") {
      setComputerChoice("바위");
    } else if (computerChoice === "바위") {
      setComputerChoice("보");
    } else if (computerChoice === "보") {
      setComputerChoice("가위");
    }
  }, [computerChoice, setComputerChoice]);

  useEffect(() => {
    intervalId.current = setInterval(changeComputerHand, 50);
    return () => {
      clearInterval(intervalId.current);
    };
  }, [computerChoice, changeComputerHand, intervalId]);

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
          (props === "가위" && computerChoice === "보") ||
          (props === "바위" && computerChoice === "가위") ||
          (props === "보" && computerChoice === "바위")
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
    [clickable, intervalId, computerChoice, changeComputerHand]
  );

  return (
    <Container>
      <ImgContainer>
        <img
          src={SRP}
          style={{
            transform: `translateX(${rspX[computerChoice]})`,
            height: "200px",
          }}
          alt="SRP"
        />
      </ImgContainer>
      <ButtonContainer>
        {rspXKeys.map((item) => (
          <Button key={item} onClick={() => onClickRsp(item)}>
            {item}
          </Button>
        ))}
      </ButtonContainer>
      <Message>{message}</Message>
      <Score>점수: {score}</Score>
    </Container>
  );
};

export default RSP;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgContainer = styled.div`
  width: 160px;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #45a049;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

const Score = styled.div`
  margin-top: 10px;
  font-size: 18px;
`;
