import React from "react";
import { useAuth } from "../providers/auth";

export const MyPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

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
      <ul>
        {currentUser.items.map((item) => (
          <li key={item.id}>
            {item.name} - Cost: {item.cost}
          </li>
        ))}
      </ul>
      <p>コイン：{currentUser.coin?.amount ?? "N/A"}</p>
      <ul>
        {currentUser.avatars.map((avatar) => (
          <li key={avatar.id}>{avatar.avatar_url}</li>
        ))}
      </ul>
      {currentUser.latest_status && (
        <div>
          <h2>Latest Status</h2>
          <ul>
            <li>Job ID: {currentUser.latest_status.job_id}</li>
            <li>
              Job: {currentUser.latest_status.job?.name ?? "No job assigned"}
            </li>
            <li>Level: {currentUser.latest_status.level}</li>
            <li>HP: {currentUser.latest_status.hp}</li>
            <li>Strength: {currentUser.latest_status.strength}</li>
            <li>Intelligence: {currentUser.latest_status.intelligence}</li>
            <li>Wisdom: {currentUser.latest_status.wisdom}</li>
            <li>Dexterity: {currentUser.latest_status.dexterity}</li>
            <li>Charisma: {currentUser.latest_status.charisma}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
