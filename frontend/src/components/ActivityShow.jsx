import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ActivityShow = ({ activities }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // 一日につき一つのイベントだけを生成
  const events = activities.reduce((acc, activity) => {
    const dateKey = moment(activity.created_at).format("YYYY-MM-DD");
    if (!acc[dateKey]) {
      acc[dateKey] = {
        title: "Action",
        start: moment(activity.created_at).startOf("day").toDate(),
        end: moment(activity.created_at).endOf("day").toDate(),
        allDay: true,
      };
    }
    return acc;
  }, {});

  const handleSelectEvent = (event) => {
    const dateStr = moment(event.start).format("YYYY-MM-DD");
    const selectedDateActivities = activities.filter(
      (activity) => moment(activity.created_at).format("YYYY-MM-DD") === dateStr
    );
    setSelectedDate({ date: event.start, activities: selectedDateActivities });
  };

  const handleSelectSlot = ({ start }) => {
    const selectedDateActivities = activities.filter(
      (activity) =>
        moment(activity.created_at).format("YYYY-MM-DD") ===
        moment(start).format("YYYY-MM-DD")
    );
    if (selectedDateActivities.length > 0) {
      setSelectedDate({ date: start, activities: selectedDateActivities });
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const Event = ({ event }) => (
    <div className="bg-primary text-primary-content p-1 rounded-lg">
      <i className="fas fa-check"></i> {event.title}
    </div>
  );

  const components = {
    event: Event,
  };

  return (
    <div className="bg-base-200 mt-4 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">活動記録</h2>
      <Calendar
        localizer={localizer}
        events={Object.values(events)}
        style={{ height: 400 }}
        views={["month"]}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        components={components}
      />
      {selectedDate && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {moment(selectedDate.date).format("YYYY-MM-DD")}の活動
            </h3>
            <ul className="py-4">
              {selectedDate.activities.map((activity) => (
                <li key={activity.id}>
                  {activity.action} - {activity.category.name} -{" "}
                  {activity.minute}分
                </li>
              ))}
            </ul>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityShow;
