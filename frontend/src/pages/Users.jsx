import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { Link } from "react-router-dom";

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
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">酒場</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-base-200 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={user.latest_avatar_url}
                alt="User Avatar"
                className="w-32 h-32 rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{user.nickname}</h2>
                <p>職業：{user.latest_status_as_json.job.name}</p>
                <p>レベル：{user.latest_status_as_json.level}</p>
                <p>HP：{user.latest_status_as_json.hp}</p>
              </div>
            </div>
            <div className="mb-4"></div>
            <div className="flex justify-between items-center">
              <div>
                <p>3日達成数：{user.achievement}</p>
                <p>{user.profile}</p>
              </div>
              <Link to={`/users/${user.id}`} className="btn btn-primary btn-sm">
                詳細
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
