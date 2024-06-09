import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import ActivityEntry from "../components/ActivityEntry";
import ActivityShow from "../components/ActivityShow";
import RadarChart from "../components/RadarChart";
import LineChart from "../components/LineChart";
import { API_URL, FRONT_URL } from "../config/settings";
import { useHasBattledToday } from "../services/HasBattledToday";
import { handleTweet } from "../services/HandleTweet";
import ItemDirectory from "../components/ItemDirectory"; //アイテム図鑑
import EnemyDirectory from "../components/EnemyDirectory"; //エネミー図鑑
import AvatarDirectory from "../components/AvatarDirectory"; //アバター図鑑

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
  const [hasBossBattledToday, setHasBossBattledToday] = useState(false);
  const [isItemDirectoryModalOpen, setIsItemDirectoryModalOpen] =
    useState(false);
  const [isEnemyDirectoryModalOpen, setIsEnemyDirectoryModalOpen] =
    useState(false);
  const [isAvatarDirectoryModalOpen, setIsAvatarDirectoryModalOpen] =
    useState(false);

  useEffect(() => {
    setCurrentUser(authUser);
    setEditedNickname(authUser?.nickname || "");
    setEditedProfile(authUser?.profile || "");
  }, [authUser]);
  // ログインユーザーのバトルログをチェックして本日バトルしたかどうかを設定
  const hasBattledToday = useHasBattledToday(currentUser);

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

  useEffect(() => {
    if (isItemDirectoryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isItemDirectoryModalOpen]);

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

  // アバター更新
  const handleAvatarUpdate = async (avatarUrl) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: { current_avatar_url: avatarUrl } }),
        }
      );

      if (!response.ok) {
        throw new Error("アバターの更新に失敗しました");
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("アバターの更新に失敗しました:", error);
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

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <span className="loading loading-ring loading-lg"></span>
        </div>
        <p>長時間画面が変わらない場合は、再度ログインしてください</p>
      </div>
    );
  }

  const openItemDirectoryModal = () => {
    setIsItemDirectoryModalOpen(true);
  };

  const closeItemDirectoryModal = () => {
    setIsItemDirectoryModalOpen(false);
  };

  const openEnemyDirectoryModal = () => {
    setIsEnemyDirectoryModalOpen(true);
  };

  const closeEnemyDirectoryModal = () => {
    setIsEnemyDirectoryModalOpen(false);
  };

  const openAvatarDirectoryModal = () => {
    setIsAvatarDirectoryModalOpen(true);
  };

  const closeAvatarDirectoryModal = () => {
    setIsAvatarDirectoryModalOpen(false);
  };

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
        <div className="bg-base-200 bg-opacity-60  p-4 rounded-lg">
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
            src={currentUser.current_avatar_url}
            alt="User Avatar"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <Link
            to={`/create_avatar`}
            className="btn btn-accent shadow-xl w-full mb-1"
          >
            <img
              src="/imgs/items/item_001.png"
              alt="アバター生成"
              className="w-10 h-auto mr-2"
            />
            アバター生成
          </Link>
          {!hasBattledToday && (
            <Link to={`/battle`} className="btn btn-secondary w-full mb-1">
              <img
                src="/mao_favicon.png"
                alt="討伐"
                className="w-10 h-auto mr-2"
              />
              日替わり討伐
            </Link>
          )}
          {currentUser.special_mode_unlocked && !hasBossBattledToday && (
            <Link to={`/boss`} className="btn btn-error w-full mb-1">
              <img src="/mao.png" alt="魔王戦" className="w-10 h-auto mr-2" />
              魔王戦に挑む
            </Link>
          )}
        </div>
        {/* ステータス */}
        {currentUser.latest_status && (
          <div className="bg-base-200 bg-opacity-60 p-4 rounded-lg relative">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              ステータス
              <button onClick={openModal} className="ml-2 text-blue-500">
                <i className="fas fa-question-circle"></i>
              </button>
            </h2>
            <p className="text-xl font-bold">
              Level: {currentUser.latest_status.level}
              {"  "}
              {currentUser.latest_status.job.name}
            </p>

            <p className="text-xl font-bold">
              HP: {currentUser.latest_status.hp}
            </p>
            <div className="text-center">
              <RadarChart currentUser={currentUser} />
            </div>

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
        <div className="bg-base-200 bg-opacity-60 p-4 rounded-lg">
          <div role="tablist" className="tabs tabs-lifted mb-4">
            <a
              role="tab"
              className={`tab ${itemsTab === "items" ? "tab-active" : ""}`}
              onClick={() => setItemsTab("items")}
            >
              コレクション
            </a>
            <a
              role="tab"
              className={`tab ${itemsTab === "avatars" ? "tab-active" : ""}`}
              onClick={() => setItemsTab("avatars")}
            >
              実績
            </a>
          </div>
          {itemsTab === "items" ? (
            <div className="flex flex-col justify-center items-center ">
              <>
                <button
                  className="btn btn-lg btn-block btn-neutral flex items-center my-4"
                  onClick={openItemDirectoryModal}
                >
                  <img
                    src="/imgs/items/item_008.png"
                    alt="アイテム袋"
                    className="w-12 h-auto mr-2"
                  />
                  アイテム袋
                </button>
                <button
                  className="btn btn-lg btn-block btn-neutral flex items-center my-4"
                  onClick={openAvatarDirectoryModal}
                >
                  <img
                    src="/imgs/npc/god.png"
                    alt="Myアバター"
                    className="w-12 h-auto mr-2"
                  />
                  アバター録
                </button>
                <button
                  className="btn btn-lg btn-block btn-neutral flex items-center my-4"
                  onClick={openEnemyDirectoryModal}
                >
                  <img
                    src="/imgs/enemies/monster001.png"
                    alt="討伐図鑑"
                    className="w-12 h-auto mr-2"
                  />
                  討伐図鑑
                </button>
              </>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-180">
              <div className="stats shadow flex flex-col">
                <div className="stat">
                  <div className="stat-title">3日達成</div>
                  <div className="stat-value">
                    {currentUser.achievement ?? 0}回
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">アクティビティ累計</div>
                  <div className="stat-value">
                    {currentUser.activities.length}件
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">エネミー討伐数</div>
                  <div className="stat-value">
                    {
                      currentUser.battle_logs.filter(
                        (log) => log.result === true
                      ).length
                    }
                    件
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">勝率</div>
                  <div className="stat-value">
                    {currentUser.battle_logs.length === 0
                      ? "-"
                      : (
                          (currentUser.battle_logs.filter(
                            (log) => log.result === true
                          ).length /
                            currentUser.battle_logs.length) *
                          100
                        ).toFixed(2)}
                    %
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">魔王戦</div>
                  <div className="stat-value">
                    {currentUser.boss_battle_logs.length}回
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">アバター生成</div>
                  <div className="stat-value">
                    {currentUser.avatars.length - 1}回
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ここまで所持品とアバター */}
      </div>
      {/* 活動報告 */}
      <div className="bg-base-200 bg-opacity-60 mt-4 p-4 rounded-lg">
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
          <a
            role="tab"
            className={`tab ${activitiesTab === "chart" ? "tab-active" : ""}`}
            onClick={() => setActivitiesTab("chart")}
          >
            活動推移グラフ
          </a>
        </div>
        {activitiesTab === "entry" && (
          <ActivityEntry
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
        {activitiesTab === "show" && (
          <ActivityShow activities={currentUser.activities} />
        )}
        {activitiesTab === "chart" && <LineChart currentUser={currentUser} />}
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
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleTweet(selectedAvatar.avatar_url, FRONT_URL)
                  }
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
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={() => handleAvatarUpdate(selectedAvatar.avatar_url)}
                >
                  メインアバターにする
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
      {/* ここまでアバターモーダル */}

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
      {/*　ここまでステータスモーダル */}
      {/* アイテムモーダル */}
      {isItemDirectoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-4xl w-full h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">道具袋</h2>
              <button
                className="btn btn-sm btn-circle"
                onClick={closeItemDirectoryModal}
              >
                ✕
              </button>
            </div>
            <ItemDirectory />
          </div>
        </div>
      )}
      {/*　ここまでアイテムモーダル */}
      {/* エネミーモーダル */}
      {isEnemyDirectoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-4xl w-full h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">エネミー図鑑</h2>
              <button
                className="btn btn-sm btn-circle"
                onClick={closeEnemyDirectoryModal}
              >
                ✕
              </button>
            </div>
            <EnemyDirectory />
          </div>
        </div>
      )}
      {/*　ここまでエネミーモーダル */}
      {/* アバターモーダル */}
      {isAvatarDirectoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-60 z-50">
          <div className="bg-base-100 p-4 rounded-lg max-w-4xl w-full h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">アバターリスト</h2>
              <button
                className="btn btn-sm btn-circle"
                onClick={closeAvatarDirectoryModal}
              >
                ✕
              </button>
            </div>
            <AvatarDirectory />
          </div>
        </div>
      )}
      {/*　ここまでアバターーモーダル */}
    </div>
  );
};

export default MyPage;
