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

  const handlePurchase = (itemId) => {
    // 購入処理を実装する
    console.log(`Purchasing item with ID: ${itemId}`);
  };

  const getItemCount = (itemId) => {
    const userItem = currentUser.items.find((item) => item.id === itemId);
    return userItem ? userItem.count : 0;
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
