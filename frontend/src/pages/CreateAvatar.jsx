import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const CreateAvatar = () => {
  const { currentUser, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSupplement, setSelectedSupplement] = useState("");
  const [beforeAvatar, setBeforeAvatar] = useState(
    currentUser?.latest_avatar_url
  );
  const [generatedAvatar, setGeneratedAvatar] = useState(null);

  const genders = ["男性", "女性", "性別指定なし"];
  const supplements = ["元気な", "勇敢な", "優しい"];

  useEffect(() => {
    const fetchJobs = async () => {
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
      }
    };

    fetchJobs();
  }, [token]);

  const generateAvatar = async () => {
    const basePrompt = "ドラゴンクエスト風の32bit RPGのキャラクター";
    const prompt = `${basePrompt} ${selectedJob} ${selectedGender} ${selectedSupplement}`;
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}/avatars`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );
      const avatar = await response.json();
      setGeneratedAvatar(avatar.avatar_url);
    } catch (error) {
      console.error("Error generating avatar:", error);
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">アバター生成</h1>
      {/* プロンプトに用いるための選択肢 */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-2">ジョブ</h2>
          <select
            className="select select-bordered w-full"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="">選択してください</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.name}>
                {job.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-2">性別</h2>
          <select
            className="select select-bordered w-full"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option value="">選択してください</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-2">性格</h2>
          <select
            className="select select-bordered w-full"
            value={selectedSupplement}
            onChange={(e) => setSelectedSupplement(e.target.value)}
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

      <button className="btn btn-primary btn-lg mb-8" onClick={generateAvatar}>
        アバター生成
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">アバター</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-bold mb-2">Before</h3>
            <img
              src={beforeAvatar}
              alt="Before Avatar"
              className="w-full h-auto object-cover rounded"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-bold mb-2">After</h3>
            {generatedAvatar ? (
              <img
                src={generatedAvatar}
                alt="Generated Avatar"
                className="w-full h-auto object-cover rounded"
              />
            ) : (
              <div className="w-full h-64 bg-base-300 rounded"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
