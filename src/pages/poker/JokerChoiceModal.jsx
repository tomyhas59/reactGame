import styled from "styled-components";
import {
  usePokerStore,
  DISCARD_CHANCES,
  generateDeck,
  REMAINING_TURNS,
  shuffle,
} from "../../stores/pokerStore";
import { useEffect, useState } from "react";

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
    effect: "fibonacci",
  },
];

const JokerChoiceModal = () => {
  const {
    playerJokers,
    setPlayerJokers,
    setStageScore,
    setRemainingTurns,
    setDeck,
    setHand,
    setScoreDetail,
    setDiscardChances,
    stageScore,
    setIsJokerChoiceOpen,
  } = usePokerStore();
  const [selectedJokerToReplace, setSelectedJokerToReplace] = useState(null);
  const [shownJokers, setShownJokers] = useState([]);

  const remainJokers = JOKER_CARDS.filter(
    (joker) => !playerJokers.some((pj) => pj.id === joker.id)
  );

  const getRandomJokerCards = (cards) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(5, cards.length));
  };

  useEffect(() => {
    const randomJokerCards = getRandomJokerCards(remainJokers);

    if (playerJokers.length >= 5)
      randomJokerCards.push({
        id: "skip",
        name: "선택 안 함",
        description: "이번 턴에는 조커를 바꾸지 않습니다.",
        effect: "none",
      });

    setShownJokers(randomJokerCards);
  }, []);

  const handleNewJokerSelect = (newJoker) => {
    const resetGameState = () => {
      setStageScore(stageScore * 2);
      setRemainingTurns(REMAINING_TURNS);
      setDiscardChances(DISCARD_CHANCES);
      setIsJokerChoiceOpen(false);

      const newDeck = shuffle(generateDeck());
      setHand(newDeck.slice(0, 8));
      setDeck(newDeck.slice(8));
      setScoreDetail(null);
    };
    if (newJoker.id === "skip") {
      resetGameState();
      return;
    }

    if (selectedJokerToReplace)
      alert(
        `${selectedJokerToReplace?.name}를/(을) ${newJoker?.name}로/(으로) 바꿨습니다.`
      );

    if (playerJokers.length < 5) {
      setPlayerJokers([...playerJokers, newJoker]);
    } else {
      const newJokers = playerJokers.map((joker) =>
        joker.id === selectedJokerToReplace.id ? newJoker : joker
      );
      setPlayerJokers(newJokers);
    }
    resetGameState();
  };

  return (
    <Overlay>
      {playerJokers.length >= 5 && (
        <Modal>
          <Header>
            <p>※조커는 5장까지 소지할 수 있습니다.</p>
            <h2>버릴 조커 선택</h2>
          </Header>
          <PlayerJokersWrapper>
            {playerJokers.map((joker, i) => (
              <PlayerJokerSlot
                key={joker.id}
                index={i}
                $isSelected={selectedJokerToReplace?.id === joker.id}
                onClick={() => setSelectedJokerToReplace(joker)}
              >
                <PlayerJokerCardInner
                  className={
                    selectedJokerToReplace?.id === joker.id ? "selected" : ""
                  }
                >
                  <PlayerJokerCardFront>{joker.name}</PlayerJokerCardFront>
                  <PlayerJokerCardBack>{joker.description}</PlayerJokerCardBack>
                </PlayerJokerCardInner>
              </PlayerJokerSlot>
            ))}
          </PlayerJokersWrapper>
        </Modal>
      )}
      <Modal>
        <Header>
          <h2>조커 선택</h2>
        </Header>
        <CardList>
          {shownJokers.map((joker) => (
            <Card key={joker.id} onClick={() => handleNewJokerSelect(joker)}>
              <h3>{joker.name}</h3>
              <p>{joker.description}</p>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  gap: 5px;
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
  align-items: center;
  margin-bottom: 16px;
  p {
    color: crimson;
    font-size: 12px;
  }
  h2 {
    margin: 0;
    font-size: 20px;
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
const PlayerJokersWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 5 / 1.8;
  margin: 0 auto;
`;

const PlayerJokerSlot = styled.div`
  position: absolute;
  top: 0;
  width: calc(100% * 1.4 / 5);
  height: auto;
  aspect-ratio: 0.7 / 1; /* 카드 비율 유지 */
  left: ${({ index }) => `calc((100% / 5) * ${index} * 0.9)`};
  z-index: ${({ index, $isSelected }) => ($isSelected ? 100 : index)};
  cursor: pointer;
  transition: transform 0.2s ease, z-index 0.2s ease;

  &:hover {
    z-index: 999;
    transform: translateY(-10px);
  }
`;

const PlayerJokerCardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid #ddd;
  &.selected {
    background: linear-gradient(135deg, #ffe57f, #ffca28);
    border-color: #f57f17;
    transform: rotateY(180deg);
  }

  &:hover {
    background: linear-gradient(135deg, #cdbd89, #ffc56d);
  }
`;

const PlayerCardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1rem;
  word-break: keep-all;
  text-align: center;
  font-weight: bold;
  @media (max-width: 800px) {
    font-size: 0.4em;
  }
`;

const PlayerJokerCardFront = styled(PlayerCardFace)`
  background: linear-gradient(135deg, #fff8e1, #ffe0b2);
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    background: linear-gradient(135deg, #cdbd89, #ffc56d);
  }
`;

const PlayerJokerCardBack = styled(PlayerCardFace)`
  background: #fff;
  text-align: center;
  transform: rotateY(180deg);
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  word-break: keep-all;

  &:hover {
    background: #dbd0d0;
  }
`;
