import { TOWER_DATA } from '../config/gameData.js';
import { Economy } from '../systems/Economy.js';

export class UIController {
  constructor(game, renderer) {
    this.game = game; this.renderer = renderer;
    this.contextKey = null;
    this.blessingKey = null;
    this.dom = Object.fromEntries([...document.querySelectorAll('[id]')].map(el => [el.id, el]));
    this.bind(); this.render();
  }
  shouldRenderContext(key) {
    if (key === this.contextKey) return false;
    this.contextKey = key;
    return true;
  }
  setContextExpanded(expanded) {
    this.dom['game-shell'].classList.toggle('context-open', expanded);
  }
  bind() {
    this.renderer.canvas.addEventListener('pointerdown', event => this.onBattlefieldTap(event));
    this.dom['pause-button'].addEventListener('click', () => { this.game.togglePause(); this.render(); });
    this.dom['speed-button'].addEventListener('click', () => { this.game.setTimeScale(this.game.time.scale === 1 ? 2 : 1); this.render(); });
    this.dom['start-wave-button'].addEventListener('click', () => { this.game.startWaveNow(); this.render(); });
    document.addEventListener('click', event => this.onAction(event));
  }
  onBattlefieldTap(event) {
    const index = this.game.map.slotAt(this.renderer.pointFromEvent(event), 34);
    this.game.cancelSell();
    this.game.selectedSlot = index >= 0 ? index : null;
    this.render();
  }
  onAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const slot = this.game.selectedSlot;
    if (action === 'build') this.game.buildTower(slot, button.dataset.type);
    if (action === 'upgrade') this.game.upgradeTower(slot);
    if (action === 'sell') this.game.sellTower(slot);
    if (action === 'blessing') this.game.selectBlessing(button.dataset.id);
    if (action === 'continue') this.game.togglePause();
    if (action === 'restart') this.game.restart();
    this.render();
  }
  render() {
    const game = this.game;
    this.dom['base-hp'].textContent = game.baseHp;
    this.dom.gold.textContent = game.economy.gold;
    this.dom.wave.textContent = `${game.wave.waveNumber} / 10`;
    this.dom['speed-button'].textContent = `${game.time.scale}×`;
    this.dom['pause-button'].disabled = ['blessing', 'victory', 'defeat'].includes(game.state);
    const preparing = game.state === 'preparation';
    this.dom['wave-control'].hidden = !preparing;
    if (preparing) {
      const nextWave = game.wave.waveNumber + 1;
      this.dom['countdown-label'].textContent = game.wave.waveNumber === 0 ? '先配置異獸，再開始第一波' : `配置完成後開始 Wave ${nextWave}`;
      this.dom['start-wave-button'].textContent = `開始 Wave ${nextWave}`;
    }
    this.renderContext(); this.renderBlessings(); this.renderPause(); this.renderResult(); this.renderBoss(); this.renderBanner();
  }
  renderContext() {
    const panel = this.dom['context-panel'];
    const index = this.game.selectedSlot;
    this.setContextExpanded(index != null);
    const towerState = index == null ? null : this.game.towers[index];
    const key = JSON.stringify([index, this.game.economy.gold, this.game.state, this.game.pendingSellSlot, towerState?.type, towerState?.level, this.game.blessings.modifiers]);
    if (!this.shouldRenderContext(key)) return;
    if (index == null) { panel.innerHTML = '<p class="panel-hint">點擊圓形塔位，部署山海異獸</p>'; return; }
    const tower = this.game.towers[index];
    if (!tower) {
      panel.innerHTML = `<div class="build-grid">${Object.values(TOWER_DATA).map(item => `<button class="unit-card" data-action="build" data-type="${item.id}" ${this.game.economy.canAfford(item.cost) && this.game.canManageTowers() ? '' : 'disabled'}><span class="unit-emoji">${item.emoji}</span><strong>${item.name}</strong><small>${item.role}</small><b>${item.cost} G</b></button>`).join('')}</div>`;
      return;
    }
    const stats = tower.getStats(this.game.blessings.modifiers);
    const cost = tower.level < 3 ? Economy.upgradeCost(tower.data, tower.level) : 0;
    const special = tower.type === 'bifang' ? `爆炸 ${Math.round(stats.explosionRadius)}` : tower.type === 'fuzhu' ? `緩速 ${Math.round(stats.slow * 100)}% / ${stats.slowDuration}秒` : `穿透 ${stats.penetration}`;
    panel.innerHTML = `<div class="tower-info"><div><h2>${tower.data.emoji} ${tower.data.name} <span>Lv.${tower.level}</span></h2><p>傷害 ${Math.round(stats.damage * 10) / 10}　間隔 ${stats.interval.toFixed(2)}秒　射程 ${Math.round(stats.range)}</p><p>${special}</p></div><div class="tower-actions"><button data-action="upgrade" ${tower.level >= 3 || !this.game.economy.canAfford(cost) || !this.game.canManageTowers() ? 'disabled' : ''}>${tower.level >= 3 ? '已滿級' : `升級 ${cost} G`}</button><button class="sell" data-action="sell" ${!this.game.canManageTowers() ? 'disabled' : ''}>${this.game.pendingSellSlot === index ? `再次點擊確認 +${Economy.sellValue(tower.invested)} G` : `出售 +${Economy.sellValue(tower.invested)} G`}</button></div></div>`;
  }
  renderBlessings() {
    const overlay = this.dom['blessing-overlay']; overlay.hidden = this.game.state !== 'blessing';
    if (!overlay.hidden) {
      const key = this.game.currentChoices.map(choice => choice.id).join('|');
      if (key !== this.blessingKey) { this.blessingKey = key; this.dom['blessing-choices'].innerHTML = this.game.currentChoices.map(choice => `<button class="blessing-card" data-action="blessing" data-id="${choice.id}"><strong>${choice.name}</strong><span>${choice.description}</span><small>可重複取得</small></button>`).join(''); }
    } else this.blessingKey = null;
  }
  renderPause() { this.dom['pause-overlay'].hidden = this.game.state !== 'paused'; }
  renderResult() {
    const ended = this.game.state === 'victory' || this.game.state === 'defeat';
    this.dom['result-overlay'].hidden = !ended;
    if (!ended) return;
    this.dom['result-title'].textContent = this.game.state === 'victory' ? '防守成功' : '防守失敗';
    this.dom['result-stats'].innerHTML = this.game.state === 'victory' ? `<li>剩餘 Base HP：${this.game.baseHp}</li><li>擊敗敵人數：${this.game.stats.kills}</li><li>建造異獸數：${this.game.stats.built}</li>` : `<li>抵達 Wave：${this.game.wave.waveNumber}</li><li>擊敗敵人數：${this.game.stats.kills}</li><li>建造異獸數：${this.game.stats.built}</li>`;
    this.dom['retry-button'].textContent = this.game.state === 'victory' ? '再次挑戰' : '重新挑戰';
  }
  renderBoss() {
    const boss = this.game.enemies.find(enemy => enemy.isBoss);
    this.dom['boss-hud'].hidden = !boss;
    if (boss) { this.dom['boss-hp-fill'].style.width = `${boss.hp / boss.maxHp * 100}%`; this.dom['boss-hp-text'].textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`; }
  }
  renderBanner() { this.dom.banner.hidden = this.game.bannerTimer <= 0; if (!this.dom.banner.hidden) this.dom.banner.textContent = this.game.banner; }
}
