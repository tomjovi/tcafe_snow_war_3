/* 반복 생성되는 눈덩이와 입자를 재사용해 모바일 할당량을 줄입니다. */
window.SnowPool = class SnowPool {
  constructor(factory, reset, size = 32) { this.factory = factory; this.reset = reset; this.items = Array.from({ length: size }, factory); }
  acquire(values) { let item = this.items.find(entry => !entry.active); if (!item) { item = this.factory(); this.items.push(item); } this.reset(item, values); item.active = true; return item; }
  active() { return this.items.filter(item => item.active); }
};
