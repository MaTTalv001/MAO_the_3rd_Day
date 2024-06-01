import { API_URL } from "../config/settings";

export const saveBattleLog = async (currentUser, enemy, token, result) => {
  if (!currentUser || !enemy) return;
  try {
    const response = await fetch(`${API_URL}/api/v1/battle_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: currentUser.id,
        enemy_id: enemy.id,
        result: result,
      }),
    });
    if (!response.ok) {
      throw new Error("バトルログの保存に失敗しました");
    }
    const newLog = await response.json();
    return newLog;
  } catch (error) {
    console.error("バトルログの保存に失敗しました:", error);
    throw error;
  }
};
