import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { BackGround } from "../config/background";
import GameLog from "../components/GameLog";
import { Link } from "react-router-dom";
import { gainCoins } from "../services/GainCoins"; //コイン獲得メソッド
import { calculateDamage } from "../services/DamageCalculator"; //ダメージ計算メソッド
import SlashEffect from "../effects/SlashEffect"; // エフェクト
import FireMagicEffect from "../effects/FireMagicEffect"; // エフェクト
import IceMagicEffect from "../effects/IceMagicEffect"; // エフェクト
import { useHasBossedToday } from "../services/HasBossBattledToday";

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
  const [showModal, setShowModal] = useState(false);
  const [chatGptResponse, setChatGptResponse] = useState(null); //ChatGPT
  const [gameStarted, setGameStarted] = useState(false); // ゲーム開始状態を管理するフラグ
  const [showSlashEffect, setShowSlashEffect] = useState(false);
  const [showFireMagicEffect, setShowFireMagicEffect] = useState(false);
  const [showIceMagicEffect, setShowIceMagicEffect] = useState(false);
  const hasBossedToday = useHasBossedToday(currentUser);

  //バトルログを抽出し、累積ダメージ分を減算させる
  //logs配列をループして、最後に勝利した戦闘ログのインデックス（lastVictoryIndex）を特定
  //lastVictoryIndexより後の戦闘ログのダメージを累積し、累積ダメージ（accumulatedDamage）を計算
  //lastVictoryIndexが存在しない場合は、すべての戦闘ログのダメージを累積
  //最終的に、ボスのHPから累積ダメージを引いた値をsetBossHP関数で設定
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
                let accumulatedDamage = 0;
                let lastVictoryIndex = -1;

                for (let i = 0; i < logs.length; i++) {
                  if (logs[i].result === true) {
                    lastVictoryIndex = i;
                  }
                }

                if (lastVictoryIndex !== -1) {
                  accumulatedDamage = logs
                    .slice(lastVictoryIndex + 1)
                    .reduce((acc, log) => acc + log.damage_dealt, 0);
                } else {
                  accumulatedDamage = logs.reduce(
                    (acc, log) => acc + log.damage_dealt,
                    0
                  );
                }

                setBossHP(data.hp - accumulatedDamage);
              } else {
                setBossHP(data.hp);
              }
            });
        }
      })
      .catch((error) => console.error("魔王の取得に失敗しました:", error));
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

      // ChatGPTサービスを呼び出す
      fetch(`${API_URL}/api/v1/chatgpt/call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: currentUser.id }),
      })
        .then((response) => {
          //console.log("Response status:", response.status);
          return response.json();
        })
        .then((data) => {
          //console.log("ChatGPT response data:", data);
          setChatGptResponse(data.response);
        })
        .catch((error) => console.error("魔王は黙っている:", error));
    }
  }, [currentUser, token]);

  // useEffect(() => {
  //   if (chatGptResponse !== null) {
  //     restartGame();
  //   }
  // }, [chatGptResponse]);

  //今日の戦歴があるかどうかの判定
  useEffect(() => {
    if (hasBossedToday) {
      setGameOver(true);
    }
  }, [hasBossedToday]);

  // 魔王戦説明モーダル
  useEffect(() => {
    if (!gameOver) {
      setShowModal(true);
    }
  }, [gameOver]);

  // バトル後に魔王戦条件をロック
  // const lockSpecialMode = async () => {
  //   if (!currentUser.special_mode_unlocked) {
  //     console.log("魔王戦はすでにロックされています");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${API_URL}/api/v1/special_modes/participate`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       setCurrentUser({ ...currentUser, special_mode_unlocked: false });
  //     } else {
  //       const errorData = await response.json();
  //       console.error("魔王戦条件のロックに失敗しました:", errorData.error);
  //     }
  //   } catch (error) {
  //     console.error("魔王戦条件のロックに失敗しました:", error);
  //   }
  // };

  // const saveBattleLog = async (result, damage) => {
  //   if (!currentUser || !boss) return;
  //   try {
  //     const response = await fetch(`${API_URL}/api/v1/boss_battle_logs`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         user_id: currentUser.id,
  //         boss_id: boss.id,
  //         damage_dealt: damage,
  //         result: result,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("バトルログ記録に失敗しました");
  //     }
  //     if (result) {
  //       setTotalDamage(0);
  //     }
  //     // lockSpecialModeの結果を待ってエラーハンドリングを追加
  //     await lockSpecialMode().catch((error) => {
  //       console.error("特別モードのロックに失敗しました:", error);
  //     });
  //   } catch (error) {
  //     console.error("バトルログ記録に失敗しました:", error);
  //   }
  // };

  // バトルログとコインとスペシャルモードフラグはバック側でtransaction処理
  const saveBattleLog = async (result, damage, baseAmount) => {
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
          base_amount: baseAmount,
        }),
      });
      if (!response.ok) {
        throw new Error("バトルログ記録に失敗しました");
      }
      const data = await response.json();
      setCurrentUser((prevUser) => ({
        ...prevUser,
        coin: data.user.coin,
        special_mode_unlocked: data.user.special_mode_unlocked,
      }));
      setGainedCoins(data.gained_coins);
      if (data.gained_coins > 0) {
        setGameLog((prevLog) => [
          ...prevLog,
          `${data.gained_coins}枚の金貨を得た！`,
        ]);
      }
      if (result) {
        setTotalDamage(0);
      }
    } catch (error) {
      console.error("バトルログ記録に失敗しました:", error);
    }
  };

  //バトルエフェクトの画面表示
  const BattleEffect = ({ show, children }) => {
    if (!show) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    );
  };

  // 攻撃処理
  const attack = (attackType) => {
    if (gameOver) return;

    setGameLog([]);
    setIsAttacking(true);
    //攻撃タイプによってエフェクトを切り替える
    if (attackType === "attack" || attackType === "power") {
      setShowSlashEffect(true);
    } else if (attackType === "magic1") {
      setShowFireMagicEffect(true);
    } else if (attackType === "magic2") {
      setShowIceMagicEffect(true);
    } else {
      setShowSlashEffect(true);
      setShowFireMagicEffect(true);
      setShowIceMagicEffect(true);
    }

    //ダメージ計算式を呼び出す
    const { finalPlayerDamage, finalEnemyDamage } = calculateDamage(
      attackType,
      currentUser.latest_status,
      boss
    );

    const playerGoesFirst = Math.random() < 0.5; // 先行後攻
    const doubleAttackChance = currentUser.latest_status.dexterity / 100; // ダブルアタック

    setTimeout(() => {
      if (gameOver) return;

      let turnDamage = 0;

      if (playerGoesFirst) {
        setBossHP((prevHP) => Math.max(0, prevHP - finalPlayerDamage));
        turnDamage = finalPlayerDamage;
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
          const baseAmount = 3000;
          saveBattleLog(true, totalDamage + turnDamage, baseAmount); // 勝利を保存
          // gainCoins(
          //   currentUser,
          //   token,
          //   3000,
          //   setCurrentUser,
          //   setGainedCoins,
          //   setGameLog
          // ); // 金貨を獲得
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
          setGameLog(["全滅した。与えたダメージは次回に引き継ぎます。"]);
          const baseAmounts = [100, 200, 300];
          const baseAmount =
            baseAmounts[Math.floor(Math.random() * baseAmounts.length)];
          saveBattleLog(false, totalDamage, baseAmount); // 敗北を保存、ダメージを送信

          // gainCoins(
          //   currentUser,
          //   token,
          //   amount,
          //   setCurrentUser,
          //   setGainedCoins,
          //   setGameLog
          // ); // 金貨を獲得
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
              setGameLog(["全滅した。与えたダメージは次回に引き継ぎます"]);
              const baseAmounts = [100, 200, 300];
              const baseAmount =
                baseAmounts[Math.floor(Math.random() * baseAmounts.length)];
              saveBattleLog(false, totalDamage, baseAmount); // 敗北を保存、ダメージを送信
              // gainCoins(
              //   currentUser,
              //   token,
              //   amount,
              //   setCurrentUser,
              //   setGainedCoins,
              //   setGameLog
              // ); // 金貨を獲得
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
            const baseAmount = 3000;
            saveBattleLog(true, totalDamage + turnDamage, baseAmount); // 勝利を保存
            // gainCoins(
            //   currentUser,
            //   token,
            //   3000,
            //   setCurrentUser,
            //   setGainedCoins,
            //   setGameLog
            // ); // 金貨を獲得
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
          const baseAmounts = [100, 200, 300];
          const baseAmount =
            baseAmounts[Math.floor(Math.random() * baseAmounts.length)];
          saveBattleLog(false, totalDamage, baseAmount); // 敗北を保存、ダメージを送信
          // // 敗北の報酬を獲得
          // gainCoins(
          //   currentUser,
          //   token,
          //   amount,
          //   setCurrentUser,
          //   setGainedCoins,
          //   setGameLog
          // ); // 金貨を獲得
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
    //setBossHP(boss.hp); // リスタート時にボスHPをリセット
    const initialGameLog = `魔王が現れた！\n${
      chatGptResponse ? chatGptResponse : ""
    }`;
    setGameLog([initialGameLog]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);
    setTurnsLeft(5);
    setTotalDamage(0); // リスタート時に合計ダメージをリセット
    setGameStarted(true); // ゲーム開始フラグをセット
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
        <p>長時間画面が変わらない場合は、再度ログインしてください</p>
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
          {/*エフェクト*/}
          <div
            className="aspect-w-1 aspect-h-1 mx-auto"
            style={{ maxWidth: "300px", position: "relative" }}
          >
            <BattleEffect show={showSlashEffect}>
              <SlashEffect onComplete={() => setShowSlashEffect(false)} />
            </BattleEffect>
            <BattleEffect show={showFireMagicEffect}>
              <FireMagicEffect
                onComplete={() => setShowFireMagicEffect(false)}
              />
            </BattleEffect>
            <BattleEffect show={showIceMagicEffect}>
              <IceMagicEffect onComplete={() => setShowIceMagicEffect(false)} />
            </BattleEffect>
            {/*エフェクトここまで */}

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
                src={currentUser.current_avatar_url}
                alt="Player"
                className="w-16 h-16 rounded-xl mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{currentUser.nickname}</h2>
                <p className="text-lg">HP: {playerHP}</p>
              </div>
            </div>

            {!gameStarted ? (
              <div className="flex space-x-2">
                <button
                  onClick={restartGame}
                  className="btn btn-primary btn-block"
                  disabled={!chatGptResponse}
                >
                  はなす
                </button>
              </div>
            ) : (
              <>
                {/* コマンドボタン */}
                <div className="flex space-x-2">
                  <button
                    className={`btn btn-primary w-1/2 tooltip ${
                      isAttacking || playerHP <= 0 || bossHP <= 0
                        ? "loading loading-ring loading-sm btn-disabled"
                        : ""
                    }`}
                    onClick={() => attack("attack")}
                    data-tip="筋力依存の物理攻撃"
                    disabled={isAttacking || playerHP <= 0 || bossHP <= 0}
                  >
                    {isAttacking || playerHP <= 0 || bossHP <= 0
                      ? "たたかえない！"
                      : "たたかう"}
                  </button>

                  <button
                    className={`btn btn-primary w-1/2 tooltip${
                      isAttacking || playerHP <= 0 || bossHP <= 0
                        ? "loading loading-ring loading-sm btn-disabled"
                        : ""
                    }`}
                    onClick={() => attack("power")}
                    data-tip="筋力依存の物理攻撃。ブレ幅が大きい一振り"
                    disabled={isAttacking || playerHP <= 0 || bossHP <= 0}
                  >
                    {isAttacking || playerHP <= 0 || bossHP <= 0
                      ? "たたかえない！"
                      : "渾身"}
                  </button>
                </div>

                <div className="flex space-x-2 pt-3">
                  <button
                    className={`btn btn-primary w-1/2 tooltip${
                      isAttacking || playerHP <= 0 || bossHP <= 0
                        ? "loading loading-ring loading-sm btn-disabled"
                        : ""
                    }`}
                    onClick={() => attack("magic1")}
                    data-tip="知力依存の魔法攻撃。エネミーの防御による減衰を受けにくい"
                    disabled={isAttacking || playerHP <= 0 || bossHP <= 0}
                  >
                    {isAttacking || playerHP <= 0 || bossHP <= 0
                      ? "たたかえない！"
                      : "まほう（炎）"}
                  </button>

                  <button
                    className={`btn btn-primary w-1/2 tooltip${
                      isAttacking || playerHP <= 0 || bossHP <= 0
                        ? "loading loading-ring loading-sm btn-disabled"
                        : ""
                    }`}
                    onClick={() => attack("magic2")}
                    data-tip="知力依存の魔法攻撃。減衰を受けにくく、かつブレ幅が大きい"
                    disabled={isAttacking || playerHP <= 0 || bossHP <= 0}
                  >
                    {isAttacking || playerHP <= 0 || bossHP <= 0
                      ? "たたかえない！"
                      : "まほう（氷）"}
                  </button>
                </div>

                {playerHP <= 33 && (
                  <div className="flex space-x-2 pt-3">
                    <button
                      className={`btn btn-warning w-full tooltip${
                        isAttacking || playerHP <= 0 || bossHP <= 0
                          ? "loading loading-ring loading-sm btn-disabled"
                          : ""
                      }`}
                      onClick={() => attack("limit")}
                      data-tip="瀕死の一撃。筋力と知力を解き放つ"
                      disabled={isAttacking || playerHP <= 0 || bossHP <= 0}
                    >
                      {isAttacking || playerHP <= 0 || bossHP <= 0
                        ? "たたかえない！"
                        : "リミット"}
                    </button>
                  </div>
                )}
              </>
            )}
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
      {/* 開始時のルール説明モーダル*/}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">魔王戦について</h3>
            <p className="py-4">魔王戦は5ターン限定です</p>
            <p>このバトルで与えたダメージは次回に引き継がれます</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Boss;
