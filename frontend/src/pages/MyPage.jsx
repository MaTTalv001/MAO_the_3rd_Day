import React from "react";
import { useAuth } from "../providers/auth";

export const MyPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">マイページ</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* プロフィール */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">{currentUser.nickname}</h2>
          <img
            src={currentUser.latest_avatar_url}
            alt="User Avatar"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <button className="btn btn-accent w-full">アバター変更</button>
        </div>

        {/* ステータス */}
        {currentUser.latest_status && (
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">ステータス</h2>
            <p>Level: {currentUser.latest_status.level}</p>
            <p>HP: {currentUser.latest_status.hp}</p>
            <p>体力: {currentUser.latest_status.strength}</p>
            <p>知力: {currentUser.latest_status.intelligence}</p>
            <p>精神: {currentUser.latest_status.wisdom}</p>
            <p>素速さ: {currentUser.latest_status.dexterity}</p>
            <p>カリスマ: {currentUser.latest_status.charisma}</p>
            <p className="mt-4">3日達成数: {currentUser.achievement ?? 0}</p>
            <div className="mt-4 bg-base-300 p-2 rounded-lg">
              <h3 className="text-lg font-bold mb-2">プロフィール</h3>
              <p>{currentUser.profile ?? "未設定"}</p>
            </div>
          </div>
        )}

        {/* 所持品 */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">所持品</h2>
          {/* 仮のボックスを表示 */}
          <div className="bg-base-300 h-40 rounded-lg flex items-center justify-center">
            <p className="text-lg">データがありません</p>
          </div>
        </div>
      </div>

      {/* 活動報告 */}
      <div className="bg-base-200 mt-4 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">活動登録</h2>
        {/* 仮のボックスを表示 */}
        <div className="bg-base-300 h-40 rounded-lg">
          TO DO 機能実装（Material UI）
        </div>
      </div>
    </div>
  );
};
