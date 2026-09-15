#!/usr/bin/env bash
set -euo pipefail

source_dir=${1:?"usage: scripts/prepare-level5-assets.sh <level5-source-assets-dir>"}
repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

source_for() {
  local prefix=$1
  local matches=("$source_dir"/"$prefix"_*)
  [[ -f "${matches[0]}" ]] || { echo "missing source prefix $prefix" >&2; exit 1; }
  printf '%s' "${matches[0]}"
}

alpha_asset() {
  local input=$1 output=$2 resize=$3 extent=$4
  mkdir -p "$(dirname "$output")"
  convert "$input" \
    -bordercolor white -border 1x1 -alpha set -channel RGBA \
    -fuzz 12% -fill none -draw 'matte 0,0 floodfill' \
    -shave 1x1 -trim +repage -resize "$resize" \
    -gravity center -background none -extent "$extent" \
    -strip -define png:compression-level=9 "PNG32:$output"
}

mkdir -p "$repo_dir/assets/levels/level5" "$repo_dir/assets/enemies" \
  "$repo_dir/assets/bosses" "$repo_dir/assets/effects" "$repo_dir/assets/ui"

convert "$(source_for 01)" -resize '390x610!' -strip -sampling-factor 4:4:4 -quality 84 \
  "$repo_dir/assets/levels/level5/bg_buzhoushan_ruins_v1.jpg"
alpha_asset "$(source_for 02)" "$repo_dir/assets/levels/level5/map_spawn_lava_portal_v1.png" '236x236>' '256x256'
alpha_asset "$(source_for 03)" "$repo_dir/assets/levels/level5/map_base_tianzhu_core_v1.png" '236x236>' '256x256'
alpha_asset "$(source_for 04)" "$repo_dir/assets/enemies/enemy_zhuyan_v1.png" '236x236>' '256x256'
alpha_asset "$(source_for 05)" "$repo_dir/assets/enemies/enemy_lili_v1.png" '236x236>' '256x256'
alpha_asset "$(source_for 06)" "$repo_dir/assets/bosses/boss_xingtian_phase1_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 07)" "$repo_dir/assets/bosses/boss_xingtian_phase2_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 08)" "$repo_dir/assets/effects/fx_zhuyan_charge_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 09)" "$repo_dir/assets/effects/fx_lili_armor_break_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 10)" "$repo_dir/assets/effects/fx_xingtian_shield_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 11)" "$repo_dir/assets/effects/fx_xingtian_evolution_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 12)" "$repo_dir/assets/effects/fx_xingtian_earthquake_v1.png" '360x360>' '384x384'
alpha_asset "$(source_for 13)" "$repo_dir/assets/ui/ui_boss_xingtian_panel_v1.png" '740x228>' '768x256'
alpha_asset "$(source_for 14)" "$repo_dir/assets/ui/ui_level5_banner_v1.png" '740x228>' '768x256'
alpha_asset "$(source_for 15)" "$repo_dir/assets/ui/ui_level5_boss_warning_v1.png" '740x228>' '768x256'
convert "$(source_for 16)" -resize '384x512!' -strip -sampling-factor 4:4:4 -quality 84 \
  "$repo_dir/assets/ui/ui_level5_preview_v1.jpg"
