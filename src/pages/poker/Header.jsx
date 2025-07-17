import styled, { css } from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";

const Header = () => {
  const { remainingTurns, stage, discardChances, scoreDetail } =
    usePokerStore();

  return (
    <HeaderContainer>
      <BoardWrapper>
        <Stage $headerColor="#2ecc71" $divColor="#f39c12">
          <h1>스테이지</h1>
          <div>{stage}</div>
        </Stage>

        <TotalScore $headerColor="#8e44ad" $divColor="#f1c40f">
          <h1>총 점수</h1>
          <div>{scoreDetail?.total || 0}</div>
        </TotalScore>

        <RemainingTurns $headerColor="#3498db" $divColor="#2ecc71">
          <h1>남은 플레이</h1>
          <div>{remainingTurns}</div>
        </RemainingTurns>

        <DiscardChances $headerColor="#e74c3c" $divColor="#ecf0f1">
          <h1>버리기 횟수</h1>
          <div>{discardChances}</div>
        </DiscardChances>
      </BoardWrapper>
    </HeaderContainer>
  );
};

export default Header;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
`;

const BoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  @media (max-width: 600px) {
    gap: 0;
  }
`;

const commonStyle = css`
  display: flex;
  flex-direction: column;
  width: 140px;
  text-align: center;

  @media (max-width: 600px) {
    width: 80px;
  }

  h1 {
    background-color: ${(props) => props.$headerColor};
    color: white;
    padding: 12px;
    font-size: 18px;
    border-radius: 12px 12px 0 0;

    @media (max-width: 600px) {
      width: 80px;
      font-size: 12px;
      padding: 10px;
    }
  }

  div {
    background-color: ${(props) => props.$divColor};
    padding: 16px;
    font-size: 16px;
    color: #333;
    border-radius: 0 0 12px 12px;

    @media (max-width: 600px) {
      width: 80px;
      font-size: 14px;
      padding: 12px;
    }
  }
`;

const Stage = styled.div`
  ${commonStyle}
`;

const TotalScore = styled.div`
  ${commonStyle}
`;

const RemainingTurns = styled.div`
  ${commonStyle}
`;

const DiscardChances = styled.div`
  ${commonStyle}
`;
