import React, { useState, useEffect } from "react";
import gopherImg from "../gopher.png";
import moleHoleImg from "../mole-hole.png";

const Mole = ({ active, onClick }) => {
  const moleStyle = {
    width: "150px",
    height: "150px",
    cursor: "pointer",
  };

  return (
    <img
      src={active ? gopherImg : moleHoleImg}
      alt="img"
      style={moleStyle}
      onClick={onClick}
    ></img>
  );
};

const Game = () => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);

  useEffect(() => {
    const moleInterval = setInterval(() => {
      const numMolesToShow = Math.floor(Math.random() * 2) + 3;
      const moleIndices = [];

      while (moleIndices.length < numMolesToShow) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!moleIndices.includes(randomIndex)) {
          moleIndices.push(randomIndex);
        }
      }

      setMoles((prevMoles) =>
        prevMoles.map((mole, index) =>
          moleIndices.includes(index) ? true : mole
        )
      );

      setTimeout(() => {
        setMoles((prevMoles) =>
          prevMoles.map((mole, index) =>
            moleIndices.includes(index) ? false : mole
          )
        );
      }, 1000);
    }, 1000);

    return () => clearInterval(moleInterval);
  }, []);

  const handleWhack = (index) => {
    if (!moles[index]) return;
    setMoles((prevMoles) =>
      prevMoles.map((mole, moleIndex) => (moleIndex === index ? !mole : mole))
    );

    if (moles[index]) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const scoreStyle = {
    fontSize: "24px",
    marginBottom: "20px",
  };

  const molesContainerStyle = {
    width: "500px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gap: "100px",
  };

  return (
    <div>
      <div style={scoreStyle}>Score: {score}</div>
      <div style={molesContainerStyle}>
        {moles.map((mole, index) => (
          <Mole key={index} active={mole} onClick={() => handleWhack(index)} />
        ))}
      </div>
    </div>
  );
};

export default Game;
