import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import { API_URL, FRONT_URL } from "../config/settings";
import { handleTweet } from "../services/HandleTweet";

export const AvatarDirectory = () => {
  const { currentUser, setCurrentUser, token } = useAuth();
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // アバター更新
  const handleAvatarUpdate = async (avatarUrl) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: { current_avatar_url: avatarUrl } }),
        }
      );

      if (!response.ok) {
        throw new Error("こちらはアバターの更新に失敗しました");
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("こちらアバターの更新に失敗しました:", error);
    }
  };

  const openModal = (avatar) => {
    setSelectedAvatar(avatar);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAvatar(null);
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-3 gap-2">
          {currentUser.avatars
            .sort((a, b) => b.id - a.id) // 降順ソート
            .slice(0, showAllAvatars ? currentUser.avatars.length : 24)
            .map((avatar) => (
              <div key={avatar.id} className="relative">
                <img
                  src={`${avatar.avatar_url}`}
                  alt="User Avatar"
                  className="w-full h-auto rounded cursor-pointer"
                  onClick={() => openModal(avatar)}
                />
              </div>
            ))}
        </div>
        {currentUser.avatars.length > 24 && (
          <button
            className="mt-4 text-primary underline"
            onClick={() => setShowAllAvatars(!showAllAvatars)}
          >
            {showAllAvatars ? "一部を表示" : "すべて表示"}
          </button>
        )}
      </div>
      {/* アバターモーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-4xl w-full h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">アバター詳細</h2>
              <button className="btn btn-sm btn-circle" onClick={closeModal}>
                ✕
              </button>
            </div>
            {selectedAvatar && (
              <>
                <img
                  src={`${selectedAvatar.avatar_url}`}
                  alt="Selected Avatar"
                  className="w-full h-auto rounded mb-4 max-w-[500px] max-h-[500px]"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleTweet(selectedAvatar.avatar_url, FRONT_URL)
                    }
                    className="btn btn-primary flex items-center"
                  >
                    <svg
                      viewBox="0 0 1200 1227"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="none"
                      className="w-6 h-6 mr-2"
                    >
                      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                    </svg>
                    シェア
                  </button>
                  <button
                    className="btn btn-secondary flex items-center"
                    onClick={() =>
                      handleAvatarUpdate(selectedAvatar.avatar_url)
                    }
                  >
                    メインアバターにする
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* ここまでアバターモーダル */}
    </>
  );
};

export default AvatarDirectory;
