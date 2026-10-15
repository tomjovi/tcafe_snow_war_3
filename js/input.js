/* 마우스·터치·키보드 입력을 좌우 이동으로 정규화합니다. 공격은 게임에서 자동 실행됩니다. */
window.SnowInput = class SnowInput {
  constructor(canvas, callbacks) {
    this.canvas = canvas; this.callbacks = callbacks; this.keys = new Set(); this.pointerDown = false; this.pointerId = null; this.lastPointerX = null;
    canvas.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch') return;
      e.preventDefault(); canvas.setPointerCapture?.(e.pointerId); this.pointerDown = true; this.pointerId = e.pointerId; this.lastPointerX = this.localX(e.clientX);
    });
    canvas.addEventListener('pointermove', e => {
      const currentX = this.localX(e.clientX);
      if (e.pointerType === 'touch') {
        if (!this.pointerDown || e.pointerId !== this.pointerId) return;
        e.preventDefault(); callbacks.moveBy(currentX - this.lastPointerX);
      } else callbacks.move(currentX);
      this.lastPointerX = currentX;
    });
    const release = e => { if (!this.pointerDown || (e && e.pointerId !== this.pointerId)) return; this.pointerDown = false; this.pointerId = null; };
    canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release); canvas.addEventListener('lostpointercapture', release);
    window.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); this.keys.add(e.code); });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); if (this.pointerDown) release(); });
  }
  localX(clientX) { const rect = this.canvas.getBoundingClientRect(); return clientX - rect.left; }
  direction() { return (this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('ArrowLeft') ? 1 : 0); }
};
