import styled from "styled-components";
import { calculateFinalScore, usePokerStore } from "../../stores/pokerStore";

const ButtonGroup = () => {
  const {
    deck,
    hand,
    selectedCards,
    setDeck,
    setHand,
    setScoreDetail,
    setSelectedCards,
    playerJokers,
    setRemainingTurns,
    setDiscardChances,
  } = usePokerStore();

  const drawAndUpdateCard = () => {
    const selectedCount = selectedCards.length;

    //선택된 카드 hand에서 제거
    const newHand = hand.filter(
      (card) => !selectedCards.find((c) => c.id === card.id)
    );

    setHand(newHand);

    const drawnCards = deck.slice(0, selectedCount);
    const remainingDeck = deck.slice(selectedCount);
    const updatedHand = [...newHand, ...drawnCards];

    setTimeout(() => {
      setHand(updatedHand);
    }, 1000);
    setDeck(remainingDeck);

    setSelectedCards([]);
  };

  //플레이
  const onPlay = () => {
    if (selectedCards.length === 0) return alert("플레이할 카드를 선택하세요.");

    const remainingTurns = usePokerStore.getState().remainingTurns;

    if (remainingTurns <= 0) return;

    drawAndUpdateCard();
    const resultScore = calculateFinalScore(selectedCards, playerJokers);
    setScoreDetail(resultScore);

    setRemainingTurns((prev) => prev - 1);
  };

  // 버리기
  const onDiscard = () => {
    if (selectedCards.length === 0) return alert("버릴 카드를 선택하세요.");

    const discardChances = usePokerStore.getState().discardChances;

    if (discardChances <= 0) return;

    drawAndUpdateCard();
    setDiscardChances((prev) => prev - 1);
  };

  return (
    <ButtonGroupContainer>
      <button onClick={onPlay}>플레이</button>
      <button onClick={onDiscard}>버리기</button>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;

const ButtonGroupContainer = styled.div`
  display: flex;
  gap: 12px;

  button {
    flex: 1 1 auto;
    min-width: 120px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 6px;
    border: none;
    background-color: #4caf50;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #45a049;
    }
  }

  @media (max-width: 600px) {
    button {
      flex: 1 1 100%;
      font-size: 14px;
      padding: 10px;
    }
  }
`;
