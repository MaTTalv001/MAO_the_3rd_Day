import React from "react";
import { useAuth } from "../providers/auth";

export const MyItems = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>所持品</h1>
      <p>Nickname: {currentUser.nickname ?? "N/A"}</p>
      <ul>
        {currentUser.items.map((item) => (
          <li key={item.id}>
            {item.name} - Cost: {item.cost}
          </li>
        ))}
      </ul>
      <p>コイン：{currentUser.coin?.amount ?? "N/A"}</p>
    </div>
  );
};
