import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";

const JokerPanel = () => {
  const { playerJokers } = usePokerStore();

  return (
    <JokerPanelContainer>
      <Board>
        {[0, 1, 2, 3, 4].map((index) => (
          <Slot key={index}>
            {playerJokers[index] ? (
              <JokerCard>
                <h3>{playerJokers[index].name}</h3>
                <p>{playerJokers[index].desc}</p>
              </JokerCard>
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 12px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const Board = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px;
  background-color: #f8f8f8;
  border: 2px solid #ccc;
  border-radius: 16px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Slot = styled.div`
  width: 120px;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    width: 50px;
    height: 80px;
  }
`;

const JokerCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  h3 {
    margin: 8px 0;
    font-size: 18px;
    color: #333;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  p {
    font-size: 14px;
    color: #666;
    text-align: center;

    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
`;

const EmptySlot = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 2px dashed #bbb;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
  text-align: center;
  padding: 8px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
