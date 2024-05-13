import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import ActivityEntry from "../components/ActivityEntry";
import ActivityShow from "../components/ActivityShow";
import { API_URL } from "../config/settings";

export const MyPage = () => {
  const { currentUser: authUser, token } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState("");
  const [activeTab, setActiveTab] = useState("entry");
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllAvatars, setShowAllAvatars] = useState(false);

  useEffect(() => {
    setCurrentUser(authUser);
    setEditedNickname(authUser?.nickname || "");
    setEditedProfile(authUser?.profile || "");
  }, [authUser]);

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
      console.error("Error updating nickname:", error);
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
      console.error("Error updating profile:", error);
    }
  };

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }
  console.log(currentUser);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">マイページ</h1>
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
          <Link to={`/create_avatar`} className="btn btn-accent w-full">
            アバター変更
          </Link>
        </div>
        {/* ステータス */}
        {currentUser.latest_status && (
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">ステータス</h2>
            <p>Level: {currentUser.latest_status.level}</p>
            <p>HP: {currentUser.latest_status.hp}</p>
            <p>体力: {currentUser.latest_status.strength}</p>
            <p>知力: {currentUser.latest_status.intelligence}</p>
            <p>精神: {currentUser.latest_status.wisdom}</p>
            <p>素速さ: {currentUser.latest_status.dexterity}</p>
            <p>カリスマ: {currentUser.latest_status.charisma}</p>
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
              className={`tab ${activeTab === "items" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("items")}
            >
              所持品
            </a>
            <a
              role="tab"
              className={`tab ${activeTab === "avatars" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("avatars")}
            >
              アバター
            </a>
          </div>
          {activeTab === "items" ? (
            <>
              <h2 className="text-xl font-bold mb-4 cursor-pointer">所持品</h2>
              {currentUser.users_items.length > 0 ? (
                <>
                  <div className="flex flex-col divide-y divide-base-300">
                    {currentUser.users_items
                      .slice(
                        0,
                        showAllItems ? currentUser.users_items.length : 5
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
                  {currentUser.users_items.length > 5 && (
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
                      .slice(0, showAllAvatars ? currentUser.avatars.length : 9)
                      .map((avatar) => (
                        <img
                          key={avatar.id}
                          src={`${avatar.avatar_url}`}
                          alt="User Avatar"
                          className="w-full h-auto rounded"
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
                <div className="h-40 flex items-center justify-center">
                  <p className="text-lg">データがありません</p>
                </div>
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
            className={`tab ${activeTab === "entry" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("entry")}
          >
            今日の活動登録
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "show" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("show")}
          >
            これまでの活動履歴
          </a>
        </div>
        {activeTab === "entry" ? (
          <ActivityEntry
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        ) : (
          <ActivityShow activities={currentUser.activities} />
        )}
      </div>
    </div>
  );
};
