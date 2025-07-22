import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";

export const JOKER_CARDS = [
  {
    id: "1",
    name: "스트레이트 x4",
    description: "스트레이트 족보일 때 배수 +4",
    effect: "straight-x4",
  },
  {
    id: "2",
    name: "이지 플러시",
    description:
      "다이아, 하트를 같은 문양 취급, 클로버, 스페이드를 같은 문양 취급",
    effect: "easy-flush",
  },
  {
    id: "3",
    name: "짝수 +50",
    description: "2,4,6,8,10 카드마다 +50",
    effect: "even+50",
  },
  {
    id: "4",
    name: "그림 +100",
    description: "J, Q, K 카드마다 +100",
    effect: "face+100",
  },
  {
    id: "5",
    name: "올그림",
    description: "모든 카드를 그림 카드 취급",
    effect: "all-face",
  },
  {
    id: "6",
    name: "스몰카드",
    description: "3장 이하의 카드 시 배수+3",
    effect: "small-card",
  },
  {
    id: "7",
    name: "피보나치",
    description: "1, 2, 3, 5, 8 카드마다 +50",
    effect: "Fibonacci",
  },
];

const JokerChoiceModal = ({ onSelect, onClose }) => {
  const { playerJokers } = usePokerStore();

  const remainJokers = JOKER_CARDS.filter(
    (joker) => !playerJokers.some((pj) => pj.id === joker.id)
  );

  const getRandomJokerCards = (cards, count) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const shownJokers = getRandomJokerCards(
    remainJokers,
    Math.min(5, remainJokers.length)
  );

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>조커 선택</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <CardList>
          {shownJokers.map((card) => (
            <Card key={card.id} onClick={() => onSelect(card)}>
              <h3>{card.name}</h3>
              <p>{card.description}</p>
            </Card>
          ))}
        </CardList>
      </Modal>
    </Overlay>
  );
};

export default JokerChoiceModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background-color: #fff;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;

  &:hover {
    color: #333;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const Card = styled.div`
  flex: 1 150px;

  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  text-align: center;
  background-color: #fafafa;
  transition: transform 0.2s, box-shadow 0.2s;

  h3 {
    margin: 8px 0;
    font-size: 18px;
    color: #1565c0;
  }

  p {
    font-size: 14px;
    color: #555;
    word-break: keep-all;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;
