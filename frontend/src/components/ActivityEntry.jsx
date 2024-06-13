import React, { useState } from "react";
import { API_URL } from "../config/settings";
import { useAuth } from "../providers/auth";

const categories = [
  {
    id: 1,
    name: "運動",
    description: "トレーニングやスポーツなど。筋力を向上させます",
  },
  {
    id: 2,
    name: "学習",
    description: "学問やプログラミング学習など。知力を向上させます",
  },
  {
    id: 3,
    name: "親交",
    description: "家族や友人、恋人との時間。精神を向上させます",
  },
  {
    id: 4,
    name: "仕事",
    description: "アルバイトや業務など。敏捷を向上させます",
  },
  {
    id: 5,
    name: "娯楽",
    description: "趣味や遊びなど。魅力を向上させます",
  },
];

const ActivityEntry = ({ currentUser, setCurrentUser, todayActivities }) => {
  const { token } = useAuth();
  const today = new Date();
  const dateString = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;
  const [activity, setActivity] = useState({
    action: "",
    duration: 0,
    category_id: "",
  });
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleContentChange = (event) => {
    setActivity({ ...activity, action: event.target.value });
  };

  const handleDurationChange = (event) => {
    setActivity({ ...activity, duration: event.target.value });
  };

  const handleCategoryChange = (category) => {
    setActivity({ ...activity, category_id: category.id });
  };

  const [gainedCoins, setGainedCoins] = useState(null); // 獲得したコインの状態管理
  const [gameLog, setGameLog] = useState([""]); // ゲームログの状態管理

  const handleSubmit = async () => {
    try {
      const amounts = [10, 20, 30];
      const base_amount = amounts[Math.floor(Math.random() * amounts.length)];

      const response = await fetch(`${API_URL}/api/v1/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activity: {
            action: activity.action,
            minute: activity.duration,
            category_id: activity.category_id,
          },
          user_status: {
            job_id: currentUser.latest_status.job_id,
            level: currentUser.latest_status.level + 1,
            hp: currentUser.latest_status.hp + 5,
            strength:
              currentUser.latest_status.strength +
              (activity.category_id === 1 ? 1 : 0),
            intelligence:
              currentUser.latest_status.intelligence +
              (activity.category_id === 2 ? 1 : 0),
            wisdom:
              currentUser.latest_status.wisdom +
              (activity.category_id === 3 ? 1 : 0),
            dexterity:
              currentUser.latest_status.dexterity +
              (activity.category_id === 4 ? 1 : 0),
            charisma:
              currentUser.latest_status.charisma +
              (activity.category_id === 5 ? 1 : 0),
          },
          base_amount: base_amount,
        }),
      });

      if (!response.ok) {
        throw new Error("活動の登録に失敗しました");
      }

      const data = await response.json();
      const createdActivity = data.activity;
      const gainedCoins = data.gained_coins;

      setActivity({ action: "", duration: 0, category_id: "" });

      const userResponse = await fetch(
        `${API_URL}/api/v1/users/${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = await userResponse.json();
      setCurrentUser(updatedUser);

      let message = "ステータスが向上しました！";
      if (gainedCoins) {
        message += ` ${gainedCoins}枚の金貨を獲得しました！`;
      }
      if (updatedUser.special_mode_unlocked) {
        message += " 魔王が現れた！";
      }

      setModalMessage(message);
      setShowModal(true);
    } catch (error) {
      console.error("ユーザーステータスの更新に失敗しました:", error);
    }
  };

  const isActivityLimitReached = todayActivities.length >= 3;

  const availableCategories = categories.filter(
    (category) =>
      !todayActivities.some((activity) => activity.category.id === category.id)
  );

  return (
    <div
      className={`bg-base-200 p-4 rounded-lg ${
        isActivityLimitReached ? "bg-black text-white" : ""
      }`}
    >
      <h2 className="text-xl font-bold mb-1">
        {dateString}の活動記録 (残り：{3 - todayActivities.length})
      </h2>
      <p className="text-md mb-5">活動を記録してステータスを向上させましょう</p>
      {isActivityLimitReached ? (
        <p>本日の活動上限に達成しました。</p>
      ) : (
        <div>
          <div className="flex items-center mb-2">
            <div
              className="relative tooltip w-full"
              data-tip="活動内容や所感などを自由に入力してください（50字以内）"
            >
              <input
                type="text"
                value={activity.action}
                onChange={handleContentChange}
                placeholder="活動内容（50字以内）"
                className="input input-bordered w-full"
                maxLength={50}
              />
            </div>
          </div>
          <div
            className="flex items-center mb-2 relative tooltip"
            data-tip="活動時間を指定してください（0〜600分）　長さはステータスの上昇度に影響しません"
          >
            <input
              type="range"
              min="0"
              max="600"
              step="10"
              value={activity.duration}
              onChange={(event) => {
                const roundedValue = Math.round(event.target.value / 10) * 10;
                setActivity({ ...activity, duration: roundedValue });
              }}
              className="range range-primary mr-2"
            />
            <span>{activity.duration}分</span>
          </div>
          <div className="my-2">各カテゴリ1日1回まで記録可能</div>
          <div className="flex justify-around relative mx-20">
            {availableCategories.map((category) => (
              <div
                key={category.name}
                className="relative tooltip"
                data-tip={category.description}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleCategoryChange(category)}
                  className={`btn ${
                    activity.category_id === category.id
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full mt-4"
          >
            記録
          </button>
        </div>
      )}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">活動の記録</h3>
            <p className="py-4">{modalMessage}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityEntry;
