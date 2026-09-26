import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BOSS_HUD_GEOMETRY } from '../src/config/artAssets.js';

const PANEL_WIDTH = 414;
const PANEL_HEIGHT = 44;

function percent(value) {
  return Number.parseFloat(value) / 100;
}

test('the five existing Boss HP fills retain their approved normalized geometry', () => {
  const measuredChannels = {
    qiongqi: { left: 6, top: 24, width: 402, height: 7 },
    paoxiao: { left: 16, top: 24.5, width: 382, height: 4.5 },
    xiangliu: { left: 4, top: 24, width: 406, height: 5 },
    jiuweihu: { left: 63, top: 27, width: 326, height: 5 },
    xingtian: { left: 40, top: 23, width: 335, height: 7.5 },
  };

  for (const [type, channel] of Object.entries(measuredChannels)) {
    const geometry = BOSS_HUD_GEOMETRY[type];
    const rendered = {
      left: percent(geometry.left) * PANEL_WIDTH,
      top: percent(geometry.top) * PANEL_HEIGHT,
      width: percent(geometry.width) * PANEL_WIDTH,
      height: percent(geometry.height) * PANEL_HEIGHT,
    };
    for (const key of ['left', 'top', 'width', 'height']) {
      assert.ok(Math.abs(rendered[key] - channel[key]) <= 1, `${type} rendered ${key} misses its measured empty channel`);
    }
    for (const ratio of [1, 0.5, 0.25]) {
      const fillRight = rendered.left + rendered.width * ratio;
      assert.ok(rendered.left >= channel.left - 1);
      assert.ok(fillRight <= channel.left + channel.width + 1);
      assert.ok(rendered.top >= channel.top - 1);
      assert.ok(rendered.top + rendered.height <= channel.top + channel.height + 1);
    }
  }
});

test('Jinwu HP fill matches its measured channel in the real absolute-positioning containing box', () => {
  const channel = { left: 21, top: 20, width: 372, height: 7 };
  const border = 6;
  const containingWidth = PANEL_WIDTH - border * 2;
  const containingHeight = PANEL_HEIGHT - border * 2;
  const geometry = BOSS_HUD_GEOMETRY.jinwu;
  const rendered = {
    left: border + percent(geometry.left) * containingWidth,
    top: border + percent(geometry.top) * containingHeight,
    width: percent(geometry.width) * containingWidth,
    height: percent(geometry.height) * containingHeight,
  };
  for (const key of ['left', 'top', 'width', 'height']) {
    assert.ok(Math.abs(rendered[key] - channel[key]) <= 0.6, `jinwu rendered ${key} misses its measured empty channel`);
  }
  for (const ratio of [1, 0.5, 0.25]) {
    assert.ok(rendered.left + rendered.width * ratio <= channel.left + channel.width + 0.6);
    assert.ok(rendered.top + rendered.height <= channel.top + channel.height + 0.6);
  }
});

test('Kui HP fill stays inside the conservative empty channel after the real nine-slice mapping', () => {
  const channel = { left: 46, top: 23, width: 323, height: 4.5 };
  const border = 6;
  const containingWidth = PANEL_WIDTH - border * 2;
  const containingHeight = PANEL_HEIGHT - border * 2;
  const geometry = BOSS_HUD_GEOMETRY.kui;
  const rendered = {
    left: border + percent(geometry.left) * containingWidth,
    top: border + percent(geometry.top) * containingHeight,
    width: percent(geometry.width) * containingWidth,
    height: percent(geometry.height) * containingHeight,
  };
  for (const key of ['left', 'top', 'width', 'height']) {
    assert.ok(Math.abs(rendered[key] - channel[key]) <= 0.65, `kui rendered ${key} misses its measured empty channel`);
  }
  for (const ratio of [1, 0.5, 0.25]) {
    assert.ok(rendered.left + rendered.width * ratio <= channel.left + channel.width + 0.65);
    assert.ok(rendered.top + rendered.height <= channel.top + channel.height + 0.65);
  }
});

test('Huashe HP fill maps into the approved 768x183 transparent channel without changing HUD height', () => {
  const sourceChannel = { left: 98, top: 106, width: 572, height: 23 };
  const channel = {
    left: sourceChannel.left / 768 * PANEL_WIDTH,
    top: sourceChannel.top / 183 * PANEL_HEIGHT,
    width: sourceChannel.width / 768 * PANEL_WIDTH,
    height: sourceChannel.height / 183 * PANEL_HEIGHT,
  };
  const border = 6;
  const geometry = BOSS_HUD_GEOMETRY.huashe;
  const rendered = {
    left: border + percent(geometry.left) * (PANEL_WIDTH - border * 2),
    top: border + percent(geometry.top) * (PANEL_HEIGHT - border * 2),
    width: percent(geometry.width) * (PANEL_WIDTH - border * 2),
    height: percent(geometry.height) * (PANEL_HEIGHT - border * 2),
  };
  for (const key of ['left', 'top', 'width', 'height']) {
    assert.ok(Math.abs(rendered[key] - channel[key]) <= 0.8, `huashe rendered ${key} misses its approved empty channel`);
  }
});

test('Zhulong HP fill maps into the measured long lower channel inside the fixed 44px HUD', () => {
  const sourceChannel = { left: 134, top: 120, width: 498, height: 18 };
  const border = 6;
  const sourceSlice = 35;
  const geometry = BOSS_HUD_GEOMETRY.zhulong;
  const channel = {
    left: border + (sourceChannel.left - sourceSlice) / (768 - sourceSlice * 2) * (PANEL_WIDTH - border * 2),
    top: border + (sourceChannel.top - sourceSlice) / (213 - sourceSlice * 2) * (PANEL_HEIGHT - border * 2),
    width: sourceChannel.width / (768 - sourceSlice * 2) * (PANEL_WIDTH - border * 2),
    height: sourceChannel.height / (213 - sourceSlice * 2) * (PANEL_HEIGHT - border * 2),
  };
  const rendered = {
    left: border + percent(geometry.left) * (PANEL_WIDTH - border * 2),
    top: border + percent(geometry.top) * (PANEL_HEIGHT - border * 2),
    width: percent(geometry.width) * (PANEL_WIDTH - border * 2),
    height: percent(geometry.height) * (PANEL_HEIGHT - border * 2),
  };
  for (const key of ['left', 'top', 'width', 'height']) {
    assert.ok(Math.abs(rendered[key] - channel[key]) <= 0.8, `zhulong rendered ${key} misses its measured empty channel`);
  }
});

test('Zhulong name centers inside the measured upper reserve using the real padding-box origin', async () => {
  const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const rule = styles.match(/\.boss-hud\[data-boss-type="zhulong"\] strong \{([^}]*)\}/)?.[1] ?? '';
  const css = Object.fromEntries([...rule.matchAll(/(top|left|width):\s*([\d.]+)(px|%)/g)].map(match => [match[1], Number(match[2])]));
  const sourceChannel = { left: 310, top: 80, width: 148, height: 26 };
  const sourceSlice = 35;
  const border = 6;
  const containingWidth = PANEL_WIDTH - border * 2;
  const containingHeight = PANEL_HEIGHT - border * 2;
  const expected = {
    left: border + (sourceChannel.left - sourceSlice) / (768 - sourceSlice * 2) * containingWidth,
    width: sourceChannel.width / (768 - sourceSlice * 2) * containingWidth,
    centerY: border + (sourceChannel.top + sourceChannel.height / 2 - sourceSlice) / (213 - sourceSlice * 2) * containingHeight,
  };
  const rendered = {
    left: border + css.left / 100 * containingWidth,
    width: css.width / 100 * containingWidth,
    centerY: border + css.top + 6,
  };
  for (const key of ['left', 'width', 'centerY']) {
    assert.ok(Math.abs(rendered[key] - expected[key]) <= 0.2, `zhulong name ${key} misses its measured reserve`);
  }
});
