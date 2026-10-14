/* 원형 충돌 판정: 눈덩이, 적, 아이템 공통으로 사용합니다. */
window.SnowCollision = {
  circles(a, b) { const dx = a.x - b.x, dy = a.y - b.y, r = a.r + b.r; return dx * dx + dy * dy <= r * r; }
};
