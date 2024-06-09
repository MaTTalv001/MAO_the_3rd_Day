import React, { useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { useNavigate } from "react-router-dom";

export const Config = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const themes = ["aqua", "dark", "light"];
  const handleThemeChange = (event) => {
    document.documentElement.setAttribute("data-theme", event.target.value);
  };

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const handleUserDelete = async () => {
    if (deleteInput === "削除") {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/users/${currentUser.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setCurrentUser(null);
          setShowDeleteModal(false);
          alert("ユーザーデータを消去しました。ご利用ありがとうございました。");
          logout();
          navigate("/");
        } else {
          throw new Error("ユーザー削除に失敗しました");
        }
      } catch (error) {
        console.error("ユーザー削除に失敗しました:", error);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-4">コンフィグ</h1>
      </div>
      <p className="text-2xl font-bold mb-4">テーマカラー変更</p>
      <div className="flex space-x-4 mb-10">
        {themes.map((theme) => (
          <label
            key={theme}
            className="flex text-2xl font-bold text-secondary items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name="theme-radio"
              className="radio radio-primary"
              aria-label={theme}
              value={theme}
              onChange={handleThemeChange}
            />
            <span>{theme}</span>
          </label>
        ))}
      </div>
      <p className="text-2xl font-bold mb-4">ユーザー削除</p>
      <button
        className="btn btn-error"
        onClick={() => setShowDeleteModal(true)}
      >
        ユーザーを削除
      </button>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ユーザー削除</h3>
            <p className="py-4">
              ユーザーデータを消去する場合は”削除”と入力の上、実行ボタンを押してください。この作業は取り消しできません。
            </p>
            <input
              type="text"
              placeholder="削除と入力してください"
              className="input input-bordered w-full max-w-xs"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleUserDelete}>
                削除実行
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
