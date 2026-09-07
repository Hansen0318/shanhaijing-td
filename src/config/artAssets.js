export const ART_ASSETS = Object.freeze({
  background: 'assets/backgrounds/bg_kunlun_gate_v1.png',
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
});

export function assetUrl(id) {
  const path = ART_ASSETS[id];
  return path ? new URL(`../../${path}`, import.meta.url).href : '';
}

export class ArtStore {
  constructor(ImageConstructor = Image) {
    this.images = Object.fromEntries(Object.keys(ART_ASSETS).map(id => {
      const image = new ImageConstructor();
      image.src = assetUrl(id);
      return [id, image];
    }));
  }

  get(id) {
    const image = this.images[id];
    return image?.complete && image.naturalWidth > 0 ? image : null;
  }
}
