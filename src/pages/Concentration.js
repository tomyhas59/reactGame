import React, { useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 200px;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  margin: 10px;
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const Front = styled(Card)`
  background-color: blue;
  transform: ${(props) =>
    props.flipped ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const Back = styled(Card)`
  background-color: red;
  transform: ${(props) =>
    props.flipped ? "rotateY(0deg)" : "rotateY(-180deg)"};
`;

function Concentration() {
  const [cards, setCards] = useState(Array(6).fill(false));

  const handleClick = (index) => {
    const updatedCards = [...cards];
    updatedCards[index] = !updatedCards[index];
    setCards(updatedCards);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {cards.map((isFlipped, index) => (
        <CardContainer key={index} onClick={() => handleClick(index)}>
          <Front flipped={isFlipped}>Front</Front>
          <Back flipped={isFlipped}>Back</Back>
        </CardContainer>
      ))}
    </div>
  );
}

export default Concentration;
