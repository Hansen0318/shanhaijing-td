export const ART_ASSETS = Object.freeze({
  background: 'assets/backgrounds/bg_kunlun_gate_v1.jpg',
  slotPlatform: 'assets/map/map_slot_platform_v1.png',
  spawnRift: 'assets/map/map_spawn_rift_v1.png',
  baseSeal: 'assets/map/map_base_kunlun_seal_v1.png',
  bifang: 'assets/towers/tower_bifang_v1.png',
  fuzhu: 'assets/towers/tower_fuzhu_v1.png',
  yinglong: 'assets/towers/tower_yinglong_v1.png',
  minion: 'assets/enemies/enemy_xiaoyao_v1.png',
  swift: 'assets/enemies/enemy_jiyao_v1.png',
  giant: 'assets/enemies/enemy_juyao_v1.png',
  qiongqi: 'assets/bosses/boss_qiongqi_v1.png',
  qiongqiFrenzy: 'assets/bosses/boss_qiongqi_frenzy_v1.png',
  bifangFireball: 'assets/effects/fx_bifang_fireball_v1.png',
  bifangExplosion: 'assets/effects/fx_bifang_explosion_v1.png',
  fuzhuFrostshot: 'assets/effects/fx_fuzhu_frostshot_v1.png',
  slowMark: 'assets/effects/fx_slow_mark_v1.png',
  yinglongBeam: 'assets/effects/fx_yinglong_beam_v1.png',
  resourcePanel: 'assets/ui/ui_resource_panel_v1.png',
  hudButton: 'assets/ui/ui_hud_button_v1.png',
  wavePreviewPanel: 'assets/ui/ui_wave_preview_panel_v1.png',
  bossPanel: 'assets/ui/ui_boss_panel_v1.png',
  contextPanel: 'assets/ui/ui_context_panel_v1.png',
  buildCard: 'assets/ui/ui_build_card_v1.png',
  actionButton: 'assets/ui/ui_action_button_v1.png',
  blessingCard: 'assets/ui/ui_blessing_card_v1.png',
  victoryOverlay: 'assets/ui/ui_victory_overlay_v1.png',
  defeatOverlay: 'assets/ui/ui_defeat_overlay_v1.png',
  level2Background: 'assets/levels/level2/bg_chishui_wasteland_v1.jpg',
  level2Spawn: 'assets/levels/level2/map_spawn_fire_rift_v1.png',
  level2Base: 'assets/levels/level2/map_base_chishui_fort_v1.png',
  chiyu: 'assets/enemies/enemy_chiyu_v1.png',
  yanjia: 'assets/enemies/enemy_yanjia_v1.png',
  paoxiao: 'assets/bosses/boss_paoxiao_v1.png',
  paoxiaoProjectile: 'assets/effects/fx_paoxiao_projectile_v1.png',
  paoxiaoExplosion: 'assets/effects/fx_paoxiao_explosion_v1.png',
  paoxiaoEnrage: 'assets/effects/fx_paoxiao_enrage_v1.png',
  paoxiaoGroundslam: 'assets/effects/fx_paoxiao_groundslam_v1.png',
  paoxiaoBossPanel: 'assets/ui/ui_boss_paoxiao_panel_v1.png',
  level3Background: 'assets/levels/level3/bg_ruoshui_valley_v1.jpg',
  level3Spawn: 'assets/levels/level3/map_spawn_ruoshui_rift_v1.png',
  level3Base: 'assets/levels/level3/map_base_xuanwater_altar_v1.png',
  shuixiao: 'assets/enemies/enemy_shuixiao_v1.png',
  xuanjiashou: 'assets/enemies/enemy_xuanjiashou_v1.png',
  xiangliu: 'assets/bosses/boss_xiangliu_v1.png',
  waterSplash: 'assets/effects/fx_water_splash_v1.png',
  waterProjectile: 'assets/effects/fx_water_projectile_v1.png',
  waterRing: 'assets/effects/fx_water_ring_v1.png',
  whirlpool: 'assets/effects/fx_whirlpool_v1.png',
  xiangliuBossPanel: 'assets/ui/ui_boss_xiangliu_panel_v1.png',
  baizeUnlock: 'assets/ui/unlock_baize_v1.png',
});

const ASSET_CACHE_VERSION = 'asset-opt-1';

const SHARED_RUNTIME_ART_IDS = Object.freeze([
  'slotPlatform', 'bifang', 'fuzhu', 'yinglong', 'minion', 'swift', 'giant',
  'bifangFireball', 'bifangExplosion', 'fuzhuFrostshot', 'slowMark', 'yinglongBeam',
]);

// These frames are visible on the first preparation paint. Waiting for them prevents
// text from appearing before its border-image, while keeping combat/overlay art deferred.
const SHARED_FIRST_PAINT_UI_IDS = Object.freeze([
  'resourcePanel', 'hudButton', 'wavePreviewPanel', 'contextPanel', 'actionButton',
]);

const SHARED_BUILD_READY_ART_IDS = Object.freeze(['bifang', 'fuzhu', 'yinglong']);

const SHARED_DEFERRED_UI_IDS = Object.freeze([
  'buildCard', 'blessingCard', 'victoryOverlay', 'defeatOverlay',
]);

export const LEVEL_ART_IDS = Object.freeze({
  1: Object.freeze([...SHARED_RUNTIME_ART_IDS, ...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_DEFERRED_UI_IDS, 'background', 'spawnRift', 'baseSeal', 'qiongqi', 'qiongqiFrenzy', 'bossPanel']),
  2: Object.freeze([...SHARED_RUNTIME_ART_IDS, ...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_DEFERRED_UI_IDS, 'level2Background', 'level2Spawn', 'level2Base', 'chiyu', 'yanjia', 'paoxiao', 'paoxiaoProjectile', 'paoxiaoExplosion', 'paoxiaoEnrage', 'paoxiaoGroundslam', 'paoxiaoBossPanel']),
  3: Object.freeze([...SHARED_RUNTIME_ART_IDS, ...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_DEFERRED_UI_IDS, 'level3Background', 'level3Spawn', 'level3Base', 'shuixiao', 'xuanjiashou', 'xiangliu', 'waterSplash', 'waterProjectile', 'waterRing', 'whirlpool', 'xiangliuBossPanel', 'baizeUnlock']),
});

export const LEVEL_REQUIRED_ART_IDS = Object.freeze({
  1: Object.freeze([...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_BUILD_READY_ART_IDS, 'slotPlatform', 'background', 'spawnRift', 'baseSeal', 'minion']),
  2: Object.freeze([...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_BUILD_READY_ART_IDS, 'slotPlatform', 'level2Background', 'level2Spawn', 'level2Base', 'minion']),
  3: Object.freeze([...SHARED_FIRST_PAINT_UI_IDS, ...SHARED_BUILD_READY_ART_IDS, 'slotPlatform', 'level3Background', 'level3Spawn', 'level3Base', 'shuixiao']),
});

export const LEVEL_DEFERRED_ART_IDS = Object.freeze({
  1: Object.freeze(LEVEL_ART_IDS[1].filter(id => !LEVEL_REQUIRED_ART_IDS[1].includes(id))),
  2: Object.freeze(LEVEL_ART_IDS[2].filter(id => !LEVEL_REQUIRED_ART_IDS[2].includes(id))),
  3: Object.freeze(LEVEL_ART_IDS[3].filter(id => !LEVEL_REQUIRED_ART_IDS[3].includes(id))),
});

export function assetUrl(id) {
  const path = ART_ASSETS[id];
  return path ? `${new URL(`../../${path}`, import.meta.url).href}?v=${ASSET_CACHE_VERSION}` : '';
}

export class ArtStore {
  constructor(ImageConstructor = Image, initialLevelId = 1) {
    this.ImageConstructor = ImageConstructor;
    this.images = {};
    this.pending = {};
    this.settled = new Set();
    this.initialLevelId = initialLevelId;
    this.loadIds(LEVEL_REQUIRED_ART_IDS[initialLevelId]);
  }

  loadIds(ids = []) {
    return Promise.all(ids.map(id => {
      if (this.pending[id]) return this.pending[id];
      const image = new this.ImageConstructor();
      this.images[id] = image;
      this.pending[id] = new Promise(resolve => {
        const settle = () => {
          this.settled.add(id);
          resolve();
        };
        image.onload = settle;
        image.onerror = settle;
        image.src = assetUrl(id);
        if (image.complete) settle();
      });
      return this.pending[id];
    }));
  }

  ensureLevel(levelId) {
    return this.loadIds(LEVEL_REQUIRED_ART_IDS[levelId]);
  }

  preloadDeferred(levelId) {
    return this.loadIds(LEVEL_DEFERRED_ART_IDS[levelId]);
  }

  isLevelReady(levelId) {
    return (LEVEL_REQUIRED_ART_IDS[levelId] ?? []).every(id => this.settled.has(id));
  }

  isReady() {
    return this.isLevelReady(this.initialLevelId);
  }

  get(id) {
    const image = this.images[id];
    return image?.complete && image.naturalWidth > 0 ? image : null;
  }
}
