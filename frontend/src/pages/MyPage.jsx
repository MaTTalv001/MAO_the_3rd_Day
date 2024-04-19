import React from "react";
import { useAuth } from "../providers/auth";

export const MyPage = () => {
  const { currentUser } = useAuth();

  // currentUserがnullまたはundefinedの場合、ローディングを表示
  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  // 安全にプロパティにアクセスするためのチェックを追加
  return (
    <div>
      <h1>My Profile</h1>
      <p>ID: {currentUser.id ?? "N/A"}</p>
      <p>Nickname: {currentUser.nickname ?? "N/A"}</p>
      <p>Profile: {currentUser.profile ?? "N/A"}</p>
      <p>Achievement: {currentUser.achievement ?? "N/A"}</p>
      <p>
        Account Created:{" "}
        {currentUser.created_at
          ? new Date(currentUser.created_at).toLocaleDateString()
          : "N/A"}
      </p>
      <p>
        Last Updated:{" "}
        {currentUser.updated_at
          ? new Date(currentUser.updated_at).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
};
