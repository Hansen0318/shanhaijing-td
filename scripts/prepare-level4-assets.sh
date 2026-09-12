#!/usr/bin/env bash
set -euo pipefail

source_root=${1:?"source root required"}
repo_root=${2:?"repository root required"}

rgba_sprite() {
  local input=$1 output=$2 box=$3
  mkdir -p "$(dirname "$output")"
  convert "$input" -alpha on -bordercolor white -border 1 -fuzz 10% \
    -fill none -draw 'matte 0,0 floodfill' -shave 1x1 -trim +repage \
    -filter Lanczos -resize "${box}>" -gravity center -background none \
    -extent "$box" -define png:compression-level=9 "PNG32:$output"
}

copy_alpha_sprite() {
  local input=$1 output=$2 box=$3
  mkdir -p "$(dirname "$output")"
  convert "$input" -trim +repage -filter Lanczos -resize "${box}>" \
    -gravity center -background none -extent "$box" \
    -define png:compression-level=9 "PNG32:$output"
}

mkdir -p "$repo_root/assets/levels/level4"
convert "$source_root/assets/backgrounds/bg_qingqiu_realm_source.jpg" -filter Lanczos \
  -resize '390x610^' -gravity center -extent 390x610 -strip -quality 84 \
  "$repo_root/assets/levels/level4/bg_qingqiu_realm_v1.jpg"

rgba_sprite "$source_root/assets/towers/tower_baize_source.jpg" "$repo_root/assets/towers/tower_baize_v1.png" 256x256
rgba_sprite "$source_root/assets/enemies/enemy_meihu_source.jpg" "$repo_root/assets/enemies/enemy_meihu_v1.png" 256x256
rgba_sprite "$source_root/assets/enemies/enemy_huanli_source.jpg" "$repo_root/assets/enemies/enemy_huanli_v1.png" 256x256
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase1_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase1_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase2_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase2_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase3_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase3_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_cast_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_cast_v1.png" 512x512
copy_alpha_sprite "$source_root/assets/effects/fx_jiuweihu_projectile_source.png" "$repo_root/assets/effects/fx_jiuweihu_projectile_v1.png" 192x192
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_burst_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_burst_v1.png" 256x256
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_phase_aura_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_phase_aura_v1.png" 384x384
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_ultimate_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_ultimate_v1.png" 384x384
copy_alpha_sprite "$source_root/assets/effects/fx_baize_insight_mark_source.png" "$repo_root/assets/effects/fx_baize_insight_mark_v1.png" 256x256
rgba_sprite "$source_root/assets/levels/level4/map_spawn_mist_rift_source.jpg" "$repo_root/assets/levels/level4/map_spawn_mist_rift_v1.png" 256x256
rgba_sprite "$source_root/assets/levels/level4/map_base_qingqiu_altar_source.jpg" "$repo_root/assets/levels/level4/map_base_qingqiu_altar_v1.png" 256x256
rgba_sprite "$source_root/assets/ui/ui_boss_jiuweihu_panel_source.jpg" "$repo_root/assets/ui/ui_boss_jiuweihu_panel_v1.png" 768x256
rgba_sprite "$source_root/assets/ui/ui_level4_lineup_panel_source.jpg" "$repo_root/assets/ui/ui_level4_lineup_panel_v1.png" 768x256
