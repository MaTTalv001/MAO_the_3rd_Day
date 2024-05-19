import React from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const PublicAvatar = () => {
  const query = useQuery();
  const imagePath = query.get("image");
  const baseUrl = "https://mao-the-3rd-day.s3.ap-northeast-1.amazonaws.com/";
  const imageUrl = `${baseUrl}${imagePath}`;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="bg-base-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">投稿アバター</h1>
        {imageUrl ? (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-auto rounded-lg"
            />
          </div>
        ) : (
          <p className="mb-4">No image URL provided</p>
        )}
        <a href="/" className="btn btn-primary">
          3日目に魔王がいる トップページ
        </a>
      </div>
    </div>
  );
};
