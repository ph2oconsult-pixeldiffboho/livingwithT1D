// ─── Shared in-memory pattern store ─────────────────────────────────────────
// Singleton module: imported by both ExplainMyGlucose (writes) and PatternProfile (reads).
// Keeps state in module scope so it survives tab navigation within a session.

export const patternStore = {
  entries: [],
  _listeners: [],

  add(entry) {
    this.entries.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    });
    if (this.entries.length > 50) this.entries = this.entries.slice(0, 50);
    this._listeners.forEach(fn => fn([...this.entries]));
  },

  getAll() {
    return [...this.entries];
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  },
};
