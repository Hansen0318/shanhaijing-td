import { TOWER_DATA, ENEMY_DATA } from '../config/gameData.js?v=level6-1';
import { assetUrl, BOSS_HUD_GEOMETRY } from '../config/artAssets.js?v=level6-1';
import { Economy } from '../systems/Economy.js';
import { BEAST_NAMES } from '../config/progressionData.js';

export class UIController {
  constructor(game, renderer) {
    this.game = game; this.renderer = renderer;
    this.contextKey = null;
    this.lineupKey = null;
    this.blessingKey = null;
    this.dom = Object.fromEntries([...document.querySelectorAll('[id]')].map(el => [el.id, el]));
    this.bind(); this.render();
  }
  shouldRenderContext(key) {
    if (key === this.contextKey) return false;
    this.contextKey = key;
    return true;
  }
  shouldRenderLineup(key) {
    if (key === this.lineupKey) return false;
    this.lineupKey = key;
    return true;
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
    if (action === 'toggle-lineup') this.game.toggleLineup(button.dataset.type);
    if (action === 'confirm-lineup') this.game.confirmLineup();
    if (action === 'continue') this.game.togglePause();
    if (action === 'restart') this.game.restart();
    if (action === 'next-level') { this.transitionToLevel(this.game.nextLevelId()); return; }
    this.render();
  }
  async transitionToLevel(levelId) {
    document.body.classList.add('art-loading');
    if (!this.game.enterLevel(levelId)) { document.body.classList.remove('art-loading'); return false; }
    await this.renderer.prepareLevel(levelId);
    document.body.classList.remove('art-loading');
    window.scrollTo(0, 0);
    this.renderer.art.preloadDeferred(levelId);
    this.contextKey = null;
    this.lineupKey = null;
    this.render();
    return true;
  }
  render() {
    const game = this.game;
    this.dom['base-hp'].textContent = game.baseHp;
    this.dom.gold.textContent = game.economy.gold;
    this.dom.wave.textContent = `${game.wave.waveNumber} / ${game.level.waves.length}`;
    this.dom['speed-button'].textContent = `${game.time.scale}×`;
    this.dom['pause-button'].disabled = ['blessing', 'victory', 'defeat'].includes(game.state);
    const preparing = game.state === 'preparation';
    this.dom['start-wave-button'].hidden = !preparing;
    if (preparing) this.dom['start-wave-button'].textContent = `開始 W${game.wave.waveNumber + 1}`;
    this.renderContext(); this.renderLineup(); this.renderBlessings(); this.renderPause(); this.renderResult(); this.renderBossSlot(); this.renderBanner();
  }
  renderContext() {
    const panel = this.dom['context-panel'];
    const index = this.game.selectedSlot;
    const towerState = index == null ? null : this.game.towers[index];
    const key = JSON.stringify([index, this.game.economy.gold, this.game.state, this.game.pendingSellSlot, towerState?.type, towerState?.level, this.game.blessings.modifiers]);
    if (!this.shouldRenderContext(key)) return;
    if (index == null) { panel.innerHTML = '<p class="panel-hint">點擊圓形塔位，部署山海異獸</p>'; return; }
    const tower = this.game.towers[index];
    if (!tower) {
      const towerTypes = this.game.availableTowerTypes?.() ?? ['bifang', 'fuzhu', 'yinglong'];
      panel.innerHTML = `<div class="build-grid">${towerTypes.map(type => TOWER_DATA[type]).filter(Boolean).map(item => `<button class="unit-card" data-action="build" data-type="${item.id}" ${this.game.economy.canAfford(item.cost) && this.game.canManageTowers() ? '' : 'disabled'}><img class="unit-art" src="${assetUrl(item.id)}" alt=""><strong>${item.name}</strong><small>${item.role}</small><b>${item.cost} G</b></button>`).join('')}</div>`;
      return;
    }
    const intervalMultiplier = this.game.teamIntervalMultiplier?.() ?? 1;
    const stats = tower.getStats(this.game.blessings.modifiers, intervalMultiplier);
    const cost = tower.level < 3 ? Economy.upgradeCost(tower.data, tower.level) : 0;
    const special = tower.type === 'bifang'
      ? `爆炸 ${Math.round(stats.explosionRadius)}`
      : tower.type === 'fuzhu'
        ? `緩速 ${Math.round(stats.slow * 100)}% / ${stats.slowDuration}秒`
        : tower.type === 'baize'
          ? `洞察 ${stats.insightDuration}秒 / 易傷 ${Math.round(stats.vulnerability * 100)}%`
          : tower.type === 'jumang'
            ? `全隊攻擊間隔 ×${intervalMultiplier.toFixed(2)}`
          : `穿透 ${stats.penetration}`;
    panel.innerHTML = `<div class="tower-info"><div><h2><img class="tower-info-art" src="${assetUrl(tower.type)}" alt="">${tower.data.name} <span>Lv.${tower.level}</span></h2><p>傷害 ${Math.round(stats.damage * 10) / 10}　間隔 ${stats.interval.toFixed(2)}秒　射程 ${Math.round(stats.range)}</p><p>${special}</p></div><div class="tower-actions"><button data-action="upgrade" ${tower.level >= 3 || !this.game.economy.canAfford(cost) || !this.game.canManageTowers() ? 'disabled' : ''}>${tower.level >= 3 ? '已滿級' : `升級 ${cost} G`}</button><button class="sell" data-action="sell" ${!this.game.canManageTowers() ? 'disabled' : ''}>${this.game.pendingSellSlot === index ? `再次點擊確認 +${Economy.sellValue(tower.invested)} G` : `出售 +${Economy.sellValue(tower.invested)} G`}</button></div></div>`;
  }
  renderLineup() {
    const overlay = this.dom['lineup-overlay'];
    if (!overlay) return;
    overlay.hidden = this.game.state !== 'lineup';
    if (overlay.hidden) { this.lineupKey = null; return; }
    const selected = new Set(this.game.lineupSelection);
    const lineup = this.game.level.lineup ?? {};
    if (this.dom['lineup-eyebrow']) this.dom['lineup-eyebrow'].textContent = lineup.eyebrow ?? `第${this.game.levelId}關・${this.game.level.name}`;
    if (this.dom['lineup-banner']) {
      this.dom['lineup-banner'].hidden = !lineup.banner;
      this.dom['lineup-banner'].src = lineup.banner ? assetUrl(lineup.banner) : '';
    }
    if (this.dom['lineup-preview']) {
      this.dom['lineup-preview'].hidden = !lineup.preview;
      this.dom['lineup-preview'].src = lineup.preview ? assetUrl(lineup.preview) : '';
    }
    if (this.dom['lineup-title']) this.dom['lineup-title'].textContent = lineup.title ?? '選擇 3 隻異獸';
    if (this.dom['lineup-help']) this.dom['lineup-help'].innerHTML = lineup.help ?? '';
    const roster = this.game.lineupRoster();
    const key = `lineup:${this.game.levelId}:${roster.join('|')}:${[...selected].join('|')}`;
    if (!this.shouldRenderLineup(key)) return;
    this.dom['lineup-choices'].innerHTML = roster.map(type => {
      const item = TOWER_DATA[type];
      const active = selected.has(type);
      const isNew = this.game.lineupNewType === type;
      return `<button class="lineup-card${active ? ' selected' : ''}${isNew ? ' newly-unlocked' : ''}" data-action="toggle-lineup" data-type="${type}" aria-pressed="${active}">${isNew ? '<em class="lineup-new-badge">NEW</em>' : ''}<img src="${assetUrl(type)}" alt=""><strong>${item.name}</strong><small>${item.role}</small><b>${item.cost} G</b></button>`;
    }).join('');
    this.dom['confirm-lineup-button'].disabled = selected.size !== 3;
    if (this.dom['lineup-count']) this.dom['lineup-count'].textContent = `${selected.size} / 3`;
  }
  renderBlessings() {
    const overlay = this.dom['blessing-overlay']; overlay.hidden = this.game.state !== 'blessing';
    if (!overlay.hidden) {
      const key = this.game.currentChoices.map(choice => choice.id).join('|');
      if (key !== this.blessingKey) {
        this.blessingKey = key;
        this.dom['blessing-choices'].innerHTML = this.game.currentChoices.map(choice => {
          const source = choice.tower ? (TOWER_DATA[choice.tower]?.name ?? '異獸') : '全隊';
          return `<button class="blessing-card" data-action="blessing" data-id="${choice.id}"><em class="blessing-source">【${source}】</em><strong>${choice.name}</strong><span>${choice.description}</span><small>可重複取得</small></button>`;
        }).join('');
      }
    } else this.blessingKey = null;
  }
  renderPause() { this.dom['pause-overlay'].hidden = this.game.state !== 'paused'; }
  renderResult() {
    const ended = this.game.state === 'victory' || this.game.state === 'defeat';
    this.dom['result-overlay'].hidden = !ended;
    if (!ended) return;
    this.dom['result-panel'].dataset.result = this.game.state;
    this.dom['result-title'].textContent = this.game.state === 'victory' ? '防守成功' : '防守失敗';
    const unlockedType = this.game.state === 'victory' ? this.game.pendingUnlock : null;
    const unlockedName = unlockedType ? BEAST_NAMES[unlockedType] : '';
    const unlock = unlockedType
      ? `<li class="unlock-result"><img src="${assetUrl(`${unlockedType}Unlock`)}" alt="${unlockedName}">新異獸解鎖：${unlockedName}</li>`
      : '';
    this.dom['result-stats'].innerHTML = this.game.state === 'victory' ? `<li>剩餘 Base HP：${this.game.baseHp}</li><li>擊敗敵人數：${this.game.stats.kills}</li><li>建造異獸數：${this.game.stats.built}</li>${unlock}` : `<li>抵達 Wave：${this.game.wave.waveNumber}</li><li>擊敗敵人數：${this.game.stats.kills}</li><li>建造異獸數：${this.game.stats.built}</li>`;
    this.dom['retry-button'].textContent = this.game.state === 'victory' ? '再次挑戰' : '重新挑戰';
    const nextLevelId = this.game.state === 'victory' ? this.game.nextLevelId() : null;
    this.dom['next-level-button'].hidden = nextLevelId == null;
    if (!this.dom['next-level-button'].hidden) this.dom['next-level-button'].textContent = `前往第${nextLevelId}關`;
  }
  renderBossSlot() {
    const boss = this.game.enemies.find(enemy => enemy.isBoss);
    const preview = this.dom['wave-preview'];
    const preparing = this.game.state === 'preparation';
    const inCombat = this.game.state === 'combat' && this.game.wave.waveNumber > 0;
    const showPreview = !boss && (preparing || inCombat);
    preview.hidden = !showPreview;
    if (showPreview) {
      const number = preparing ? this.game.wave.waveNumber + 1 : this.game.wave.waveNumber;
      const groups = this.game.wave.getWaveGroups(number);
      this.dom['wave-preview-title'].textContent = `第${this.game.level.id}關・${this.game.level.name}`;
      const counts = Object.fromEntries(groups.map(group => [group.type, preparing ? group.count : 0]));
      if (inCombat) {
        for (const type of this.game.wave.queue) if (type in counts) counts[type] += 1;
        for (const enemy of this.game.enemies) if (enemy.alive && enemy.type in counts) counts[enemy.type] += 1;
      }
      this.dom['wave-preview-enemies'].innerHTML = groups.map(group => {
        const enemy = ENEMY_DATA[group.type];
        const artId = group.type === 'jiuweihu' ? 'jiuweihuPhase1' : group.type === 'xingtian' ? 'xingtianPhase1' : group.type;
        return `<span><img class="preview-art" src="${assetUrl(artId)}" alt="">${enemy.name} ×${counts[group.type]}</span>`;
      }).join('');
    }
    this.dom['boss-hud'].hidden = !boss;
    if (boss) {
      this.dom['boss-hud'].dataset.bossType = boss.type;
      this.dom['boss-name'].hidden = false;
      this.dom['boss-name'].textContent = boss.data.name;
      this.dom['boss-name'].style.visibility = '';
      this.dom['boss-hud'].style.borderImageSource = `url('${assetUrl(this.game.level.art.bossPanel)}')`;
      const trackRect = BOSS_HUD_GEOMETRY[boss.type];
      if (trackRect) {
        for (const key of ['left', 'top', 'width', 'height']) {
          this.dom['boss-hud'].style.setProperty(`--boss-track-${key}`, trackRect[key]);
        }
      }
      this.dom['boss-hp-fill'].style.width = `${boss.hp / boss.maxHp * 100}%`;
      const healEffect = boss.type === 'xiangliu'
        ? this.game.effects.find(effect => effect.type === 'bossHealText' && effect.life > 0)
        : null;
      this.dom['boss-hp-text'].textContent = healEffect
        ? `回血 +${healEffect.amount} HP　${Math.ceil(boss.hp)} / ${boss.maxHp}`
        : `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
      const healing = Boolean(healEffect);
      this.dom['boss-hud'].style.filter = healing ? 'brightness(1.22) drop-shadow(0 0 10px rgba(86,220,255,.95))' : '';
      this.dom['boss-hp-fill'].style.boxShadow = healing ? '0 0 14px rgba(119,245,255,1)' : '';
      this.dom['boss-hp-fill'].style.background = healing ? '#55e6ff' : '';
    } else {
      delete this.dom['boss-hud'].dataset.bossType;
      this.dom['boss-name'].style.visibility = '';
      this.dom['boss-hp-fill'].style.background = '';
    }
  }
  renderBanner() {
    const banner = this.dom.banner;
    banner.hidden = this.game.bannerTimer <= 0;
    if (banner.hidden) return;
    banner.textContent = this.game.banner;
    banner.dataset.hasArt = this.game.bannerArtId ? 'true' : 'false';
    banner.style.backgroundImage = this.game.bannerArtId ? `url('${assetUrl(this.game.bannerArtId)}')` : '';
  }
}
