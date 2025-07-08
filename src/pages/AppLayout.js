import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(false);

  const links = [
    { to: "baseball", label: "숫자 야구 게임" },
    { to: "calculator", label: "계산기" },
    { to: "catchMole", label: "두더지 잡기" },
    { to: "concentration", label: "카드 뒤집기" },
    { to: "findMine", label: "지뢰찾기" },
    { to: "lotto", label: "로또" },
    { to: "make2048", label: "2048게임" },
    { to: "responseCheck", label: "반응속도체크" },
    { to: "RSP", label: "가위바위보" },
    { to: "textRPG", label: "텍스트RPG" },
    { to: "wordGame", label: "끝말잇기" },
    { to: "gugudan", label: "구구단" },
    { to: "onet", label: "그림 맞추기" },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (window.innerWidth <= 768) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Link to="/">
            <Title>심심풀이</Title>
          </Link>
        </TitleWrapper>
        <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</MenuToggle>
      </Header>
      <ContentContainer>
        <List $isOpen={isMenuOpen} ref={menuRef}>
          {links.map((link, index) => (
            <StyledLink to={link.to} key={index} onClick={handleLinkClick}>
              <LinkItem
                className={location.pathname === `/${link.to}` ? "active" : ""}
              >
                {link.label}
              </LinkItem>
            </StyledLink>
          ))}
        </List>
        <Content>{children}</Content>
      </ContentContainer>
    </Container>
  );
};

export default AppLayout;

const Container = styled.div`
  display: block;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #333;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 999;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  > a {
    text-decoration: none;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
  transition: color 0.3s, text-shadow 0.3s;
  &:hover {
    color: #ff4500;
    text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.7);
  }
`;

const MenuToggle = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

const ContentContainer = styled.div`
  display: flex;
`;

const List = styled.ul`
  background-color: #1f1f1f;
  display: flex;
  flex-direction: column;
  color: #eee;
  width: 170px;
  padding: 10px;
  transition: transform 0.3s ease;
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: -30px;
    z-index: 555;
    font-size: 12px;
    width: 150px;
    height: 100%;
    background-color: #1f1f1f;
    transform: ${(props) =>
      props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const LinkItem = styled.li`
  background-color: #2a2a2a;
  width: 150px;
  color: #ddd;
  font-size: 12px;
  text-align: center;
  list-style: none;
  border: 1px solid #444;
  padding: 5px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #444;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  &.active {
    background-color: #ff5722;
    color: #fff;
  }
  @media (max-width: 768px) {
    padding: 5px;
    width: 100px;
  }
`;

const Content = styled.article`
  width: 100%;
`;
