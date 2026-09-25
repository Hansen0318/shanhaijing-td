const TELEGRAPH_SECONDS = 0.8;
const NORMAL_INTERVAL = 8;
const EPSILON = 1e-9;

function nextState(state) {
  return state === 'day' ? 'night' : 'day';
}

export class DayNightSystem {
  static reset({ state = 'day', interval = NORMAL_INTERVAL, bossControlled = false } = {}) {
    return {
      state,
      elapsed: 0,
      telegraph: false,
      switchInterval: interval,
      bossControlled,
    };
  }

  static syncEnemies(game) {
    for (const enemy of game.enemies ?? []) enemy.dayNightState = game.dayNight.state;
  }

  static configure(game, { state, interval, bossControlled = true, resetElapsed = true } = {}) {
    game.dayNight ??= this.reset();
    if (state) game.dayNight.state = state;
    if (interval != null) game.dayNight.switchInterval = interval;
    game.dayNight.bossControlled = bossControlled;
    game.dayNight.telegraph = false;
    if (resetElapsed) game.dayNight.elapsed = 0;
    this.syncEnemies(game);
    return game.dayNight;
  }

  static update(game, dt) {
    if (game.levelId !== 9 || !game.dayNight) return game.dayNight;
    const state = game.dayNight;
    const interval = state.switchInterval;
    const before = state.elapsed;
    state.elapsed += Math.max(0, dt);

    const telegraphAt = interval - TELEGRAPH_SECONDS;
    if (!state.telegraph && before < telegraphAt - EPSILON && state.elapsed >= telegraphAt - EPSILON) {
      state.telegraph = true;
      game.effects.push({
        type: 'dayNightTelegraph', fromState: state.state, toState: nextState(state.state),
        life: TELEGRAPH_SECONDS, duration: TELEGRAPH_SECONDS,
      });
    }

    while (state.elapsed >= interval - EPSILON) {
      state.elapsed = Math.max(0, state.elapsed - interval);
      state.state = nextState(state.state);
      state.telegraph = false;
      game.effects.push({ type: 'dayNightSwitch', state: state.state, life: 0.55, duration: 0.55 });
    }
    this.syncEnemies(game);
    return state;
  }
}
