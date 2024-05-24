import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { Link } from "react-router-dom";

export const Shop = () => {
  const { currentUser, token, setCurrentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/items`)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!selectedItem) return;

    if (currentUser.coin.amount < selectedItem.cost) {
      setPurchaseResult({ success: false, message: "コインが足りません" });
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
          body: JSON.stringify({ item_id: selectedItem.id }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        setPurchaseResult({ success: true, message: "購入が完了しました" });
      } else {
        setPurchaseResult({ success: false, message: "購入に失敗しました" });
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      setPurchaseResult({ success: false, message: "購入に失敗しました" });
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

  const closeModals = () => {
    setSelectedItem(null);
    setPurchaseResult(null);
  };

  const openInstModal = () => {
    setIsInstModalOpen(true);
  };

  const closeInstModal = () => {
    setIsInstModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-4">
          ショップ
          <button onClick={openInstModal} className="ml-2 text-blue-500">
            <i className="fas fa-question-circle"></i>
          </button>
        </h1>
        <Link to={`/MyPage`} className="btn btn-ghost btn-xl">
          マイページ
        </Link>
      </div>
      <p className="text-xl mb-4">
        コイン：{currentUser.coin?.amount ?? "N/A"}
      </p>
      <div role="alert" className="alert alert-success mb-4">
        <span>
          <p>アバター生成アイテム：アバター生成時に使用します</p>
          <p>その他：現バージョンでは武具含め全てコレクターズアイテムです</p>
        </span>
      </div>
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
              onClick={() => setSelectedItem(item)}
            >
              購入
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">購入確認</h3>
            <p className="py-4">{selectedItem.name}を購入しますか？</p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handlePurchase}>
                購入する
              </button>
              <button className="btn" onClick={() => setSelectedItem(null)}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {purchaseResult && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">購入結果</h3>
            <p className="py-4">{purchaseResult.message}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModals}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      {isInstModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">ショップ</h2>
            <h3>金貨を消費してアイテムを購入できます</h3>
            <p>アバター生成アイテム：アバター生成に使用します</p>
            <p>
              ※その他はコレクションアイテムです。武具を含めステータスなどに影響しません
            </p>
            <button className="mt-4 btn btn-primary" onClick={closeInstModal}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
