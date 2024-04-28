import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams フックをインポート
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const UsersShow = () => {
  const { currentUser } = useAuth();
  const { id } = useParams(); // URLからユーザーIDを取得
  const [user, setUser] = useState(null); // 単一のユーザー情報を管理

  useEffect(() => {
    fetch(`${API_URL}/api/v1/users/${id}`) // 単一のユーザー情報を取得するURL
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [id]); // idが変わるたびに再フェッチ

  if (!user) {
    return <p>Loading profile...</p>; // データがない場合のローディング表示
  }

  // ユーザー情報の表示
  return (
    <>
      <h1>ユーザー詳細</h1>
      <div>
        <h2>アバター：{user.latest_avatar_url}</h2>
        <h2>冒険者名：{user.nickname}</h2>
        <h2>職業：{user.latest_status.job.name}</h2>
        <h2>レベル：{user.latest_status.level}</h2>
        <h2>HP：{user.latest_status.hp}</h2>
        <h2>3日達成数：{user.achievement}</h2>
      </div>
    </>
  );
};
