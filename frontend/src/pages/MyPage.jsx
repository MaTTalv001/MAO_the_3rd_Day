import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import ActivityEntry from "../components/ActivityEntry";
import ActivityShow from "../components/ActivityShow";
import RadarChart from "../components/RadarChart";
import { API_URL, FRONT_URL } from "../config/settings";

export const MyPage = () => {
  const { currentUser: authUser, token } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState("");
  const [itemsTab, setItemsTab] = useState("items");
  const [activitiesTab, setActivitiesTab] = useState("entry");
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBattledToday, setHasBattledToday] = useState(false);
  const [hasBossBattledToday, setHasBossBattledToday] = useState(false);

  useEffect(() => {
    setCurrentUser(authUser);
    setEditedNickname(authUser?.nickname || "");
    setEditedProfile(authUser?.profile || "");
  }, [authUser]);
  // 今日の討伐が完了しているか
  useEffect(() => {
    if (currentUser && currentUser.battle_logs) {
      const today = new Date();
      const todayBattles = currentUser.battle_logs.filter((log) => {
        const logDate = new Date(log.created_at);
        return (
          logDate.getFullYear() === today.getFullYear() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getDate() === today.getDate()
        );
      });
      setHasBattledToday(todayBattles.length > 0);
    }
  }, [currentUser]);

  // 今日のボス討伐が完了しているか
  useEffect(() => {
    if (currentUser && currentUser.boss_battle_logs) {
      const today = new Date();
      const todayBossBattles = currentUser.boss_battle_logs.filter((log) => {
        const logDate = new Date(log.created_at);
        return (
          logDate.getFullYear() === today.getFullYear() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getDate() === today.getDate()
        );
      });
      setHasBossBattledToday(todayBossBattles.length > 0);
    }
  }, [currentUser]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNicknameEditClick = () => {
    setIsNicknameEditing(true);
  };

  const handleProfileEditClick = () => {
    setIsProfileEditing(true);
  };

  const handleNicknameSaveClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: { nickname: editedNickname } }),
        }
      );

      if (!response.ok) {
        throw new Error("ニックネームの更新に失敗しました");
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      setIsNicknameEditing(false);
    } catch (error) {
      console.error("ニックネームの更新に失敗しました:", error);
    }
  };

  const handleProfileSaveClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: { profile: editedProfile } }),
        }
      );

      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      setIsProfileEditing(false);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
    }
  };

  const handleSpecialModeParticipation = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/special_modes/participate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCurrentUser({ ...currentUser, special_mode_unlocked: false });
        window.location.href = "/boss";
      } else {
        console.error("魔王戦の参加に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleTweet = () => {
    const baseUrl = "https://mao-the-3rd-day.s3.ap-northeast-1.amazonaws.com/";
    const imagePath = selectedAvatar.avatar_url.replace(baseUrl, "");
    const tweetText = `魔王を討伐するためにアバターを作りました！ #みかまお`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `${FRONT_URL}/public_avatar?image=${imagePath}`
    )}&text=${encodeURIComponent(tweetText)}`;

    window.open(twitterUrl, "_blank");
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-4">マイページ</h1>
        <div>
          <Link to={`/users`} className="btn btn-ghost btn-xl">
            酒場
          </Link>
          <Link to={`/shop`} className="btn btn-ghost btn-xl">
            ショップ
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* プロフィール */}
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="mb-2">
            {isNicknameEditing ? (
              <>
                <input
                  type="text"
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
                  className="text-2xl font-bold w-full mb-2"
                />
                <button
                  onClick={handleNicknameSaveClick}
                  className="btn btn-primary btn-sm"
                >
                  保存
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{currentUser.nickname}</h2>
                <button onClick={handleNicknameEditClick} className="ml-2">
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            )}
          </div>
          <img
            src={currentUser.latest_avatar_url}
            alt="User Avatar"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <Link to={`/create_avatar`} className="btn btn-accent w-full mb-1">
            アバター変更
          </Link>
          {!hasBattledToday && (
            <Link to={`/battle`} className="btn btn-secondary w-full mb-1">
              討伐
            </Link>
          )}
          {currentUser.special_mode_unlocked && !hasBossBattledToday && (
            <Link to={`/boss`} className="btn btn-error w-full mb-1">
              魔王戦に挑む
            </Link>
          )}
        </div>
        {/* ステータス */}
        {currentUser.latest_status && (
          <div className="bg-base-200 p-4 rounded-lg relative">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              ステータス
              <button onClick={openModal} className="ml-2 text-blue-500">
                <i className="fas fa-question-circle"></i>
              </button>
            </h2>
            <p>Level: {currentUser.latest_status.level}</p>
            <p>{currentUser.latest_status.job.name}</p>

            <p>HP: {currentUser.latest_status.hp}</p>
            <div className="text-center">
              <RadarChart currentUser={currentUser} />
            </div>
            {/*
            <p>筋力: {currentUser.latest_status.strength}</p>
            <p>知力: {currentUser.latest_status.intelligence}</p>
            <p>精神: {currentUser.latest_status.wisdom}</p>
            <p>敏捷: {currentUser.latest_status.dexterity}</p>
            <p>魅力: {currentUser.latest_status.charisma}</p> 
            */}
            <p className="mt-4">3日達成数: {currentUser.achievement ?? 0}</p>
            <div className="mt-4 bg-base-300 p-2 rounded-lg">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-bold">プロフィール</h3>
                {!isProfileEditing && (
                  <button onClick={handleProfileEditClick} className="ml-2">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                )}
              </div>
              {isProfileEditing ? (
                <>
                  <textarea
                    value={editedProfile}
                    onChange={(e) => setEditedProfile(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleProfileSaveClick}
                    className="mt-2 btn btn-sm btn-primary"
                  >
                    保存
                  </button>
                </>
              ) : (
                <p>{currentUser.profile ?? "未設定"}</p>
              )}
            </div>
          </div>
        )}
        {/* 所持品とアバター */}
        <div className="bg-base-200 p-4 rounded-lg">
          <div role="tablist" className="tabs tabs-lifted mb-4">
            <a
              role="tab"
              className={`tab ${itemsTab === "items" ? "tab-active" : ""}`}
              onClick={() => setItemsTab("items")}
            >
              所持品
            </a>
            <a
              role="tab"
              className={`tab ${itemsTab === "avatars" ? "tab-active" : ""}`}
              onClick={() => setItemsTab("avatars")}
            >
              アバター
            </a>
          </div>
          {itemsTab === "items" ? (
            <>
              <h2 className="text-xl font-bold mb-4 cursor-pointer">所持品</h2>
              {currentUser.users_items.length > 0 ? (
                <>
                  <div className="flex flex-col divide-y divide-base-300">
                    {currentUser.users_items
                      .slice(
                        0,
                        showAllItems ? currentUser.users_items.length : 3
                      )
                      .map((userItem, index) => (
                        <div key={index} className="py-4 relative">
                          <div className="badge badge-primary absolute right-2 top-2">
                            {userItem.amount}
                          </div>
                          <div className="flex items-center space-x-4">
                            <img
                              src={userItem.item.item_url}
                              alt={userItem.item.name}
                              className="w-16 h-16 object-contain"
                            />
                            <div>
                              <h3 className="text-lg font-medium">
                                {userItem.item.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {currentUser.users_items.length > 3 && (
                    <button
                      className="mt-4 text-primary underline"
                      onClick={() => setShowAllItems(!showAllItems)}
                    >
                      {showAllItems ? "一部を表示" : "すべて表示"}
                    </button>
                  )}
                </>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-lg">データがありません</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 cursor-pointer">
                アバター
              </h2>
              {currentUser.avatars.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {currentUser.avatars
                      .sort((a, b) => b.id - a.id) // 降順ソート
                      .slice(0, showAllAvatars ? currentUser.avatars.length : 9)
                      .map((avatar) => (
                        <img
                          key={avatar.id}
                          src={`${avatar.avatar_url}`}
                          alt="User Avatar"
                          className="w-full h-auto rounded cursor-pointer"
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            document.getElementById("avatarModal").showModal();
                          }}
                        />
                      ))}
                  </div>
                  {currentUser.avatars.length > 9 && (
                    <button
                      className="mt-4 text-primary underline"
                      onClick={() => setShowAllAvatars(!showAllAvatars)}
                    >
                      {showAllAvatars ? "一部を表示" : "すべて表示"}
                    </button>
                  )}
                </>
              ) : (
                <p>アバターがありません</p>
              )}
            </>
          )}
        </div>
        {/* ここまで所持品とアバター */}
      </div>
      {/* 活動報告 */}
      <div className="bg-base-200 mt-4 p-4 rounded-lg">
        <div role="tablist" className="tabs tabs-lifted mb-4">
          <a
            role="tab"
            className={`tab ${activitiesTab === "entry" ? "tab-active" : ""}`}
            onClick={() => setActivitiesTab("entry")}
          >
            今日の活動登録
          </a>
          <a
            role="tab"
            className={`tab ${activitiesTab === "show" ? "tab-active" : ""}`}
            onClick={() => setActivitiesTab("show")}
          >
            これまでの活動履歴
          </a>
        </div>
        {activitiesTab === "entry" ? (
          <ActivityEntry
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        ) : (
          <ActivityShow activities={currentUser.activities} />
        )}
      </div>

      {/* アバターモーダル */}
      <dialog id="avatarModal" className="modal">
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => document.getElementById("avatarModal").close()}
          >
            ✕
          </button>
          {selectedAvatar && (
            <>
              <img
                src={`${selectedAvatar.avatar_url}`}
                alt="Selected Avatar"
                className="w-full h-auto rounded mb-4"
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
          )}
        </div>
      </dialog>

      {/* ステータスモーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">ステータス説明</h2>
            <p>Level: 出現モンスターレベルに影響します（予定）</p>
            <p>筋力: 物理的な攻撃力と防御力に影響します</p>
            <p>知力: 魔法攻撃力に影響します</p>
            <p>精神: 防御力に影響します</p>
            <p>敏捷: ダブルアタック発生率に影響します</p>
            <p>魅力: 獲得金貨にボーナスがつきます</p>
            <button className="mt-4 btn btn-primary" onClick={closeModal}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
