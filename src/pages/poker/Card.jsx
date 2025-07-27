import styled from "styled-components";
import { cardPattern, usePokerStore } from "../../stores/pokerStore";
import JCard from "../../img/JCard.png";
import QCard from "../../img/QCard.png";
import KCard from "../../img/KCard.png";

export const getSuitColor = (suit) =>
  suit === "♥️" || suit === "♦️" ? "red" : "black";

export const getCardLabel = (num) => {
  if (num === 1) return "A";
  if (num === 11) return "J";
  if (num === 12) return "Q";
  if (num === 13) return "K";
  return num;
};

const JQKImage = (number) => {
  if (number === 11) return JCard;
  else if (number === 12) return QCard;
  else if (number === 13) return KCard;
  return null;
};

const Card = ({ card, addSlotRef, isSelected = false, idx }) => {
  const { toggleSelectCards, showPlayCards } = usePokerStore();

  return (
    <CardContainer
      key={idx}
      selected={isSelected}
      onClick={() => card && !showPlayCards && toggleSelectCards(card)}
      ref={(el) => addSlotRef?.(el)}
    >
      {card && (
        <>
          <TopRight $suitColor={getSuitColor(card.suit)}>
            {getCardLabel(card.number)}
            <span>{card.suit}</span>
          </TopRight>
          {card.number >= 11 ? (
            <JQKArt $number={card.number} />
          ) : (
            <SuitGrid>
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 3 }).map((_, col) => {
                  const match = cardPattern[card.number]?.some(
                    ([r, c]) => r === row && c === col
                  );
                  return (
                    <Pip
                      key={`${row}-${col}`}
                      $suitColor={getSuitColor(card.suit)}
                    >
                      {match ? card.suit : ""}
                    </Pip>
                  );
                })
              )}
            </SuitGrid>
          )}
          <BottomLeft $suitColor={getSuitColor(card.suit)}>
            {getCardLabel(card.number)}
            <span style={{ fontSize: "8px" }}>{card.suit}</span>
          </BottomLeft>
        </>
      )}
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  position: relative;
  width: 120px;
  height: 170px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  border: 2px solid ${({ selected }) => (selected ? "blue" : "gray")};
  background-color: ${({ selected }) => (selected ? "#d0eaff" : "white")};
  transition: all 0.2s ease-in-out;

  transform: ${({ selected }) =>
    selected ? "translateY(-10px)" : "translateY(0)"};

  &:hover {
    background-color: silver;
  }

  @media (max-width: 1200px) {
    width: 90px;
    height: 120px;
  }

  @media (max-width: 800px) {
    width: 70px;
    height: 100px;
  }
`;

const TopRight = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${({ $suitColor }) => $suitColor};
  text-align: right;
  span {
    font-size: 10px;
    @media (max-width: 800px) {
      font-size: 7px;
    }
  }
  @media (max-width: 1200px) {
    font-size: 7px;
  }
`;

const BottomLeft = styled(TopRight)`
  text-align: left;
`;

const SuitGrid = styled.div`
  display: grid;
  position: absolute;
  top: 20%;
  left: 25%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  flex-grow: 1;
  align-items: center;
  justify-items: center;
`;

const Pip = styled.span`
  font-size: 15px;
  color: ${({ $suitColor }) => $suitColor};

  @media (max-width: 1200px) {
    font-size: 10px;
  }

  @media (max-width: 800px) {
    font-size: 8px;
  }
`;

const JQKArt = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-image: url(${({ $number }) => JQKImage($number)});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
`;
