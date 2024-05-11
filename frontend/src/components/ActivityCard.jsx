import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

const getCategoryBadgeColor = (categoryId) => {
  switch (categoryId) {
    case 1:
      return "badge-primary";
    case 2:
      return "badge-secondary";
    case 3:
      return "badge-accent";
    case 4:
      return "badge-neutral";
    case 5:
      return "badge-info";
    default:
      return "badge-base-300";
  }
};

export const ActivityCard = ({ activity }) => {
  const { currentUser: authUser, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const categoryBadgeColor = getCategoryBadgeColor(activity.category.id);
  const [likesCount, setLikesCount] = useState(activity.likes_count);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/activities/${activity.id}/activity_likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("いいね情報の取得に失敗しました");
        }
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likes_count);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [activity.id, token]);

  const handleLikeClick = async () => {
    try {
      const url = isLiked
        ? `${API_URL}/api/v1/activities/${activity.id}/activity_likes/${activity.id}`
        : `${API_URL}/api/v1/activities/${activity.id}/activity_likes`;
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("いいね更新に失敗しました");
      }
      const data = await response.json();
      setIsLiked(!isLiked);
      setLikesCount(data.likes_count);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="bg-neutral p-4 rounded-lg">
      <h3 className="text-lg font-bold">{activity.action}</h3>
      <p>
        {new Date(activity.created_at).toLocaleDateString()}　{activity.minute}
        分
      </p>
      <div className="mt-2">
        <span className={`badge ${categoryBadgeColor}`}>
          {activity.category.name}
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className={`btn glass btn-sm ${isLiked ? "text-error" : ""}`}
          onClick={handleLikeClick}
        >
          <i className="fas fa-heart mr-2"></i>
          <span className="text-sm mr-2">{likesCount}</span>
        </button>
      </div>
    </div>
  );
};
