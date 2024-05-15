import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const CreateAvatar = () => {
  const { currentUser, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSupplement, setSelectedSupplement] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [beforeAvatar, setBeforeAvatar] = useState(
    currentUser?.latest_avatar_url
  );
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true); // ページ読み込み時のローディング
  const [loadingAvatar, setLoadingAvatar] = useState(false); // アバター生成時のローディング

  const genders = ["男性", "女性", "性別指定なし"];
  const supplements = ["元気な", "勇敢な", "優しい", "賢明な", "気高い"];
  const ages = ["子供", "10代", "20代", "30代", "40代", "50代", "60代以上"];

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/v1/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchJobs();
  }, [token]);

  const generateAvatar = async () => {
    setLoadingAvatar(true);
    const basePrompt =
      "A pixel art image resembling a 32-bit era video game, depicting a fantasy RPG character. The character is designed with a highly detailed and vibrant pixel art style typical of the 32-bit era, featuring a complex color palette and intricate details, surpassing the 16-bit graphics. The character is in a dynamic pose, equipped with gear appropriate to their job, reflecting their role and abilities in the game. This showcases the advanced graphical capabilities and the spirit of epic adventures in more modern classic video games.";
    const prompt = `${basePrompt} Job: ${selectedJob}, Gender: ${selectedGender}, Age: ${selectedAge}, Personality: ${selectedSupplement}`;
    const job_id = jobs.find((job) => job.name === selectedJob).id;
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}/avatars`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt, job_id }),
        }
      );
      const avatar = await response.json();
      setGeneratedAvatar(avatar.avatar_url);
    } catch (error) {
      console.error("Error generating avatar:", error);
    } finally {
      setLoadingAvatar(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <p>
        Loading...
        <span className="loading loading-spinner loading-lg"></span>
      </p>
    );
  }

  // 所有しているアバター生成アイテムでジョブをフィルタリングする
  const availableJobs = jobs.filter((job) =>
    currentUser.users_items.some((userItem) => userItem.item.id === job.item_id)
  );

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">アバター生成</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold mb-2">ジョブ</h2>
          <select
            className="select select-bordered w-full"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            disabled={availableJobs.length === 0} // ジョブがない場合は選択不可にする
          >
            <option value="">選択してください</option>
            {availableJobs.map((job) => (
              <option key={job.id} value={job.name}>
                {job.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">性別</h2>
          <select
            className="select select-bordered w-full"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            disabled={availableJobs.length === 0} // ジョブがない場合は選択不可にする
          >
            <option value="">選択してください</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">年代</h2>
          <select
            className="select select-bordered w-full"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            disabled={availableJobs.length === 0} // ジョブがない場合は選択不可にする
          >
            <option value="">選択してください</option>
            {ages.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">性格</h2>
          <select
            className="select select-bordered w-full"
            value={selectedSupplement}
            onChange={(e) => setSelectedSupplement(e.target.value)}
            disabled={availableJobs.length === 0} // ジョブがない場合は選択不可にする
          >
            <option value="">選択してください</option>
            {supplements.map((supplement) => (
              <option key={supplement} value={supplement}>
                {supplement}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="btn btn-primary w-full mb-6"
        onClick={generateAvatar}
        disabled={availableJobs.length === 0} // ジョブがない場合はボタンを非アクティブにする
      >
        アバター生成
      </button>
      {availableJobs.length === 0 && (
        <p className="text-red-500 text-center">
          アバター生成アイテムがありません
        </p>
      )}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">アバター</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-bold mb-2">Before</h3>
            <img
              src={beforeAvatar}
              alt="Before Avatar"
              className="w-full h-96 object-cover object-position-top rounded"
            />
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">After</h3>
            {generatedAvatar ? (
              <img
                src={generatedAvatar}
                alt="Generated Avatar"
                className="w-full h-96 object-cover object-position-top rounded"
              />
            ) : (
              <div className="w-full h-96 bg-base-300 rounded"></div>
            )}
          </div>
        </div>
      </div>
      {loadingAvatar && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              アバター作成中
              <span className="loading loading-dots loading-xs"></span>{" "}
            </h3>
            <p className="py-4">
              アバターを生成しています。少々お待ちください。
            </p>
            <img
              src="/imgs/npc/god.png"
              alt="Generating Avatar"
              className="w-48 h-48 mx-auto"
            />
            <div className="flex justify-center"></div>
            <div className="modal-action">
              <button className="btn" onClick={() => setLoadingAvatar(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
