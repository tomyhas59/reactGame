import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";
import back from "../../img/back.png";
const RemainDeck = ({ deckRef }) => {
  const { deck } = usePokerStore();

  return (
    <RemainDeckContainer ref={deckRef}>
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
  display: flex;
  width: 120px;
  height: 170px;
  align-items: center;
  justify-content: center;
  @media (max-width: 1200px) {
    width: 70px;
    height: 100px;
  }

  @media (max-width: 800px) {
    width: 50px;
    height: 70px;
  }
`;

const RemainCard = styled.div`
  position: absolute;
  width: 120px;
  height: 170px;
  border-radius: 8px;
  background-image: url(${back});
  background-size: cover;
  background-position: center;
  border: 2px solid #ffffff55;
  transform: ${({ $index }) =>
    `translate(${$index * 0.4}px, ${$index * -0.4}px)`};
  z-index: ${({ $index }) => $index};
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  text-shadow: -1px -1px 0 black, -1px 1px 0 black, 1px -1px 0 black,
    1px 1px 0 black;

  @media (max-width: 1200px) {
    width: 70px;
    height: 100px;
    font-size: 24px;
  }

  @media (max-width: 800px) {
    width: 50px;
    height: 70px;
    font-size: 18px;
    transform: ${({ $index }) =>
      `translate(${$index * 0.2}px, ${$index * -0.2}px)`};
    z-index: ${({ $index }) => $index};
  }
`;
