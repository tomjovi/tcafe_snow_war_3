/* 마우스·터치·키보드를 하나의 발사/이동 입력으로 정규화합니다. */
window.SnowInput = class SnowInput {
  constructor(canvas, callbacks) {
    this.canvas = canvas; this.callbacks = callbacks; this.keys = new Set(); this.heldSources = new Set(); this.pointerDown = false; this.pointerId = null; this.lastPointerX = null;
    canvas.addEventListener('pointerdown', e => { if (e.button !== undefined && e.button !== 0) return; e.preventDefault(); canvas.setPointerCapture?.(e.pointerId); this.pointerDown = true; this.pointerId = e.pointerId; this.lastPointerX = e.clientX; callbacks.move(this.localX(e.clientX)); this.press('pointer'); });
    canvas.addEventListener('pointermove', e => { if (!this.pointerDown || e.pointerId !== this.pointerId) return; e.preventDefault(); callbacks.move(this.localX(e.clientX)); });
    const release = e => { if (!this.pointerDown || (e && e.pointerId !== this.pointerId)) return; this.pointerDown = false; this.pointerId = null; this.release('pointer'); };
    canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release); canvas.addEventListener('lostpointercapture', release);
    window.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault(); if (e.code === 'Space' && !e.repeat) this.press('keyboard'); this.keys.add(e.code); });
    window.addEventListener('keyup', e => { if (e.code === 'Space') this.release('keyboard'); this.keys.delete(e.code); });
    window.addEventListener('blur', () => { this.keys.clear(); if (this.pointerDown) release(); this.heldSources.clear(); callbacks.cancelCharge(); });
  }
  press(source) { if (this.heldSources.has(source)) return; this.heldSources.add(source); if (this.heldSources.size === 1) this.callbacks.press(source); }
  release(source) { if (!this.heldSources.delete(source)) return; if (this.heldSources.size === 0) this.callbacks.release(source); }
  localX(clientX) { const rect = this.canvas.getBoundingClientRect(); return clientX - rect.left; }
  direction() { return (this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('ArrowLeft') ? 1 : 0); }
};
