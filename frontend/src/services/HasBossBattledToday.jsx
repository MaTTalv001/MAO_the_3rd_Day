//今日のボス討伐が完了しているかを判定する関数
import { useState, useEffect } from "react";

export const useHasBossedToday = (currentUser) => {
  const [hasBossedToday, setHasBossedToday] = useState(false);

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
      setHasBossedToday(todayBossBattles.length > 0);
    }
  }, [currentUser]);

  return hasBossedToday;
};