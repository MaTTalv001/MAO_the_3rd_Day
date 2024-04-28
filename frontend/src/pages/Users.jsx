import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const Users = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <h1>酒場</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar_url} alt="User Avatar" />
            <h2>冒険者名：{user.nickname}</h2>
            <h2>職業：{user.latest_status.job.name}</h2>
            <h2>レベル：{user.latest_status.level}</h2>
            <h2>HP：{user.latest_status.hp}</h2>
            <h2>3日達成数：{user.achievement}</h2>
          </li>
        ))}
      </ul>
    </>
  );
};
