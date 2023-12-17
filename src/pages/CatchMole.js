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
    Array.from({ length: 9 }).fill({ type: null, clicked: false, rise: false })
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(2110);

  const generateRandomMoles = useCallback(() => {
    setMoles((prevMoles) => {
      const updatedMoles = [...prevMoles];
      const numberOfAppearances = Math.floor(Math.random() * 4) + 3;

      for (let i = 0; i < numberOfAppearances; i++) {
        const index = Math.floor(Math.random() * 9);
        updatedMoles[index] =
          Math.random() < 0.5
            ? { type: "mole", clicked: false, rise: true }
            : { type: "bomb", clicked: false, rise: true };
      }

      setTimeout(() => {
        setMoles((prevMoles) =>
          prevMoles.map((mole) => (mole.rise ? { ...mole, rise: false } : mole))
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
            rise: false,
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
                rise={mole.rise}
              />
            )}
            {isGameStarted && mole.type === "bomb" && (
              <Bomb
                onClick={() => handleBombClick(index)}
                clicked={mole.clicked}
                rise={mole.rise}
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

const Gopher = styled.div`
  background-image: url(${gopherImg});
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: 0;
  background-size: contain;
  opacity: 1;
  transition: transform 1s ease-in-out;
  transform: translateY(${(props) => (props.rise ? "200px" : "0px")});
  ${(props) =>
    props.clicked &&
    css`
      transform: translateY(200px);
      background-image: url(${deadImg});
    `}
`;

const Bomb = styled(Gopher)`
  background: url(${bombImg}) center center no-repeat;
  ${(props) =>
    props.clicked &&
    css`
      transform: translateY(200px);
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
