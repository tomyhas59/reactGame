import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import moleImg from "../img/mole.png";
import deadYMoleImg from "../img/deadYMole.png";
import YMoleImg from "../img/YMole.png";
import bombImg from "../img/bomb.png";
import moleHoleImg from "../img/mole-hole.png";
import moleHoleFrontImg from "../img/mole-hole-front.png";
import deadMoleImg from "../img/deadMole.png";
import explodeImg from "../img/explode.png";

const CatchMole = () => {
  const [moles, setMoles] = useState(
    Array.from({ length: 9 }).fill({ type: null, clicked: false })
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [topScores, setTopScores] = useState([]);

  // 로컬 스토리지에서 상위 5개 점수 불러오기
  useEffect(() => {
    const savedTopScores = JSON.parse(localStorage.getItem("topScores")) || [];
    setTopScores(savedTopScores);
  }, []);

  //두더지 랜덤 등장
  const generateRandomMoles = useCallback(() => {
    setMoles((prevMoles) => {
      const updatedMoles = [...prevMoles];
      const numberOfAppearances = Math.floor(Math.random() * 3 + 4);

      for (let i = 0; i < numberOfAppearances; i++) {
        const index = Math.floor(Math.random() * 9);
        updatedMoles[index] =
          Math.random() < 0.5
            ? { type: "mole", clicked: false }
            : Math.random() < 0.1
            ? { type: "YMole", clicked: false }
            : { type: "bomb", clicked: false };
      }

      setTimeout(() => {
        setMoles((prevMoles) =>
          prevMoles.map((mole) => (mole.type ? { ...mole, type: null } : mole))
        );
      }, 1000);

      return updatedMoles;
    });
  }, []);

  //클릭 이벤트---------------------------------------
  const handleMoleClick = useCallback(
    (index) => {
      if (moles[index].clicked) {
        return;
      }
      const updatedMoles = [...moles];
      updatedMoles[index] = {
        ...updatedMoles[index],
        clicked: true,
        rise: false,
      };
      setMoles(updatedMoles);
      setScore((prevScore) => prevScore + 1);
    },
    [moles]
  );

  const handleBombClick = useCallback(
    (index) => {
      if (moles[index].clicked) {
        return;
      }
      const updatedMoles = [...moles];
      updatedMoles[index] = {
        ...updatedMoles[index],
        clicked: true,
        rise: false,
      };
      setMoles(updatedMoles);
      setLives((prevLives) => prevLives - 1);
    },
    [moles]
  );

  const handleYMoleClick = useCallback(
    (index) => {
      if (moles[index].clicked) {
        return;
      }
      const updatedMoles = [...moles];
      updatedMoles[index] = {
        ...updatedMoles[index],
        clicked: true,
        rise: false,
      };
      setMoles(updatedMoles);
      setScore((prevScore) => prevScore + 10);
    },
    [moles]
  );
  //--------------------------------------------------------------
  useEffect(() => {
    if (isGameStarted) {
      const intervalId = setInterval(generateRandomMoles, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [generateRandomMoles, isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
  };

  useEffect(() => {
    if (lives === 0 || time === 0) {
      setTimeout(() => {
        alert(`게임 오버! 점수는 ${score}점`);
        setTopScores((prevTopScores) => {
          const newScores = [...prevTopScores, score]
            .sort((a, b) => b - a)
            .slice(0, 5);
          localStorage.setItem("topScores", JSON.stringify(newScores));
          return newScores;
        });
        setLives(3);
        setScore(0);
        setTime(20);
        setIsGameStarted(false);
      }, 50);
    }
  }, [lives, score, time]);

  useEffect(() => {
    if (isGameStarted) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0.1) {
            clearInterval(intervalId);
            return 0;
          }
          return prevTime - 0.1;
        });
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isGameStarted, time]);

  return (
    <Container>
      <div>
        {!isGameStarted && (
          <StartButton onClick={startGame} style={{ cursor: "pointer" }}>
            Start Game
          </StartButton>
        )}
        <InfoSpan>
          Lives: {lives} | Score: {score} | Time:{time.toFixed(1)}
        </InfoSpan>
      </div>
      <div>
        {topScores.map((v, i) => (
          <div key={i}>{`${i + 1}위 : ${v}점`}</div>
        ))}
      </div>
      <HoleGrid>
        {moles.map((mole, index) => (
          <Cell key={index}>
            <Hole></Hole>
            <Mole
              onClick={() => handleMoleClick(index)}
              clicked={!!mole.clicked}
              type={mole.type}
            />
            <Bomb
              onClick={() => handleBombClick(index)}
              clicked={!!mole.clicked}
              type={mole.type}
            />
            <YMole
              onClick={() => handleYMoleClick(index)}
              clicked={!!mole.clicked}
              type={mole.type}
            />
            <HoleFront></HoleFront>
          </Cell>
        ))}
      </HoleGrid>
    </Container>
  );
};

export default CatchMole;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const HoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  gap: 20px;
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Cell = styled.div`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  @media (max-width: 950px) {
    width: 100px;
    height: 100px;
  }
`;

const BaseMoleStyle = css`
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: -200px;
  background-size: cover;
  opacity: 1;
  transition: bottom 1s ease-in-out;
  @media (max-width: 950px) {
    width: 100px;
    height: 100px;
  }
`;

const Mole = styled.div`
  ${BaseMoleStyle}
  background-image: url(${moleImg});
  ${(props) =>
    props.type === "mole" &&
    css`
      bottom: 0;
    `}
  ${(props) =>
    props.clicked &&
    css`
      bottom: -200px;
      background-image: url(${deadMoleImg});
    `}
`;

const YMole = styled.div`
  ${BaseMoleStyle}
  background-image: url(${YMoleImg});
  ${(props) =>
    props.type === "YMole" &&
    css`
      bottom: 0;
    `}
  ${(props) =>
    props.clicked &&
    css`
      bottom: -200px;
      background-image: url(${deadYMoleImg});
    `}
`;

const Bomb = styled.div`
  ${BaseMoleStyle}
  background: url(${bombImg}) center no-repeat;
  ${(props) =>
    props.type === "bomb" &&
    css`
      bottom: 0;
    `}
  ${(props) =>
    props.clicked &&
    css`
      bottom: -200px;
      background-image: url(${explodeImg});
    `}
   @media (max-width: 950px) {
    background-size: 100px 100px;
  }
`;

const Hole = styled.div`
  width: 200px;
  height: 150px;
  position: absolute;
  bottom: 0;
  background: url(${moleHoleImg}) center center no-repeat;
  background-size: 200px 150px;
  cursor: pointer;
  @media (max-width: 950px) {
    width: 100px;
    height: 75px;
  }
`;

const HoleFront = styled.div`
  width: 200px;
  height: 30px;
  position: absolute;
  bottom: 0;
  background: url(${moleHoleFrontImg}) center center no-repeat;
  background-size: 200px 30px;
  @media (max-width: 950px) {
    width: 100px;
    height: 15px;
  }
`;

const StartButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: url("../img/hammer.png"), auto;

  &:hover {
    background-color: #45a049;
  }
`;

const InfoSpan = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

Mole.shouldForwardProp = (prop) => prop !== "clicked";
YMole.shouldForwardProp = (prop) => prop !== "clicked";
Bomb.shouldForwardProp = (prop) => prop !== "clicked";
