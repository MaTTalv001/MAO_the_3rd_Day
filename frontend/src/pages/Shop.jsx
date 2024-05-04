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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">ショップ</h1>
      <p className="text-xl mb-4">
        コイン：{currentUser.coin?.amount ?? "N/A"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-lg mb-2">Cost: {item.cost}</p>
            <p className="text-base mb-4">Category: {item.category}</p>
            <div className="flex justify-between items-center">
              <a
                href={item.item_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                More Info
              </a>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handlePurchase(item.id)}
              >
                購入
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
