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
    const newHand = hand.filter(
      (card) => !selectedCards.find((c) => c.id === card.id)
    );

    setHand(newHand);

    // 현재 deck 배열에서 뽑을 카드들
    const drawnCards = deck.slice(0, selectedCount);
    // 남은 덱
    let remainingDeck = deck.slice(selectedCount);
    // 누적되는 핸드 복사본
    let currentHand = [...newHand];

    drawnCards.forEach((card, i) => {
      setTimeout(() => {
        currentHand = [...currentHand, card];
        setHand(currentHand);

        // 덱에서 카드 하나씩 빼기
        remainingDeck = remainingDeck.slice(1);
        setDeck(remainingDeck);
      }, (i + 1) * 300);
    });

    setTimeout(() => {
      setSelectedCards([]);
    }, selectedCount * 500 + 500);
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
    const discardChances = usePokerStore.getState().discardChances;
    if (discardChances <= 0) return;
    if (selectedCards.length === 0) return alert("버릴 카드를 선택하세요.");

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
