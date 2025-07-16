import { useState, useEffect, useCallback } from "react";
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

  // 로컬 스토리지에서 상위 3개 점수 불러오기
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

  const handleClick = (index, type) => {
    if (moles[index].clicked) return;
    const updatedMoles = [...moles];
    updatedMoles[index] = { ...updatedMoles[index], clicked: true };
    setMoles(updatedMoles);

    if (type === "mole") setScore((s) => s + 1);
    else if (type === "YMole") setScore((s) => s + 10);
    else if (type === "bomb") setLives((l) => l - 1);
  };

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
    setScore(0);
    setLives(3);
    setTime(20);
    setMoles(Array.from({ length: 9 }).fill({ type: null, clicked: false }));
    setIsGameStarted(true);
  };

  useEffect(() => {
    if (!isGameStarted) return;
    if (lives > 0 && time > 0) return;
    setIsGameStarted(false);

    setTimeout(() => {
      alert(`게임 오버! 점수는 ${score}점`);
      setTopScores((prevTopScores) => {
        const newScores = Array.from(new Set([...prevTopScores, score]))
          .sort((a, b) => b - a)
          .slice(0, 3);
        localStorage.setItem("topScores", JSON.stringify(newScores));
        return newScores;
      });
      setLives(3);
      setScore(0);
      setTime(20);
      setIsGameStarted(false);
    }, 50);
  }, [lives, score, time, isGameStarted]);

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
              onClick={() => handleClick(index, "mole")}
              clicked={!!mole.clicked}
              type={mole.type}
            />
            <Bomb
              onClick={() => handleClick(index, "bomb")}
              clicked={!!mole.clicked}
              type={mole.type}
            />
            <YMole
              onClick={() => handleClick(index, "YMole")}
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
  @media (max-width: 950px) {
    margin-top: -150px;
    transform: scale(0.5);
  }
`;

const HoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  gap: 20px;
  @media (max-width: 950px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Cell = styled.div`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
`;

const BaseMoleStyle = css`
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: -200px;
  background-size: cover;
  opacity: 1;
  transition: bottom 1s ease-in-out;
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
`;

const Hole = styled.div`
  width: 200px;
  height: 150px;
  position: absolute;
  bottom: 0;
  background: url(${moleHoleImg}) center center no-repeat;
  background-size: 200px 150px;
  cursor: pointer;
`;

const HoleFront = styled.div`
  width: 200px;
  height: 30px;
  position: absolute;
  bottom: 0;
  background: url(${moleHoleFrontImg}) center center no-repeat;
  background-size: 200px 30px;
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
