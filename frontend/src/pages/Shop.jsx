import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const Shop = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/items`)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <h1>Shop</h1>
      <p>コイン：{currentUser.coin?.amount ?? "N/A"}</p>
      <ul>
        {currentUser.items.map((item) => (
          <li key={item.id}>
            {item.name} - Cost: {item.cost}
          </li>
        ))}
      </ul>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>Cost: {item.cost}</p>
            <p>Category: {item.category}</p>
            <a href={item.item_url}>More Info</a>
          </li>
        ))}
      </ul>
    </>
  );
};
