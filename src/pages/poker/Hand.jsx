import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";
import Card from "./Card";

const Hand = ({ addSlotRef }) => {
  const { hand, selectedCards } = usePokerStore();

  return (
    <HandContainer>
      {Array.from({ length: 8 }).map((_, idx) => {
        const card = hand[idx];
        const isSelected = card && selectedCards.some((c) => c.id === card.id);

        return (
          <Card
            key={idx}
            card={card}
            addSlotRef={addSlotRef}
            isSelected={isSelected}
            idx={idx}
          />
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
