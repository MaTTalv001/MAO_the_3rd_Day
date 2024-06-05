import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import { API_URL, FRONT_URL } from "../config/settings";

export const EnemyDirectory = () => {
  const { currentUser, token } = useAuth();
  const [enemies, setEnemies] = useState([]);
  const [battleLogs, setBattleLogs] = useState([]);

  // 初回レンダリング時に敵データを取得
  useEffect(() => {
    fetch(`${API_URL}/api/v1/enemies`)
      .then((response) => response.json())
      .then((data) => {
        setEnemies(data);
      })
      .catch((error) =>
        console.error("エネミーデータ取得に失敗しました:", error)
      );
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.battle_logs) {
      //currentuserのバトルログを抽出
      setBattleLogs(currentUser.battle_logs);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>
    );
  }

  // enemyが討伐済みかどうかを判定する関数
  const isEnemyDefeated = (enemyId) => {
    return battleLogs.some((log) => log.enemy_id === enemyId && log.result);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enemies.map((enemy) => (
          <div className="card bg-base-100 shadow-xl" key={enemy.id}>
            <figure className="px-4 pt-4">
              <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex justify-center items-center">
                  <img
                    src={enemy.enemy_url}
                    alt={enemy.name}
                    className={`object-contain h-full ${
                      !isEnemyDefeated(enemy.id) ? "brightness-0" : ""
                    }`}
                  />
                  {!isEnemyDefeated(enemy.id) && (
                    <div className="absolute inset-0 opacity-80"></div>
                  )}
                </div>
              </div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">
                {isEnemyDefeated(enemy.id) ? enemy.name : "????"}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemyDirectory;
