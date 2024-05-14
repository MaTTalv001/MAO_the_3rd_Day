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
  const [loading, setLoading] = useState(true);

  const genders = ["男性", "女性", "性別指定なし"];
  const supplements = ["元気な", "勇敢な", "優しい", "賢明な", "気高い"];
  const ages = ["子供", "10代", "20代", "30代", "40代", "50代", "60代以上"];

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const generateAvatar = async () => {
    const basePrompt =
      "A pixel art image resembling a 32-bit era video game, depicting a fantasy RPG character. The character is designed with a highly detailed and vibrant pixel art style typical of the 32-bit era, featuring a complex color palette and intricate details, surpassing the 16-bit graphics. The character is in a dynamic pose, with a sword in one hand and a shield in the other, wearing elaborate armor and a majestic cape, showcasing the advanced graphical capabilities and the spirit of epic adventures in more modern classic video games.";
    const prompt = `${basePrompt} 職業：${selectedJob} 性別：${selectedGender} 年齢：${selectedAge} 性格：${selectedSupplement}`;
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
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">アバター生成</h1>
      {/* プロンプトに用いるための選択肢 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold mb-2">ジョブ</h2>
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
        <div>
          <h2 className="text-lg font-bold mb-2">性別</h2>
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
        <div>
          <h2 className="text-lg font-bold mb-2">年代</h2>
          <select
            className="select select-bordered w-full"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
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
      <button className="btn btn-primary w-full mb-6" onClick={generateAvatar}>
        アバター生成
      </button>
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
    </div>
  );
};
