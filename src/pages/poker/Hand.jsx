import styled from "styled-components";
import { cardPattern, usePokerStore } from "../../stores/pokerStore";

export const getSuitColor = (suit) =>
  suit === "♥️" || suit === "♦️" ? "red" : "black";

export const getCardLabel = (num) => {
  if (num === 1) return "A";
  if (num === 11) return "J";
  if (num === 12) return "Q";
  if (num === 13) return "K";
  return num;
};

const Hand = ({ addSlotRef }) => {
  const { hand, selectedCards, toggleSelectCards } = usePokerStore();

  return (
    <HandContainer>
      {Array.from({ length: 8 }).map((_, idx) => {
        const card = hand[idx];
        const isSelected = card && selectedCards.some((c) => c.id === card.id);

        return (
          <Card
            key={idx}
            selected={isSelected}
            onClick={() => card && toggleSelectCards(card)}
            ref={(el) => addSlotRef(el)}
          >
            {card && (
              <>
                <TopRight $suitColor={getSuitColor(card.suit)}>
                  {getCardLabel(card.number)}
                  <span>{card.suit}</span>
                </TopRight>
                {card.number >= 11 ? (
                  <JQKArt>
                    <Crown>👑</Crown>
                  </JQKArt>
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
          </Card>
        );
      })}
    </HandContainer>
  );
};

export default Hand;

const HandContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 120px);
  gap: 4px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(8, 90px);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(4, 70px);
    grid-template-rows: repeat(2, 100px);
  }
`;

const Card = styled.div`
  position: relative;
  width: 120px;
  height: 170px;
  background: white;
  border-radius: 12px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Crown = styled.div`
  font-size: 60px;

  @media (max-width: 1200px) {
    font-size: 30px;
  }
`;
