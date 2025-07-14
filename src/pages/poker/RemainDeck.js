import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";

const RemainDeck = () => {
  const { deck } = usePokerStore();
  return (
    <RemainDeckContainer>
      {deck.map((_, idx) => (
        <RemainCard key={idx} $index={idx}>
          {deck.length}
        </RemainCard>
      ))}
    </RemainDeckContainer>
  );
};

export default RemainDeck;

const RemainDeckContainer = styled.div`
  position: relative;
  width: 120px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    position: absolute;
    bottom: 5%;
    right: 1%;
    width: 90px;
    height: 110px;
  }
`;

const RemainCard = styled.div`
  position: absolute;
  width: 120px;
  height: 170px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 12px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  border: 1px solid #0d47a1;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transform: ${({ $index }) =>
    `translate(${$index * 0.5}px, ${$index * -0.5}px)`};
  z-index: ${({ $index }) => $index};
  transition: transform 0.2s ease;
  color: #fff;
  text-align: center;
  line-height: 170px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0,
      rgba(255, 255, 255, 0.1) 8px,
      transparent 8px,
      transparent 16px
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  @media (max-width: 600px) {
    width: 50px;
    height: 70px;
    font-size: 14px;
    line-height: 62px;
  }
`;
