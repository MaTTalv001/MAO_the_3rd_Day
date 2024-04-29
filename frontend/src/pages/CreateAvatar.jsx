import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const CreateAvatar = () => {
  const { currentUser, token } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  const handleCreateAvatar = async () => {
    const requestBody = {
      avatar: {
        prompt,
      },
    };

    const response = await fetch(
      `${API_URL}/api/v1/users/${currentUser.id}/avatars`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Avatar created:", data);
    } else {
      console.error("Failed to create avatar", await response.text()); // JSONではなくtextでエラーをログ
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      <p>ID: {currentUser.id ?? "N/A"}</p>
      <p>Nickname: {currentUser.nickname ?? "N/A"}</p>
      <img src={avatarUrl || currentUser.latest_avatar_url} alt="User Avatar" />
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt for new avatar"
      />
      <button onClick={handleCreateAvatar}>Create Avatar</button>
    </div>
  );
};
