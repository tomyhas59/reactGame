import React, { useState } from "react";
import img1 from "../img/비빔밥.jpg";
import img2 from "../img/불고기.jpg";
import img3 from "../img/김치찌개.jpg";
import img4 from "../img/짜장면.jpg";
import img5 from "../img/탕수육.jpg";
import img6 from "../img/양장피.jpg";
import img7 from "../img/스테이크.jpg";
import img8 from "../img/파스타.jpg";
import img9 from "../img/샐러드.jpg";
import img10 from "../img/초밥.jpg";
import img11 from "../img/우동.jpg";
import img12 from "../img/타코야키.jpg";
import styled from "styled-components";

const Menu = () => {
  const initialMenu = [
    {
      category: "한식",
      items: [
        { name: "비빔밥", image: img1 },
        { name: "불고기", image: img2 },
        { name: "김치찌개", image: img3 },
        { name: "김치찌개", image: img3 },
        { name: "김치찌개", image: img3 },
        { name: "김치찌개", image: img3 },
        { name: "김치찌개", image: img3 },
        { name: "김치찌개", image: img3 },
      ],
    },
    {
      category: "중식",
      items: [
        { name: "짜장면", image: img4 },
        { name: "탕수육", image: img5 },
        { name: "양장피", image: img6 },
      ],
    },
    {
      category: "양식",
      items: [
        { name: "스테이크", image: img7 },
        { name: "파스타", image: img8 },
        { name: "샐러드", image: img9 },
      ],
    },
    {
      category: "일식",
      items: [
        { name: "초밥", image: img10 },
        { name: "우동", image: img11 },
        { name: "타코야키", image: img12 },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    initialMenu[0].category
  );
  const [selectedItems, setSelectedItems] = useState(initialMenu[0].items);
  const [orderedItems, setOrderedItems] = useState([]);

  const handleCategoryClick = (category) => {
    const selectedMenu = initialMenu.find((menu) => menu.category === category);
    setSelectedCategory(category);
    setSelectedItems(selectedMenu.items);
  };

  const handleOrderClick = (itemName) => {
    const selectedItem = selectedItems.find((item) => item.name === itemName);
    setOrderedItems([...orderedItems, selectedItem]);
  };

  return (
    <div>
      <Wrapper>
        <MenuContainer>
          <h1>🍽️ Menu</h1>
          <MenuButtonContainer>
            {initialMenu.map((menu, index) => (
              <CategoryButton
                key={index}
                onClick={() => handleCategoryClick(menu.category)}
              >
                {menu.category}
              </CategoryButton>
            ))}
          </MenuButtonContainer>
          <div>
            <h2>{selectedCategory}</h2>
            <MenuItemList>
              {selectedItems.map((item, index) => (
                <MenuItem key={index}>
                  <img src={item.image} alt={item.name} />
                  <ItemName>{item.name}</ItemName>
                  <OrderButton onClick={() => handleOrderClick(item.name)}>
                    주문하기
                  </OrderButton>
                </MenuItem>
              ))}
            </MenuItemList>
          </div>
        </MenuContainer>
        <OrderList>
          <h1 style={{ textAlign: "center" }}>주문 목록</h1>
          <div style={{ textAlign: "center" }}>
            {orderedItems.map((item, index) => (
              <div key={index}>{item.name}</div>
            ))}
          </div>
        </OrderList>
      </Wrapper>
    </div>
  );
};

export default Menu;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const MenuButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const MenuItemList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const MenuItem = styled.li`
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;

  transition: border 0.3s ease;

  &:hover {
    border: 2px solid #4caf50;
  }

  img {
    width: 200px;
    height: 200px;
    border-radius: 6px;
    object-fit: cover;
    margin-bottom: 10px;
  }
`;

const ItemName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const OrderButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const OrderList = styled.div`
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;
