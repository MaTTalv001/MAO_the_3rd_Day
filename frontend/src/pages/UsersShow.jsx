import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { Link } from "react-router-dom";

export const UsersShow = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/users/${id}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [id]);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">{user.nickname}の詳細ページ</h1>
        <Link to={`/users`} className="btn btn-ghost btn-sm">
          一覧にもどる
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* プロフィール */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">{user.nickname}</h2>
          <img
            src={`${process.env.REACT_APP_BASE_URL}/${user.latest_avatar_url}`}
            alt="User Avatar"
            className="w-full h-auto mb-4 rounded-lg"
          />
        </div>

        {/* ステータス */}
        {user.latest_status && (
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">ステータス</h2>
            <p>Level: {user.latest_status.level}</p>
            <p>HP: {user.latest_status.hp}</p>
            <p>体力: {user.latest_status.strength}</p>
            <p>知力: {user.latest_status.intelligence}</p>
            <p>精神: {user.latest_status.wisdom}</p>
            <p>素速さ: {user.latest_status.dexterity}</p>
            <p>カリスマ: {user.latest_status.charisma}</p>
            <p className="mt-4">3日達成数: {user.achievement ?? 0}</p>
            <div className="mt-4 bg-base-300 p-2 rounded-lg">
              <h3 className="text-lg font-bold mb-2">プロフィール</h3>
              <p>{user.profile ?? "未設定"}</p>
            </div>
          </div>
        )}

        {/* 歴代アバター */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">歴代アバター</h2>
          <div className="grid grid-cols-3 gap-2">
            {user.avatars.map((avatar) => (
              <img
                key={avatar.id}
                src={`${API_URL}/${avatar.avatar_url}`}
                alt="User Avatar"
                className="w-full h-auto rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 活動一覧 */}
      <div className="bg-base-200 mt-4 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">活動一覧</h2>
        {/* 仮のボックスを表示 */}
        <div className="bg-base-300 h-40 rounded-lg flex items-center justify-center">
          <p className="text-lg">活動一覧（仮）</p>
        </div>
      </div>
    </div>
  );
};