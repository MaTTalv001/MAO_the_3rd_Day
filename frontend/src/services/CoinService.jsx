//金貨獲得コンポーネント
import { API_URL } from "../config/settings";

export const gainCoins = async (
  currentUser,
  token,
  amount,
  setCurrentUser,
  setGainedCoins,
  setGameLog
) => {
  if (!currentUser) return;
  try {
    const response = await fetch(
      `${API_URL}/api/v1/users/${currentUser.id}/gain_coins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base_amount: amount,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      setCurrentUser(data.user);
      setGainedCoins(data.gained_coins);
      setGameLog((prevLog) => [
        ...prevLog,
        `${data.gained_coins}枚の金貨を得た！`,
      ]);
    } else {
      console.error("金貨の獲得に失敗しました");
    }
  } catch (error) {
    console.error("金貨の獲得に失敗しました:", error);
  }
};
