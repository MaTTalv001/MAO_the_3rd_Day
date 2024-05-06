import React, { useState } from "react";
import { API_URL } from "../config/settings";
import { useAuth } from "../providers/auth";

const categories = [
  {
    id: 1,
    name: "運動",
    description: "トレーニングやスポーツなど。体力を向上させます",
  },
  {
    id: 2,
    name: "学習",
    description: "学問やプログラミング学習など。知力を向上させます",
  },
  {
    id: 3,
    name: "仕事",
    description: "アルバイトや業務など。素早さを向上させます",
  },
  {
    id: 4,
    name: "親交",
    description: "家族や友人、恋人との時間。精神を向上させます",
  },
  {
    id: 5,
    name: "娯楽",
    description: "趣味や遊びなど。カリスマを向上させます",
  },
];

const ActivityEntry = () => {
  const { currentUser, token } = useAuth();
  const [activities, setActivities] = useState([
    { action: "", minute: 0, category_id: "" },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleContentChange = (index, event) => {
    const newActivities = [...activities];
    newActivities[index].content = event.target.value;
    setActivities(newActivities);
  };

  const handleDurationChange = (index, event) => {
    const newActivities = [...activities];
    newActivities[index].duration = event.target.value;
    setActivities(newActivities);
  };

  const handleCategoryChange = (index, category) => {
    const newActivities = [...activities];
    newActivities[index].category = category;
    setActivities(newActivities);
  };

  const addActivity = () => {
    setActivities([...activities, { content: "", duration: 0, category: "" }]);
  };

  const handleSubmit = async () => {
    try {
      for (const activity of activities) {
        const category = categories.find(
          (cat) => cat.name === activity.category
        );
        const response = await fetch(`${API_URL}/api/v1/activities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activity: {
              action: activity.content,
              minute: activity.duration,
              category_id: category ? category.id : null,
              user_id: currentUser.id,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Activity creation failed");
        }
      }
      // 成功した場合のフォームのクリア
      setActivities([{ action: "", minute: 0, category_id: "" }]);
    } catch (error) {
      console.error("Error creating activities:", error);
    }
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">活動登録</h2>
      {activities.map((activity, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">{index + 1}.</span>
            <div
              className="relative tooltip w-full"
              data-tip="活動内容を入力してください（50字以内）"
            >
              <input
                type="text"
                value={activity.content}
                onChange={(event) => handleContentChange(index, event)}
                placeholder="活動内容（50字以内）"
                className="input input-bordered w-full"
                maxLength={50}
              />
            </div>
          </div>
          <div
            className="flex items-center mb-2 relative tooltip"
            data-tip="活動時間を指定してください（0〜600分）"
          >
            <input
              type="range"
              min="0"
              max="600"
              value={activity.duration}
              onChange={(event) => handleDurationChange(index, event)}
              className="range range-primary mr-2"
            />
            <span>{activity.duration}分</span>
          </div>
          <div className="flex justify-around relative mx-20">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative tooltip"
                data-tip={category.description}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleCategoryChange(index, category.name)}
                  className={`btn ${
                    activity.category === category.name
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addActivity} className="btn btn-secondary mb-4">
        + 活動を追加
      </button>
      <button onClick={handleSubmit} className="btn btn-primary w-full">
        送信
      </button>
    </div>
  );
};

export default ActivityEntry;
