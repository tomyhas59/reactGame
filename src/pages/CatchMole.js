import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
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
  const [time, setTime] = useState(20);

  const generateRandomMoles = useCallback(() => {
    setMoles((prevMoles) => {
      const updatedMoles = [...prevMoles];
      const numberOfAppearances = Math.floor(Math.random() * 3 + 4);

      for (let i = 0; i < numberOfAppearances; i++) {
        const index = Math.floor(Math.random() * 9);
        updatedMoles[index] =
          Math.random() < 0.5
            ? { type: "mole", clicked: false }
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
        setLives(3);
        setScore(0);
        setTime(20);
        setIsGameStarted(false);
        setMoles(
          Array.from({ length: 9 }).fill({
            type: null,
            clicked: false,
          })
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
  }, [isGameStarted, time]);

  return (
    <>
      <div>
        {!isGameStarted && (
          <StartButton onClick={startGame}>Start Game</StartButton>
        )}
        <span>
          Lives: {lives} | Score: {score} | Time:{time.toFixed(1)}
        </span>
      </div>
      <HoleGrid>
        {moles.map((mole, index) => (
          <Cell key={index}>
            <Hole></Hole>
            <Gopher
              onClick={() => handleMoleClick(index)}
              clicked={mole.clicked}
              type={mole.type}
            />
            <Bomb
              onClick={() => handleBombClick(index)}
              clicked={mole.clicked}
              type={mole.type}
            />

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
  column-gap: 50px;
  row-gap: 20px;
  justify-content: center;
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
  background-size: contain;
  opacity: 1;
  transition: bottom 1s ease-in-out;
`;

const Gopher = styled.div`
  ${BaseMoleStyle}
  background-image: url(${gopherImg});
  ${(props) =>
    props.type === "mole" &&
    css`
      bottom: 0;
    `}
  ${(props) =>
    props.clicked &&
    css`
      bottom: -200px;
      background-image: url(${deadImg});
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
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
