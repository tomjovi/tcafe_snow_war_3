/* 난이도와 관리자 설정을 검증해 저장하고, 선택한 값을 세션 설정으로 제공합니다. */
window.SnowSettings = (() => {
  const config = window.SnowConfig;
  const clone = value => JSON.parse(JSON.stringify(value));
  function defaults() { return { difficultyId: 3, difficulties: clone(config.difficulties), items: clone(config.itemDefaults) }; }
  function load() {
    try { const saved = JSON.parse(localStorage.getItem(config.storageKey)); if (!saved || !Array.isArray(saved.difficulties)) return defaults(); const base = defaults(); return { difficultyId: Math.min(5, Math.max(1, Number(saved.difficultyId) || 3)), difficulties: base.difficulties.map(row => ({ ...row, ...(saved.difficulties.find(entry => entry.id === row.id) || {}) })), items: { ...base.items, ...(saved.items || {}) } }; } catch (_) { return defaults(); }
  }
  let state = load();
  function save() { try { localStorage.setItem(config.storageKey, JSON.stringify(state)); } catch (_) { /* 저장 공간을 쓸 수 없는 환경에서도 세션 플레이는 가능합니다. */ } }
  function current() { return state.difficulties.find(entry => entry.id === state.difficultyId) || state.difficulties[2]; }
  function get() { return { difficulty: { ...current() }, items: { ...state.items } }; }
  function setDifficulty(id) { state.difficultyId = Math.min(5, Math.max(1, Number(id) || 3)); }
  function setParameter(key, value) { const info = config.parameterInfo.find(item => item.key === key); if (!info) return; current()[key] = Math.min(info.max, Math.max(info.min, Number(value))); }
  function setItem(key, value) { if (!(key in state.items)) return; state.items[key] = typeof state.items[key] === 'boolean' ? Boolean(value) : Number(value); }
  function reset() { state = defaults(); }
  function all() { return clone(state); }
  return { get, save, setDifficulty, setParameter, setItem, reset, all, currentId: () => state.difficultyId };
})();
