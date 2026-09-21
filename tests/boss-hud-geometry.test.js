import test from 'node:test';
import assert from 'node:assert/strict';
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
