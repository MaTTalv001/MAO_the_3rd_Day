import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

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
    <>
      <h1>ユーザー詳細</h1>
      <div>
        {user.avatars.map((avatar) => (
          <img src={avatar.avatar_url} alt="User Avatar" key={avatar.id} />
        ))}
        <img src={user.latest_avatar_url} alt="User Avatar" />
        <h2>冒険者名：{user.nickname}</h2>
        <h2>レベル：{user.latest_status.level}</h2>
        <h2>HP：{user.latest_status.hp}</h2>
        <h2>3日達成数：{user.achievement}</h2>
      </div>
    </>
  );
};
