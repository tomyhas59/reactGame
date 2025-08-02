import { useState } from "react";
import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";

const JokerPanel = () => {
  const { playerJokers } = usePokerStore();
  const [flippedStates, setFlippedStates] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleFlip = (index) => {
    setFlippedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <JokerPanelContainer>
      <Board>
        {[0, 1, 2, 3, 4].map((index) => (
          <Slot key={index} onClick={() => handleFlip(index)}>
            {playerJokers[index] ? (
              <JokerCardInner className={flippedStates[index] ? "flipped" : ""}>
                <CardFront>
                  <JokerName>{playerJokers[index].name}</JokerName>
                </CardFront>
                <CardBack>
                  <JokerDesc>{playerJokers[index].description}</JokerDesc>
                </CardBack>
              </JokerCardInner>
            ) : (
              <EmptySlot />
            )}
          </Slot>
        ))}
      </Board>
    </JokerPanelContainer>
  );
};

export default JokerPanel;

const JokerPanelContainer = styled.div`
  position: relative;
  margin: 1rem;
  display: flex;
  justify-content: center;
`;

const Board = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.1rem;
`;

const Slot = styled.div`
  width: 120px;
  height: 170px;
  perspective: 1000px;
  cursor: pointer;

  @media (max-width: 1200px) {
    width: 90px;
    height: 120px;
  }
  @media (max-width: 800px) {
    width: 60px;
    height: 90px;
  }
`;

const JokerCardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  border-radius: 12px;

  &.flipped {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #fff8e1, #ffe0b2);
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    background: linear-gradient(135deg, #cdbd89, #ffc56d);
  }
`;

const CardBack = styled(CardFace)`
  background: #fff;
  transform: rotateY(180deg);
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  word-break: keep-all;
  &:hover {
    background: #dbd0d0;
  }
`;

const JokerName = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1rem;
  word-break: keep-all;
  text-align: center;

  @media (max-width: 1200px) {
    font-size: 0.6rem;
  }
  @media (max-width: 1200px) {
    font-size: 0.4em;
  }
`;

const JokerDesc = styled.p`
  font-size: 0.85rem;
  color: #333;
  text-align: center;
  white-space: pre-wrap;
  word-break: keep-all;

  @media (max-width: 1200px) {
    font-size: 0.6rem;
  }

  @media (max-width: 800px) {
    font-size: 0.5rem;
  }
`;

const EmptySlot = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
`;
