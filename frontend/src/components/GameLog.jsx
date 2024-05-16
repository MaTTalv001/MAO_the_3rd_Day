import React from 'react';

const GameLog = ({ logs , isPlayerDefeated}) => (
  <div className={`game-log ${isPlayerDefeated ? 'game-log-defeated' : ''}`}>
    {logs.length === 0 ? (
      <p></p>
    ) : (
      logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))
    )}
  </div>
);

export default GameLog;