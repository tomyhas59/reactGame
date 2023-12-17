import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AppLayout = ({ children }) => {
  const links = [
    { to: "baseball", label: "숫자 야구 게임" },
    { to: "calculator", label: "계산기" },
    { to: "catchMole", label: "두더지 잡기" },
    { to: "concentration", label: "카드 뒤집기" },
    { to: "findMine", label: "지뢰찾기" },
    { to: "lotto", label: "로또" },
    { to: "make2048", label: "2048게임" },
    { to: "omok", label: "오목" },
    { to: "responseCheck", label: "반응속도체크" },
    { to: "RSP", label: "가위바위보" },
    { to: "textRPG", label: "텍스트RPG" },
    { to: "wordGame", label: "끝말잇기" },
    { to: "gugudan", label: "구구단" },
  ];

  return (
    <LayoutWrapper>
      <Link to="/">
        <Main>Y의 즐거운 게임 세상</Main>
      </Link>
      <br />
      <ul>
        {links.map((link, index) => (
          <Link to={link.to} key={index}>
            <li>{link.label}</li>
          </Link>
        ))}
      </ul>
      <ContentWrapper>{children}</ContentWrapper>
    </LayoutWrapper>
  );
};

export default AppLayout;

const Main = styled.div`
  width: 1000px;
  margin: 0 auto;
  color: green;
  text-shadow: 5px 5px yellowgreen;
  font-size: 100px;
  &:hover {
    color: yellowgreen;
    text-shadow: 5px 5px green;
  }
`;

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
