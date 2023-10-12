import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AppLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Link to="/">
        <div className="main">Y의 즐거운 게임 세상</div>
      </Link>
      <br />
      <ul>
        <Link to="baseball">
          <li>숫자 야구게임</li>
        </Link>
        <Link to="calculator">
          <li>계산기</li>
        </Link>
        <Link to="catchMole">
          <li>두더지 잡기</li>
        </Link>
        <Link to="concentration">
          <li>짝 맞추기</li>
        </Link>
        <Link to="findMine">
          <li>지뢰찾기</li>
        </Link>
        <Link to="lotto">
          <li>로또 추첨</li>
        </Link>
        <Link to="make2048">
          <li>2048게임</li>
        </Link>
        <Link to="omok">
          <li>오목</li>
        </Link>
        <Link to="responseCheck">
          <li>반응속도 체크</li>
        </Link>
        <Link to="RSP">
          <li>가위바위보</li>
        </Link>
        <Link to="textRPG">
          <li>텍스트RPG</li>
        </Link>
        <Link to="wordGame">
          <li>쿵쿵따</li>
        </Link>
      </ul>
      <ContentWrapper>{children}</ContentWrapper>
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 1rem;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding-top: 50px;
  overflow-y: auto;
  margin: 0 auto;
`;

export default AppLayout;
