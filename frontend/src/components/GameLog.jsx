import React from "react";
import { Link } from "react-router-dom"; // Linkをインポート

const GameLog = ({ logs, isPlayerDefeated, showMyPageLink }) => (
  <div className={`game-log ${isPlayerDefeated ? "game-log-defeated" : ""}`}>
    {logs.length === 0 ? (
      <p></p>
    ) : (
      logs.map((log, index) => <p key={index}>{log}</p>)
    )}
    {showMyPageLink && (
      <div className="flex justify-center mt-4">
        <Link to="/MyPage" className="btn btn-accent normal-case text-xl">
          マイページへ
        </Link>
      </div>
    )}
  </div>
);

export default GameLog;
