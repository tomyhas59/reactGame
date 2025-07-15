import { styled } from "styled-components";
import {
  DISCARD_CHANCES,
  generateDeck,
  REMAINING_TURNS,
  shuffle,
  usePokerStore,
} from "../../stores/pokerStore";
import { useCallback, useEffect, useState } from "react";
import Hand from "./Hand";
import DetailScore from "./DetailScore";
import ButtonGroup from "./ButtonGroup";
import RemainDeck from "./RemainDeck";
import Header from "./Header";
import JokerPanel from "./JokerPanel";
import JokerChoiceModal from "./JokerChoiceModal";

export const Poker = () => {
  const {
    startNewGame,
    stage,
    remainingTurns,
    scoreDetail,
    addPlayerJoker,
    setStage,
    setRemainingTurns,
    setDeck,
    setHand,
    setScoreDetail,
    setDiscardChances,
  } = usePokerStore();

  const [isStart, setIsStart] = useState(false);
  const [isJokerChoiceOpen, setIsJokerChoiceOpen] = useState(false);

  const startButton = useCallback(() => {
    setIsStart(true);
    startNewGame();
  }, [startNewGame]);

  const handleJokerSelect = useCallback(
    (joker) => {
      addPlayerJoker(joker);
      setStage(stage * 2);
      setRemainingTurns(REMAINING_TURNS);
      setIsJokerChoiceOpen(false);
      setDiscardChances(DISCARD_CHANCES);
      const newDeck = shuffle(generateDeck());
      setHand(newDeck.slice(0, 8));
      setDeck(newDeck.slice(8));
      setScoreDetail(null);
    },
    [
      setScoreDetail,
      addPlayerJoker,
      setStage,
      setRemainingTurns,
      stage,
      setDeck,
      setDiscardChances,
      setHand,
    ]
  );

  // 스테이지 성공 시 조커 선택 모달 띄우기

  useEffect(() => {
    if (stage <= scoreDetail?.total) {
      setTimeout(() => {
        alert("성공");
        setIsJokerChoiceOpen(true);
      }, 5000);
    }
  }, [stage, scoreDetail]);

  useEffect(() => {
    if (remainingTurns === 0 && scoreDetail?.total != null) {
      setTimeout(() => {
        if (stage > scoreDetail.total) {
          alert("실패");
          startNewGame();
          setIsStart(false);
        } else {
          setIsJokerChoiceOpen(true);
        }
      }, 5000);
    }
  }, [remainingTurns, stage, scoreDetail, startNewGame]);

  if (!isStart) {
    return (
      <Container>
        <StartButton onClick={startButton}>게임 시작</StartButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Middle>
        <DetailScore />
        <JokerPanel />
      </Middle>
      <Bottom>
        <HandSection>
          <Hand />
          <ButtonGroup />
        </HandSection>
        <RemainDeck />
      </Bottom>
      {isJokerChoiceOpen && (
        <JokerChoiceModal
          onSelect={handleJokerSelect}
          onClose={() => setIsJokerChoiceOpen(false)}
        />
      )}
    </Container>
  );
};

export default Poker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    gap: 6px;
    padding: 8px;
  }
`;

const Middle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const HandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  @media (max-width: 600px) {
    gap: 4px;
  }
`;

const StartButton = styled.button`
  padding: 14px 28px;
  margin: 100px auto;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #388e3c;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    width: 50%;
    font-size: 16px;
    padding: 12px 20px;
  }
`;
