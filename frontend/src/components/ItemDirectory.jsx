import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import { API_URL, FRONT_URL } from "../config/settings";

export const ItemDirectory = () => {
  const { currentUser, token } = useAuth();
  const [items, setItems] = useState([]);
  const [useritems, setUserItems] = useState([]);

  // 初回レンダリング時にアイテムデータを取得
  useEffect(() => {
    fetch(`${API_URL}/api/v1/items`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) =>
        console.error("アイテムデータ取得に失敗しました:", error)
      );
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>
    );
  }

  // アイテムが所持されているかどうかを判定する関数
  const isItemOwned = (itemId) => {
    return currentUser.users_items.some(
      (userItem) => userItem.item.id === itemId
    );
  };

  //アイテム種別で表示を区分けするためのコンポーネント
  // アイテム種別で表示を区分けするためのコンポーネント
  const renderItems = (itemsToRender) => {
    return itemsToRender.map((item) => (
      <div className="card bg-base-100 shadow-xl" key={item.id}>
        <figure className="px-4 pt-4">
          <div className="w-full h-48 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex justify-center items-center">
              <img
                src={item.item_url}
                alt={item.name}
                className={`object-contain h-full ${
                  item.category !== "アバター生成" && !isItemOwned(item.id)
                    ? "brightness-0"
                    : ""
                }`}
              />
            </div>
          </div>
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{item.name}</h2>
          <p className="text-md">所持数: {getItemAmount(item.id)}</p>
        </div>
      </div>
    ));
  };

  // カテゴリ別にアイテムをフィルタリング
  const avatarItems = items.filter((item) => item.category === "アバター生成");
  const collectionItems = items.filter(
    (item) => item.category !== "アバター生成"
  );

  // アイテムの所持量を取得する関数
  const getItemAmount = (itemId) => {
    const userItem = currentUser.users_items.find(
      (userItem) => userItem.item.id === itemId
    );
    return userItem ? userItem.amount : 0;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">アバター生成アイテム</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderItems(avatarItems)}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          コレクションアイテム図鑑
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderItems(collectionItems)}
        </div>
      </div>
    </div>
  );
};

export default ItemDirectory;
