import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { BackGround } from "../config/background";
import GameLog from "../components/GameLog";

export const Battle = () => {
  const { currentUser, token, setCurrentUser } = useAuth();
  const [enemy, setEnemy] = useState(null);
  const [playerHP, setPlayerHP] = useState(null);
  const [enemyHP, setEnemyHP] = useState(null);
  const [gameLog, setGameLog] = useState(["モンスターが現れた！"]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [attackTimeoutId, setAttackTimeoutId] = useState(null);
  const [background, setBackground] = useState(null);
  const [gainedCoins, setGainedCoins] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/enemies/random`)
      .then((response) => response.json())
      .then((data) => {
        setEnemy(data);
        setEnemyHP(data.hp);
      })
      .catch((error) => console.error("Error fetching enemy:", error));
  }, []);

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
        throw new Error("Failed to save battle log");
      }
    } catch (error) {
      console.error("Error saving battle log:", error);
    }
  };

  const gainCoins = async () => {
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
      Math.floor(Math.random() * (currentUser.latest_status.strength * 2)) + 1;
    const playerMagic =
      Math.floor(Math.random() * (currentUser.latest_status.intelligence * 2)) +
      1;
    const playerDamage =
      attackType === "attack"
        ? playerAttack - Math.floor(enemy.defence / 3)
        : playerMagic - Math.floor(enemy.defence / 2);
    const finalPlayerDamage = playerDamage < 1 ? 1 : playerDamage;

    const enemyAttack = Math.floor(Math.random() * (enemy.attack * 2)) + 1;
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

      if (playerGoesFirst) {
        setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage));
        setGameLog((prevLog) => [
          ...prevLog,
          `${currentUser.nickname}の${
            attackType === "attack" ? "攻撃" : "まほう"
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
          gainCoins(); // 金貨を獲得
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
              attackType === "attack" ? "攻撃" : "まほう"
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
            gainCoins(); // 金貨を獲得
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

  const triggerShakeEffect = () => {
    const body = document.body;
    body.classList.add("shake-animation");

    setTimeout(() => {
      body.classList.remove("shake-animation");
    }, 500);
  };

  if (!currentUser || !enemy || playerHP === null || background === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
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
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("attack")}
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "たたかう"}
              </button>
            </div>

            <div className="flex space-x-2 pt-3">
              <button
                className={`btn btn-primary btn-block ${
                  isAttacking || playerHP <= 0 || enemyHP <= 0
                    ? "loading loading-ring loading-sm btn-disabled"
                    : ""
                }`}
                onClick={() => attack("magic")}
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0
                  ? "たたかえない！"
                  : "まほう"}
              </button>
            </div>
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
