import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL, FRONT_URL } from "../config/settings";
import { Link } from "react-router-dom";

export const CreateAvatar = () => {
  const { currentUser, token, setCurrentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("未選択");
  const [selectedGender, setSelectedGender] = useState("未選択");
  const [selectedSupplement, setSelectedSupplement] = useState("未選択");
  const [selectedAge, setSelectedAge] = useState("未選択");
  const [selectedRace, setSelectedRace] = useState("人間");
  const [selectedAccessory, setSelectedAccessory] = useState("未選択");
  const [beforeAvatar, setBeforeAvatar] = useState(
    currentUser?.current_avatar_url
  );
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const genders = ["男性", "女性", "性別指定なし"];
  const supplements = [
    "元気な",
    "勇敢な",
    "優しい",
    "賢明な",
    "気高い",
    "豪快な",
    "物静かな",
  ];
  const ages = ["子供", "10代", "20代", "30代", "40代", "50代", "60代以上"];
  const races = [
    "人間",
    "エルフ",
    "オーガ",
    "ドワーフ",
    "フェアリー",
    "ダークエルフ",
    "ヴァンパイア",
    "リザードマン",
  ];
  const accessories = [
    "指定なし",
    "メガネ",
    "アイパッチ",
    "バンダナ",
    "マント",
  ];

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
          throw new Error("アバターのリクエストに失敗しました");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("ジョブ情報の取得に失敗しました:", error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchJobs();
  }, [token]);

  const availableJobs = currentUser
    ? jobs.filter((job) =>
        currentUser.users_items.some(
          (userItem) => userItem.item.id === job.item_id
        )
      )
    : [];

  useEffect(() => {
    const hasAvailableJobs = availableJobs.length > 0;
    const button = document.querySelector("#generate-avatar-button");
    if (button) {
      button.disabled = !hasAvailableJobs;
    }
  }, [availableJobs]);

  const generateAvatar = async () => {
    setLoadingAvatar(true);
    closeConfirmationModal();
    const basePrompt =
      "A pixel art image resembling a 32-bit era video game, depicting a fantasy RPG character. The character is designed with a highly detailed and vibrant pixel art style typical of the 32-bit era, featuring a complex color palette and intricate details, surpassing the 16-bit graphics. The character is in a dynamic pose, equipped with gear appropriate to their job, reflecting their role and abilities in the game. This showcases the advanced graphical capabilities and the spirit of epic adventures in more modern classic video games.";
    const prompt = `${basePrompt} Job: ${selectedJob}, Gender: ${selectedGender}, Age: ${selectedAge}, Personality: ${selectedSupplement}, Race: ${selectedRace}, Accessory: ${selectedAccessory}`;
    const job_id = jobs.find((job) => job.name === selectedJob).id;
    const item_id = jobs.find((job) => job.id === job_id).item_id;
    try {
      //アイテム消費
      const deleteItemResponse = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}/items/${item_id}/consume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteItemResponse.ok) {
        const updatedUser = await deleteItemResponse.json();
        setCurrentUser(updatedUser);
      } else {
        console.error(
          "アイテム消費処理に失敗しました:",
          deleteItemResponse.statusText
        );
      }
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
      setSelectedJob("未選択");
    } catch (error) {
      console.error("アバター生成に失敗しました:", error);
    } finally {
      setLoadingAvatar(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleGenerateAvatarClick = () => {
    openConfirmationModal();
  };

  const handleConfirmGenerateAvatar = () => {
    generateAvatar();
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
      <div className="flex items-center justify-center h-screen">
        <div>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>
    );
  }

  const handleTweet = () => {
    const baseUrl = "https://mao-the-3rd-day.s3.ap-northeast-1.amazonaws.com/";
    const imagePath = generatedAvatar.replace(baseUrl, "");
    const tweetText = `魔王を討伐するためにアバターを作りました！ #みかまお`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `${FRONT_URL}/public_avatar?image=${imagePath}`
    )}&text=${encodeURIComponent(tweetText)}`;

    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">
          アバター生成
          <button onClick={openModal} className="ml-2 text-blue-500">
            <i className="fas fa-question-circle"></i>
          </button>
        </h1>
        <div>
          <Link to={`/MyPage`} className="btn btn-ghost btn-xl">
            マイページ
          </Link>
        </div>
      </div>

      {/*オプションの選択*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold mb-2">ジョブ(必須)</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn w-full mb-2 btn-lg btn-accent"
              style={{ minWidth: "200px" }}
            >
              {selectedJob ? selectedJob : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {availableJobs.map((job) => (
                <li key={job.id}>
                  <a onClick={() => setSelectedJob(job.name)}>{job.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">性別</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn mb-2 btn-lg btn-accent w-fit "
              style={{ minWidth: "200px" }}
            >
              {selectedGender ? selectedGender : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {genders.map((gender) => (
                <li key={gender}>
                  <a onClick={() => setSelectedGender(gender)}>{gender}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">年代</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-lg mb-2 btn-accent w-fit"
              style={{ minWidth: "200px" }}
            >
              {selectedAge ? selectedAge : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {ages.map((age) => (
                <li key={age}>
                  <a onClick={() => setSelectedAge(age)}>{age}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">性格</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn mb-2 btn-lg btn-accent w-fit"
              style={{ minWidth: "200px" }}
            >
              {selectedSupplement ? selectedSupplement : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {supplements.map((supplement) => (
                <li key={supplement}>
                  <a onClick={() => setSelectedSupplement(supplement)}>
                    {supplement}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">種族</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn mb-2 btn-lg btn-accent w-fit"
              style={{ minWidth: "200px" }}
            >
              {selectedRace ? selectedRace : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {races.map((race) => (
                <li key={race}>
                  <a onClick={() => setSelectedRace(race)}>{race}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">アクセサリ</h2>
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn mb-2 btn-lg btn-accent w-fit"
              style={{ minWidth: "200px" }}
            >
              {selectedAccessory ? selectedAccessory : "未選択"}
            </div>
            <ul
              tabIndex={0}
              className="text-lg dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {accessories.map((accessory) => (
                <li key={accessory}>
                  <a onClick={() => setSelectedAccessory(accessory)}>
                    {accessory}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/*ここまでオプションの選択*/}

      {/*ジョブを選択している場合のみアバター生成可能 */}
      {availableJobs.length > 0 && (
        <>
          {selectedJob !== "未選択" ? (
            <button
              id="generate-avatar-button"
              className="btn btn-primary w-full mb-6"
              onClick={handleGenerateAvatarClick}
              disabled={availableJobs.length === 0}
            >
              アバター生成
            </button>
          ) : (
            <div className="alert alert-warning mb-6">
              <div className="flex-1">
                <label>ジョブの選択は必須です</label>
              </div>
            </div>
          )}
        </>
      )}
      {availableJobs.length === 0 && (
        <>
          <p className="text-warning text-center">
            アバター生成アイテムがありません。ショップで購入できます。
          </p>
          <Link to={`/shop`} className="btn btn-warning w-full">
            ショップ
          </Link>
        </>
      )}
      <div className="mt-6">
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
              <>
                <img
                  src={generatedAvatar}
                  alt="Generated Avatar"
                  className="w-full h-96 object-cover object-position-top rounded mb-2"
                />
                <button
                  onClick={handleTweet}
                  className="btn btn-primary flex items-center"
                >
                  <svg
                    viewBox="0 0 1200 1227"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="none"
                    className="w-6 h-6 mr-2"
                  >
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                  </svg>
                  シェア
                </button>
              </>
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
              アバターを生成しています。このままお待ちください。
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">アバター</h2>
            <p>専用アイテムを用いてオリジナルアバターを生成できます</p>
            <p>要素を選択して好みのアバターを創りましょう</p>
            <p>※アバターおよび各要素はステータスに影響しません</p>
            <button className="mt-4 btn btn-primary" onClick={closeModal}>
              閉じる
            </button>
          </div>
        </div>
      )}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">確認</h2>
            <p>アバターを作成しますか？ジョブ: {selectedJob}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-primary mr-2"
                onClick={handleConfirmGenerateAvatar}
              >
                作成する
              </button>
              <button className="btn" onClick={closeConfirmationModal}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
