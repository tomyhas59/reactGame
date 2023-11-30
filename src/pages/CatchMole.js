import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import gopherImg from "../gopher.png";
import bombImg from "../bomb.png";
import moleHoleImg from "../mole-hole.png";
import moleHoleFrontImg from "../mole-hole-front.png";
import deadImg from "../dead_gopher.png";
import explodeImg from "../explode.png";

const CatchMole = () => {
  const [moles, setMoles] = useState(
    Array.from({ length: 9 }).fill({ type: null, clicked: false })
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(8);

  const generateRandomMoles = useCallback(() => {
    setMoles((prevMoles) => {
      const updatedMoles = [...prevMoles];
      const numberOfAppearances = Math.floor(Math.random() * 5) + 2;

      for (let i = 0; i < numberOfAppearances; i++) {
        const index = Math.floor(Math.random() * 9);
        updatedMoles[index] =
          Math.random() < 0.5
            ? { type: "mole", clicked: false }
            : { type: "bomb", clicked: false };
      }
      return updatedMoles;
    });
  }, []);

  const handleMoleClick = (index) => {
    if (moles[index].clicked) {
      return;
    }
    const updatedMoles = [...moles];
    updatedMoles[index] = { ...updatedMoles[index], clicked: true };
    setMoles(updatedMoles);

    setScore((prevScore) => prevScore + 1);
  };

  const handleBombClick = (index) => {
    if (moles[index].clicked) {
      return;
    }
    const updatedMoles = [...moles];
    updatedMoles[index] = { ...updatedMoles[index], clicked: true };
    setMoles(updatedMoles);
    setLives((prevLives) => prevLives - 1);
  };

  useEffect(() => {
    if (isGameStarted) {
      const intervalId = setInterval(() => {
        generateRandomMoles();
      }, 1000);
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
        setLives(3);
        setScore(0);
        setTime(8);
        setIsGameStarted(false);
        setMoles(
          Array.from({ length: 9 }).fill({ type: null, clicked: false })
        );
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
  }, [isGameStarted, score, time]);

  return (
    <>
      {!isGameStarted && (
        <StartButton onClick={startGame}>Start Game</StartButton>
      )}
      <div>
        Lives: {lives} | Score: {score} | Time:{time.toFixed(1)}
      </div>
      <HoleGrid>
        {moles.map((mole, index) => (
          <Cell key={index}>
            <Hole></Hole>
            {isGameStarted && mole.type === "mole" && (
              <Gopher
                onClick={() => handleMoleClick(index)}
                clicked={mole.clicked}
              />
            )}
            {isGameStarted && mole.type === "bomb" && (
              <Bomb
                onClick={() => handleBombClick(index)}
                clicked={mole.clicked}
              />
            )}
            <HoleFront></HoleFront>
          </Cell>
        ))}
      </HoleGrid>
    </>
  );
};

export default CatchMole;

const HoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 100px;
  row-gap: 50px;
  justify-content: center;
`;

const Cell = styled.div`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
`;

const basicAnimation = keyframes`
  0% {
    bottom: -200px;
  }
 50% {
    bottom: 0;
  }
  100% {
    bottom: -200px;
  }
`;

const fallAnimation = keyframes`
  from {
    bottom: 0;
    opacity: 1;
  }
  to {
    bottom: -200px;
    opacity: 0;
  }
`;

const Gopher = styled.div`
  background-image: url(${gopherImg});
  width: 200px;
  height: 200px;
  bottom: -200px;
  position: absolute;
  animation: ${basicAnimation} 2s ease-in-out forwards;
  background-size: contain;
  transform-origin: bottom;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  ${(props) =>
    props.clicked &&
    css`
      animation: ${fallAnimation} 1s ease-in-out forwards;
      background-image: url(${deadImg});
    `}
`;

const Bomb = styled(Gopher)`
  background: url(${bombImg}) center center no-repeat;
  ${(props) =>
    props.clicked &&
    css`
      animation: ${fallAnimation} 1s ease-in-out forwards;
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
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
