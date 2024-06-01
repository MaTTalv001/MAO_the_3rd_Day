//今日の討伐が完了しているかを判定する関数
import { useState, useEffect } from "react";

export const useHasBattledToday = (currentUser) => {
  const [hasBattledToday, setHasBattledToday] = useState(false);

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

  return hasBattledToday;
};
