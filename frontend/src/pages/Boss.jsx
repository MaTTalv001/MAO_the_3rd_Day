import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { BackGround } from "../config/background";
import GameLog from "../components/GameLog";
import { Link } from "react-router-dom";

export const Boss = () => {
  const { currentUser, token, setCurrentUser } = useAuth();
  const [boss, setBoss] = useState(null);
  const [playerHP, setPlayerHP] = useState(null);
  const [bossHP, setBossHP] = useState(null);
  const [gameLog, setGameLog] = useState(["魔王が現れた！"]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [attackTimeoutId, setAttackTimeoutId] = useState(null);
  const [background, setBackground] = useState(null);
  const [gainedCoins, setGainedCoins] = useState(null);
  const [turnsLeft, setTurnsLeft] = useState(5);
  const [totalDamage, setTotalDamage] = useState(0);
  const [battleChecked, setBattleChecked] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/bosses/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBoss(data);
        if (data && data.id) {
          fetch(
            `${API_URL}/api/v1/boss_battle_logs?user_id=${currentUser.id}&boss_id=${data.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((logs) => {
              if (Array.isArray(logs)) {
                const accumulatedDamage = logs.reduce(
                  (acc, log) => acc + log.damage_dealt,
                  0
                );
                setBossHP(data.hp - accumulatedDamage);
              } else {
                setBossHP(data.hp);
              }
            });
        }
      })
      .catch((error) => console.error("Error fetching boss:", error));
  }, [currentUser, token]);

  useEffect(() => {
    const backgroundKeys = Object.keys(BackGround);
    const randomKey =
      backgroundKeys[Math.floor(Math.random() * backgroundKeys.length)];
    setBackground(BackGround[randomKey]);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setPlayerHP(currentUser.latest_status.hp);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.boss_battle_logs && !battleChecked) {
      const today = new Date().toISOString().slice(0, 10);
      const hasTodaysBattleLog = currentUser.boss_battle_logs.some((log) => {
        return log.created_at.slice(0, 10) === today;
      });
      if (hasTodaysBattleLog) {
        setGameOver(true);
      }
      setBattleChecked(true);
    }
  }, [currentUser, battleChecked]);

  useEffect(() => {
    if (currentUser && currentUser.boss_battle_logs && !battleChecked) {
      const today = new Date().toISOString().slice(0, 10);
      const hasTodaysBattleLog = currentUser.boss_battle_logs.some((log) => {
        return log.created_at.slice(0, 10) === today;
      });
      if (hasTodaysBattleLog) {
        setGameOver(true);
      }
      setBattleChecked(true);
    }
  }, [currentUser, battleChecked]);

  const saveBattleLog = async (result, damage) => {
    if (!currentUser || !boss) return;
    try {
      const response = await fetch(`${API_URL}/api/v1/boss_battle_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          boss_id: boss.id,
          damage_dealt: damage,
          result: result,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save battle log");
      }
      if (result) {
        setTotalDamage(0);
      }
    } catch (error) {
      console.error("Error saving battle log:", error);
    }
  };

  const gainCoins = async (amount) => {
    console.log("gainCoins called with amount:", amount);
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
        console.log("API response:", data);
        setCurrentUser(data.user);
        setGainedCoins(data.gained_coins);
        setGameLog((prevLog) => [
          ...prevLog,
          `${data.gained_coins}枚の金貨を得た！`,
        ]);
      } else {
        console.error("Failed to gain coins");
      }
    } catch (error) {
      console.error("Error gaining coins:", error);
    }
  };

  const attack = (attackType) => {
    if (gameOver) return;

    setGameLog([]);
    setIsAttacking(true);

    const playerAttack =
      Math.floor(
        Math.random() * ((currentUser.latest_status.strength + 10) * 2)
      ) + 1;
    const playerMagic =
      Math.floor(
        Math.random() * ((currentUser.latest_status.intelligence + 10) * 2)
      ) + 1;
    const playerDamage =
      attackType === "attack"
        ? playerAttack - Math.floor(boss.defence / 3)
        : playerMagic - Math.floor(boss.defence / 2);
    const finalPlayerDamage = playerDamage < 1 ? 1 : playerDamage;

    const enemyAttack = Math.floor(Math.random() * (boss.attack * 2)) + 1;
    const playerDefence = Math.floor(
      currentUser.latest_status.strength * 0.3 +
        currentUser.latest_status.wisdom * 0.5
    );
    const enemyDamage = enemyAttack - playerDefence;
    const finalEnemyDamage = enemyDamage < 1 ? 1 : enemyDamage;

    const playerGoesFirst = Math.random() < 0.5;
    const doubleAttackChance = currentUser.latest_status.dexterity / 100;

    setTimeout(() => {
      if (gameOver) return;

      let turnDamage = 0;

      if (playerGoesFirst) {
        setBossHP((prevHP) => Math.max(0, prevHP - finalPlayerDamage));
        turnDamage = finalPlayerDamage;
        setGameLog((prevLog) => [
          ...prevLog,
          `${currentUser.nickname}の${
            attackType === "attack" ? "攻撃" : "まほう"
          }、${finalPlayerDamage}のダメージ`,
        ]);

        if (Math.random() < doubleAttackChance) {
          const doubleAttackDamage = finalPlayerDamage;
          setBossHP((prevHP) =>
            Math.max(0, prevHP - finalPlayerDamage - doubleAttackDamage)
          );
          turnDamage += doubleAttackDamage;
          setGameLog((prevLog) => [
            ...prevLog,
            `${currentUser.nickname}の2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`,
          ]);
        }

        setTotalDamage((prevDamage) => prevDamage + turnDamage);

        if (bossHP - turnDamage <= 0) {
          setGameLog([`${boss.name}をたおした`]);
          saveBattleLog(true, totalDamage + turnDamage); // 勝利を保存
          gainCoins(300); // 勝利の報酬を獲得
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      } else {
        setPlayerHP((prevHP) => Math.max(0, prevHP - finalEnemyDamage));
        setGameLog((prevLog) => [
          ...prevLog,
          `${boss.name}の攻撃、${finalEnemyDamage}のダメージ`,
        ]);
        triggerShakeEffect();
        if (playerHP - finalEnemyDamage <= 0) {
          setTotalDamage((prevDamage) => prevDamage + finalEnemyDamage);
          setGameLog(["全滅した"]);
          saveBattleLog(false, totalDamage + finalEnemyDamage); // 敗北を保存、ダメージを送信
          gainCoins([100, 200, 300][Math.floor(Math.random() * 3)]); // 敗北の報酬を獲得
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      }

      const timeoutId = setTimeout(() => {
        if (gameOver) return;

        if (playerGoesFirst) {
          if (bossHP > 0) {
            setPlayerHP((prevHP) => Math.max(0, prevHP - finalEnemyDamage));
            setGameLog((prevLog) => [
              ...prevLog,
              `${boss.name}の攻撃、${finalEnemyDamage}のダメージ`,
            ]);
            triggerShakeEffect();
            if (playerHP - finalEnemyDamage <= 0) {
              setTotalDamage((prevDamage) => prevDamage + finalEnemyDamage);
              setGameLog(["全滅した"]);
              saveBattleLog(false, totalDamage + finalEnemyDamage); // 敗北を保存、ダメージを送信
              gainCoins([100, 200, 300][Math.floor(Math.random() * 3)]); // 敗北の報酬を獲得
              setShowRestart(true);
              setGameOver(true);
              setIsAttacking(false);
              return;
            }
          }
        } else {
          setBossHP((prevHP) => Math.max(0, prevHP - finalPlayerDamage));
          turnDamage = finalPlayerDamage;
          setGameLog((prevLog) => [
            ...prevLog,
            `${currentUser.nickname}の${
              attackType === "attack" ? "攻撃" : "まほう"
            }、${finalPlayerDamage}のダメージ`,
          ]);

          if (Math.random() < doubleAttackChance) {
            const doubleAttackDamage = finalPlayerDamage;
            setBossHP((prevHP) =>
              Math.max(0, prevHP - finalPlayerDamage - doubleAttackDamage)
            );
            turnDamage += doubleAttackDamage;
            setGameLog((prevLog) => [
              ...prevLog,
              `${currentUser.nickname}の2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`,
            ]);
          }

          setTotalDamage((prevDamage) => prevDamage + turnDamage);

          if (bossHP - turnDamage <= 0) {
            setGameLog([`${boss.name}をたおした`]);
            saveBattleLog(true, totalDamage + turnDamage); // 勝利を保存
            gainCoins(3000); // 勝利の報酬を獲得
            setShowRestart(true);
            setGameOver(true);
            setIsAttacking(false);
            return;
          }
        }

        setTurnsLeft((prevTurns) => prevTurns - 1);

        if (turnsLeft - 1 <= 0) {
          setTotalDamage((prevDamage) => prevDamage + turnDamage); // 最後のダメージを加算
          setGameLog(["魔王は去りました。与えたダメージは次回に引き継ぎます"]);
          saveBattleLog(false, totalDamage + turnDamage); // 敗北を保存、ダメージを送信
          // 敗北の報酬を獲得
          const amounts = [100, 200, 300];
          const amount = amounts[Math.floor(Math.random() * amounts.length)];
          gainCoins(amount);
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }

        setIsAttacking(false);
      }, 1000);

      setAttackTimeoutId(timeoutId);
    }, 1000);
  };

  const restartGame = () => {
    if (attackTimeoutId) {
      clearTimeout(attackTimeoutId);
    }
    setPlayerHP(currentUser.latest_status.hp);
    setBossHP(boss.hp); // リスタート時にボスHPをリセット
    setGameLog(["魔王が現れた！"]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);
    setTurnsLeft(5);
    setTotalDamage(0); // リスタート時に合計ダメージをリセット
  };

  const triggerShakeEffect = () => {
    const body = document.body;
    body.classList.add("shake-animation");

    setTimeout(() => {
      body.classList.remove("shake-animation");
    }, 500);
  };

  if (!currentUser || !boss || playerHP === null || background === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (gameOver && !showRestart) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">次回の魔王戦に備えましょう</h2>
        <Link to="/mypage" className="btn btn-primary">
          マイページへ
        </Link>
      </div>
    );
  }

  return (
    <div data-theme="dark" className="min-h-screen bg-base-100 py-10">
      {/* 上部: グラフィックコンテナ */}
      <div
        className="bg-center mx-auto py-8 max-w-4xl"
        style={{
          backgroundImage: `url("/imgs/bg/boss_bg001.jpg")`,
          backgroundPosition: "center bottom",
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className={`bg-base-200 p-4 rounded-box mb-4 inline-block text-center ${
              gameOver ? "opacity-0" : ""
            }`}
            style={{ visibility: gameOver ? "hidden" : "visible" }}
          >
            <h2 className="text-2xl font-bold">{boss.name}</h2>
            <p className="text-lg">HP: {bossHP}</p>
            <p className="text-lg">残りターン: {turnsLeft}</p>
          </div>
          <div
            className="aspect-w-1 aspect-h-1 mx-auto"
            style={{ maxWidth: "300px" }}
          >
            <img
              src={boss.boss_url}
              alt="Boss"
              className={`object-contain ${gameOver ? "opacity-0" : ""}`}
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
                src={currentUser.latest_avatar_url}
                alt="Player"
                className="w-16 h-16 rounded-xl mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{currentUser.nickname}</h2>
                <p className="text-lg">HP: {playerHP}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`btn btn-primary btn-block ${
                  isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("attack")}
                disabled={
                  isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                }
              >
                {isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                  ? "たたかえない！"
                  : "たたかう"}
              </button>
            </div>
            <div className="flex space-x-2 pt-3">
              <button
                className={`btn btn-primary btn-block ${
                  isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("magic")}
                disabled={
                  isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                }
              >
                {isAttacking || playerHP <= 0 || bossHP <= 0 || gameOver
                  ? "たたかえない！"
                  : "まほう"}
              </button>
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-box md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">魔王バトル</h2>
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
export default Boss;
