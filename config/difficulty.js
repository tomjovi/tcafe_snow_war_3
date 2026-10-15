/* 밸런싱 숫자를 한곳에서 관리합니다. 속도 단위는 초당 논리 픽셀입니다. */
window.SnowConfig = {
  storageKey: 'snowWar3Settings',
  bestKey: 'snowWar3Best10P',
  legacyBestKey: 'snowWar3Best',
  duration: 30,
  autoFireInterval: 0.52,
  rapidFireMinInterval: 0.14,
  playerMoveSpeed: 560,
  itemBaseInterval: 8,
  enemySpawnInterval: 1.15,
  maxEnemies: 8,
  difficulties: [
    { id: 1, name: '매우 쉬움', enemyMoveSpeed: 46, enemyDodgeChance: 0.04, enemyAttackInterval: 3.2, snowballSpeed: 520, itemSpawnRate: 0.85, playerMoveSpeed: 600, enemySpawnInterval: 1.55 },
    { id: 2, name: '쉬움', enemyMoveSpeed: 62, enemyDodgeChance: 0.10, enemyAttackInterval: 2.65, snowballSpeed: 520, itemSpawnRate: 0.95, playerMoveSpeed: 580, enemySpawnInterval: 1.35 },
    { id: 3, name: '보통', enemyMoveSpeed: 82, enemyDodgeChance: 0.17, enemyAttackInterval: 2.15, snowballSpeed: 520, itemSpawnRate: 1.0, playerMoveSpeed: 560, enemySpawnInterval: 1.15 },
    { id: 4, name: '어려움', enemyMoveSpeed: 108, enemyDodgeChance: 0.25, enemyAttackInterval: 1.7, snowballSpeed: 520, itemSpawnRate: 1.05, playerMoveSpeed: 540, enemySpawnInterval: 0.95 },
    { id: 5, name: '매우 어려움', enemyMoveSpeed: 138, enemyDodgeChance: 0.34, enemyAttackInterval: 1.35, snowballSpeed: 520, itemSpawnRate: 1.1, playerMoveSpeed: 520, enemySpawnInterval: 0.8 }
  ],
  parameterInfo: [
    { key: 'enemyMoveSpeed', label: '적 이동 속도', min: 25, max: 210, step: 1, unit: 'px/s', help: '높을수록 적이 더 빠르게 좌우로 움직입니다.' },
    { key: 'enemyDodgeChance', label: '적 회피 확률', min: 0, max: 0.6, step: 0.01, unit: '%', percent: true, help: '눈덩이가 가까워졌을 때 적이 옆으로 피할 확률입니다.' },
    { key: 'enemyAttackInterval', label: '적 공격 간격', min: 0.7, max: 5, step: 0.1, unit: '초', help: '낮을수록 적이 더 자주 눈덩이를 던집니다.' },
    { key: 'snowballSpeed', label: '눈덩이 속도', min: 300, max: 820, step: 10, unit: 'px/s', help: '자동 발사된 눈덩이가 위로 날아가는 속도입니다.' },
    { key: 'itemSpawnRate', label: '아이템 출현 계수', min: 0.3, max: 2.5, step: 0.05, unit: '×', help: '높을수록 아이템이 더 자주 나타납니다.' },
    { key: 'playerMoveSpeed', label: '플레이어 이동 속도', min: 300, max: 820, step: 10, unit: 'px/s', help: '좌우 입력을 따라 움직이는 속도입니다.' },
    { key: 'enemySpawnInterval', label: '적 등장 간격', min: 0.45, max: 2.5, step: 0.05, unit: '초', help: '낮을수록 새 적이 더 자주 전장에 들어옵니다.' }
  ],
  itemDefaults: { stackEnabled: true, maxStacks: 3, effectScale: 1, spawnRate: 1 }
};
