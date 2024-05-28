import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { BackGround } from "../config/background";
import GameLog from "../components/GameLog";
import { Link } from "react-router-dom";
import { gainCoins } from "../services/GainCoins"; //コイン獲得メソッド
import { calculateDamage } from "../services/DamageCalculator"; //ダメージ計算メソッド

//Battleコンポーネント
export const Battle = () => {
  const { currentUser, token, setCurrentUser } = useAuth(); // 認証情報の取得
  const [enemy, setEnemy] = useState(null); // 敵情報の状態管理
  const [playerHP, setPlayerHP] = useState(null); // プレイヤーHPの状態管理
  const [enemyHP, setEnemyHP] = useState(null); // 敵HPの状態管理
  const [gameLog, setGameLog] = useState(["モンスターが現れた！"]); // ゲームログの状態管理
  const [isAttacking, setIsAttacking] = useState(false); // 攻撃中かどうかの状態管理
  const [showRestart, setShowRestart] = useState(false); // 再スタートボタン表示の状態管理
  const [gameOver, setGameOver] = useState(false); // ゲームオーバー状態の管理
  const [attackTimeoutId, setAttackTimeoutId] = useState(null); // 攻撃タイムアウトIDの管理
  const [background, setBackground] = useState(null); // 背景の状態管理
  const [gainedCoins, setGainedCoins] = useState(null); // 獲得したコインの状態管理
  const [hasBattledToday, setHasBattledToday] = useState(false); // 本日のバトル実施状況の管理

  // 初回レンダリング時に敵データを取得
  useEffect(() => {
    fetch(`${API_URL}/api/v1/enemies/random`)
      .then((response) => response.json())
      .then((data) => {
        setEnemy(data);
        setEnemyHP(data.hp);
      })
      .catch((error) =>
        console.error("エネミーデータ取得に失敗しました:", error)
      );
  }, []);

  // ログインユーザーのバトルログをチェックして本日バトルしたかどうかを設定
  useEffect(() => {
    if (currentUser && currentUser.battle_logs) {
      const today = new Date();
      // currentUserのバトルログから、本日行われたバトルをフィルタリング
      const todayBattles = currentUser.battle_logs.filter((log) => {
        const logDate = new Date(log.created_at); // 各バトルログの日付を取得
        return (
          // バトルログの日付が今日の日付と同じかどうかをチェック
          logDate.getFullYear() === today.getFullYear() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getDate() === today.getDate()
        );
      });
      // 今日行われたバトルが一つ以上あれば、hasBattledTodayをtrueに設定
      setHasBattledToday(todayBattles.length > 0);
    }
  }, [currentUser]);

  // 背景をランダムに設定
  useEffect(() => {
    const backgroundKeys = Object.keys(BackGround);
    const randomKey =
      backgroundKeys[Math.floor(Math.random() * backgroundKeys.length)];
    setBackground(BackGround[randomKey]);
  }, []);

  // ログインユーザーの最新ステータスからHPを設定
  useEffect(() => {
    if (currentUser) {
      setPlayerHP(currentUser.latest_status.hp);
    }
  }, [currentUser]);

  // バトルログを保存
  const saveBattleLog = async (result) => {
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
      setCurrentUser((prevUser) => ({
        ...prevUser,
        battle_logs: [...prevUser.battle_logs, newLog],
      }));
    } catch (error) {
      console.error("バトルログの保存に失敗しました:", error);
    }
  };

  // 攻撃処理
  const attack = (attackType) => {
    if (gameOver) return;

    setGameLog([]);
    setIsAttacking(true);

    //ダメージ計算式を呼び出す
    const { finalPlayerDamage, finalEnemyDamage } = calculateDamage(
      attackType,
      currentUser.latest_status,
      enemy
    );

    const playerGoesFirst = Math.random() < 0.5;
    const doubleAttackChance = currentUser.latest_status.dexterity / 100;

    setTimeout(() => {
      if (gameOver) return;

      if (playerGoesFirst) {
        setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage));
        setGameLog((prevLog) => [
          ...prevLog,
          `${currentUser.nickname}の${
            attackType === "attack"
              ? "攻撃"
              : attackType === "magic1"
              ? "まほう（炎）"
              : attackType === "magic2"
              ? "まほう(氷)"
              : attackType === "power"
              ? "渾身"
              : "リミット技"
          }、${finalPlayerDamage}のダメージ`,
        ]);

        let totalDamage = finalPlayerDamage;

        if (Math.random() < doubleAttackChance) {
          const doubleAttackDamage = finalPlayerDamage;
          setEnemyHP(
            Math.max(0, enemyHP - finalPlayerDamage - doubleAttackDamage)
          );
          setGameLog((prevLog) => [
            ...prevLog,
            `${currentUser.nickname}の2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`,
          ]);
          totalDamage += doubleAttackDamage;
        }

        if (enemyHP - totalDamage <= 0) {
          setGameLog([`${enemy.name}をたおした`]);
          saveBattleLog(true); // 勝利を保存
          const amounts = [10, 20, 30];
          const amount = amounts[Math.floor(Math.random() * amounts.length)];
          gainCoins(
            currentUser,
            token,
            amount,
            setCurrentUser,
            setGainedCoins,
            setGameLog
          ); // 金貨を獲得
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      } else {
        setPlayerHP(Math.max(0, playerHP - finalEnemyDamage));
        setGameLog((prevLog) => [
          ...prevLog,
          `${enemy.name}の攻撃、${finalEnemyDamage}のダメージ`,
        ]);
        triggerShakeEffect();
        if (playerHP - finalEnemyDamage <= 0) {
          setGameLog(["全滅した"]);
          saveBattleLog(false); // 敗北を保存
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      }

      const timeoutId = setTimeout(() => {
        if (gameOver) return;

        if (playerGoesFirst) {
          if (enemyHP > 0) {
            setPlayerHP(Math.max(0, playerHP - finalEnemyDamage));
            setGameLog((prevLog) => [
              ...prevLog,
              `${enemy.name}の攻撃、${finalEnemyDamage}のダメージ`,
            ]);
            triggerShakeEffect();
            if (playerHP - finalEnemyDamage <= 0) {
              setGameLog(["全滅した"]);
              saveBattleLog(false); // 敗北を保存
              setShowRestart(true);
              setGameOver(true);
              setIsAttacking(false);
              return;
            }
          }
        } else {
          setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage));
          setGameLog((prevLog) => [
            ...prevLog,
            `${currentUser.nickname}の${
              attackType === "attack"
                ? "攻撃"
                : attackType === "magic1"
                ? "まほう（炎）"
                : attackType === "magic2"
                ? "まほう(氷)"
                : attackType === "power"
                ? "渾身"
                : "リミット技"
            }、${finalPlayerDamage}のダメージ`,
          ]);

          let totalDamage = finalPlayerDamage;

          if (Math.random() < doubleAttackChance) {
            const doubleAttackDamage = finalPlayerDamage;
            setEnemyHP(
              Math.max(0, enemyHP - finalPlayerDamage - doubleAttackDamage)
            );
            setGameLog((prevLog) => [
              ...prevLog,
              `${currentUser.nickname}の2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`,
            ]);
            totalDamage += doubleAttackDamage;
          }

          if (enemyHP - totalDamage <= 0) {
            setGameLog([`${enemy.name}をたおした`]);
            saveBattleLog(true); // 勝利を保存
            const amounts = [10, 20, 30];
            const amount = amounts[Math.floor(Math.random() * amounts.length)];
            gainCoins(
              currentUser,
              token,
              amount,
              setCurrentUser,
              setGainedCoins,
              setGameLog
            ); // 金貨を獲得
            setShowRestart(true);
            setGameOver(true);
            setIsAttacking(false);
            return;
          }
        }
        setIsAttacking(false);
      }, 1000);

      setAttackTimeoutId(timeoutId);
    }, 1000);
  };

  // ゲームの再スタート（デバッグ用）
  const restartGame = () => {
    if (attackTimeoutId) {
      clearTimeout(attackTimeoutId);
    }
    setPlayerHP(currentUser.latest_status.hp);
    setEnemyHP(enemy.hp);
    setGameLog(["モンスターが現れた！"]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);
  };

  // 攻撃エフェクトのトリガー
  const triggerShakeEffect = () => {
    const body = document.body;
    body.classList.add("shake-animation");

    setTimeout(() => {
      body.classList.remove("shake-animation");
    }, 500);
  };

  // 初期状態が揃っていない場合のロード画面表示
  if (!currentUser || !enemy || playerHP === null || background === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  // 本日バトル済みの場合のメッセージ表示
  if (!gameOver && hasBattledToday) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">本日の討伐は終了しています</h2>
        <Link to="/mypage" className="btn btn-primary">
          マイページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-10">
      {/* 上部: グラフィックコンテナ */}
      <div
        className="bg-center mx-auto py-8 max-w-4xl"
        style={{
          backgroundImage: `url(${background.url})`,
          backgroundPosition: "center bottom",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="bg-base-200 p-4 rounded-box mb-4 inline-block text-center">
            <h2 className="text-2xl font-bold">{enemy.name}</h2>
            <p className="text-lg">HP: {enemyHP}</p>
          </div>
          <div
            className="aspect-w-1 aspect-h-1 mx-auto"
            style={{ maxWidth: "300px" }}
          >
            <img
              src={enemy.enemy_url}
              alt="Monster"
              className={`object-contain ${enemyHP <= 0 ? "opacity-0" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
          <div
            className={`bg-base-200 p-4 rounded-box ${
              playerHP <= 0 ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center mb-4">
              <img
                src={currentUser.current_avatar_url}
                alt="Player"
                className="w-16 h-16 rounded-xl mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{currentUser.nickname}</h2>
                <p className="text-lg">HP: {playerHP}</p>
              </div>
            </div>
            {/* コマンドボタン */}
            <div className="flex space-x-2">
              <button
                className={`btn btn-primary w-1/2 tooltip ${
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("attack")}
                data-tip="筋力依存の物理攻撃"
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "たたかう"}
              </button>

              <button
                className={`btn btn-primary w-1/2 tooltip${
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("power")}
                data-tip="筋力依存の物理攻撃。ブレ幅が大きい一振り"
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "渾身"}
              </button>
            </div>

            <div className="flex space-x-2 pt-3">
              <button
                className={`btn btn-primary w-1/2 tooltip${
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("magic1")}
                data-tip="知力依存の魔法攻撃。エネミーの防御による減衰を受けにくい"
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "まほう（炎）"}
              </button>

              <button
                className={`btn btn-primary w-1/2 tooltip${
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("magic2")}
                data-tip="知力依存の魔法攻撃。減衰を受けにくく、かつブレ幅が大きい"
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "まほう（氷）"}
              </button>
            </div>

            {playerHP <= 33 && (
              <div className="flex space-x-2 pt-3">
                <button
                  className={`btn btn-warning w-full tooltip${
                    isAttacking || playerHP <= 0 || enemyHP <= 0
                      ? "loading loading-ring loading-sm btn-disabled"
                      : ""
                  }`}
                  onClick={() => attack("limit")}
                  data-tip="瀕死の一撃。筋力と知力を解き放つ"
                  disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
                >
                  {isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "たたかえない！"
                    : "リミット"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-box md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">モンスター討伐</h2>
            <GameLog
              logs={gameLog}
              isPlayerDefeated={playerHP <= 0}
              showMyPageLink={gameOver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
