//ダメージ計算式
//

export const calculateDamage = (attackType, playerStats, enemyStats) => {
  const playerAttack = Math.max(
    1,
    Math.floor(
      (playerStats.strength * 0.5 + 10 - enemyStats.defence * 0.5) *
        (Math.random() * (1.2 - 0.8) + 0.8)
    ) * 3
  );

  const playerMagic1 = Math.max(
    1,
    Math.floor(
      (playerStats.intelligence * 0.4 + 10 - enemyStats.defence * 0.1) *
        (Math.random() * (1.3 - 0.7) + 0.7)
    ) * 3
  );

  const playerMagic2 = Math.max(
    1,
    Math.floor(
      (playerStats.intelligence * 0.3 + 10 - enemyStats.defence * 0.1) *
        (Math.random() * (1.8 - 0.7) + 0.8)
    ) * 3
  );

  const playerPower = Math.max(
    1,
    Math.floor(
      (playerStats.strength * 0.5 + 10 - enemyStats.defence * 0.5) *
        (Math.random() * 2)
    ) * 3
  );

  const playerLimit = Math.max(
    1,
    Math.floor(
      (playerStats.strength * 0.3 +
        playerStats.intelligence * 0.3 +
        15 -
        enemyStats.defence * 0.4) *
        (Math.random() * (1.2 - 0.8) + 0.8)
    ) * 3
  );

  let playerDamage;
  switch (attackType) {
    case "attack":
      playerDamage = playerAttack;
      break;
    case "power":
      playerDamage = playerPower;
      break;
    case "magic1":
      playerDamage = playerMagic1;
      break;
    case "magic2":
      playerDamage = playerMagic1;
      break;
    case "limit":
      playerDamage = playerLimit;
      break;
    default:
      playerDamage = 0;
  }

  //const playerDamage = attackType === "attack" ? playerAttack : playerMagic;

  const finalPlayerDamage = playerDamage;

  const enemyAttack = Math.max(
    1,
    Math.floor(
      (enemyStats.attack * 0.6 -
        (playerStats.strength * 0.05 + playerStats.wisdom * 0.2)) *
        (Math.random() * (1.3 - 0.7) + 0.7)
    ) * 8
  );

  const finalEnemyDamage = enemyAttack;

  return { finalPlayerDamage, finalEnemyDamage };
};
