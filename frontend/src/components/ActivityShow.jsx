import React from "react";

const ActivityShow = ({ activities }) => {
  return (
    <div className="bg-base-200 mt-4 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">活動記録</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className="mb-4">
              <div className="bg-base-300 p-4 rounded-lg">
                <h3 className="text-lg font-bold">{activity.action}</h3>
                <p className="text-gray-500">{activity.category.name}</p>
                <div className="mt-2">
                  <span className="text-blue-500">{activity.minute}分</span>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>活動記録がありません</p>
      )}
    </div>
  );
};

export default ActivityShow;
