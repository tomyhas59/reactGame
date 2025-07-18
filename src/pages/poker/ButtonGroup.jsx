import styled from "styled-components";
import { calculateFinalScore, usePokerStore } from "../../stores/pokerStore";

const ButtonGroup = ({
  isAnimating,
  animateDrawCard,
  setAnimCard,
  setIsAnimating,
}) => {
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

  const drawAndUpdateCard = async () => {
    if (isAnimating) return;
    if (selectedCards.length === 0) {
      alert("카드를 선택하세요");
      return;
    }
    if (deck.length < selectedCards.length) {
      alert("덱에 카드가 부족합니다");
      return;
    }

    setIsAnimating(true);

    // 우선 선택된 카드는 핸드에서 제거
    let newHand = hand.filter((card) => !selectedCards.includes(card));
    setHand(newHand);
    setSelectedCards([]);

    const cardsToDraw = deck.slice(0, selectedCards.length);
    let currentDeck = deck.slice(selectedCards.length);

    for (let i = 0; i < cardsToDraw.length; i++) {
      await animateDrawCard(cardsToDraw[i], newHand.length + i);
      // functional update로 상태 반영: 이전 상태값에 카드 추가
      setHand((prevHand) => [...prevHand, cardsToDraw[i]]);

      currentDeck = currentDeck.slice(1);
      setDeck(currentDeck);

      await new Promise((r) => setTimeout(r, 100));
    }

    setAnimCard(null);
    setIsAnimating(false);
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
