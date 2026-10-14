/* 외부 음원 없이 Web Audio 오실레이터로 짧은 효과음을 만듭니다. */
window.SnowSound = class SnowSound {
  constructor() { this.context = null; this.enabled = false; }
  toggle() { this.enabled = !this.enabled; return this.enabled; }
  play(kind) {
    if (!this.enabled) return;
    try { const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return; this.context ||= new Audio(); if (this.context.state === 'suspended') this.context.resume(); const osc = this.context.createOscillator(), gain = this.context.createGain(), now = this.context.currentTime; osc.type = kind === 'hit' ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(kind === 'hit' ? 740 : kind === 'hurt' ? 150 : 320, now); osc.frequency.exponentialRampToValueAtTime(kind === 'hurt' ? 75 : 180, now + 0.11); gain.gain.setValueAtTime(0.045, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12); osc.connect(gain); gain.connect(this.context.destination); osc.start(now); osc.stop(now + 0.13); } catch (_) { /* 브라우저 오디오 제한은 게임 진행에 영향을 주지 않습니다. */ }
  }
};
