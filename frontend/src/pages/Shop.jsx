import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const Shop = () => {
  const { currentUser, token, setCurrentUser } = useAuth();
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

  const handlePurchase = async (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (!item) return;

    if (currentUser.coin.amount < item.cost) {
      alert("コインが足りません");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ item_id: itemId }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        alert("購入が完了しました");
      } else {
        alert("購入に失敗しました");
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      alert("購入に失敗しました");
    }
  };

  const getItemCount = (itemId) => {
    if (currentUser.users_items) {
      const userItem = currentUser.users_items.find(
        (usersItem) => usersItem.item.id === itemId
      );
      return userItem ? userItem.amount : 0;
    }
    return 0;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">ショップ</h1>
      <p className="text-xl mb-4">
        コイン：{currentUser.coin?.amount ?? "N/A"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-base-200 p-4 rounded-lg">
            <div className="mb-4">
              <img
                src={item.item_url}
                alt={item.name}
                className="w-full h-48 object-contain rounded"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-lg mb-2">コスト: {item.cost}</p>
            <p className="text-base mb-2">カテゴリ: {item.category}</p>
            <p className="text-base mb-4">所持数: {getItemCount(item.id)}</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => handlePurchase(item.id)}
            >
              購入
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
