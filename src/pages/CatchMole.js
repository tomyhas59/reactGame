import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import gopherImg from "../gopher.png";
import bombImg from "../bomb.png";
import moleHoleImg from "../mole-hole.png";
import moleHoleFrontImg from "../mole-hole-front.png";
import deadImg from "../dead_gopher.png";

const CatchMole = () => {
  const [moles, setMoles] = useState(
    Array.from({ length: 9 }).fill({ type: null, clicked: false })
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const generateRandomMoles = useCallback(() => {
    const updatedMoles = [...moles];
    const numberOfAppearances = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numberOfAppearances; i++) {
      const index = Math.floor(Math.random() * 9);
      updatedMoles[index] =
        Math.random() < 0.5
          ? { type: "mole", clicked: false }
          : { type: "bomb", clicked: false };
    }
    setMoles(updatedMoles);
  }, [moles]);

  const handleMoleClick = (index) => {
    if (moles[index].clicked) {
      return;
    }
    const updatedMoles = [...moles];
    updatedMoles[index] = { ...updatedMoles[index], clicked: true };
    setMoles(updatedMoles);

    setScore((prevScore) => prevScore + 1);

    setTimeout(() => {
      const resetMoles = [...moles];
      resetMoles[index] = { ...resetMoles[index], clicked: false };
      setMoles(resetMoles);
    }, 1000);
  };

  const handleBombClick = () => {
    setLives((prevLives) => prevLives - 1);
  };

  useEffect(() => {
    let intervalId;
    if (isGameStarted) {
      intervalId = setInterval(() => {
        generateRandomMoles();
        setTimeout(() => {
          const resetMoles = moles.map((mole) =>
            mole.type ? { ...mole, clicked: false } : mole
          );
          setMoles(resetMoles);
        }, 2000);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [generateRandomMoles, isGameStarted, moles]);

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <>
      {!isGameStarted && (
        <StartButton onClick={startGame}>Start Game</StartButton>
      )}
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
              <Bomb onClick={handleBombClick} />
            )}
            <HoleFront></HoleFront>
          </Cell>
        ))}
      </HoleGrid>
      <div>
        Lives: {lives} | Score: {score}
      </div>
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

const riseAnimation = keyframes`
  from {
    bottom: -200px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
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
  width: 200px;
  height: 200px;
  bottom: ${(props) => (props.clicked ? "0" : "-200px")};
  position: absolute;
  animation: ${(props) =>
    props.clicked
      ? css`
          ${fallAnimation} 1s ease-in-out forwards
        `
      : css`
          ${riseAnimation} 1s ease-in-out forwards
        `};
  background-image: url(${gopherImg});
  background-size: contain;
  transform-origin: bottom;
  opacity: 1;
  ${(props) =>
    props.clicked &&
    css`
      background-image: url(${deadImg});
    `}
`;

const Bomb = styled(Gopher)`
  background: url(${bombImg}) center center no-repeat;
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
