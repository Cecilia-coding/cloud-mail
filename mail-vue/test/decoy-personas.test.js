import test from 'node:test';
import assert from 'node:assert/strict';
import { DECOY_CATEGORIES, DECOY_PERSONAS } from '../src/utils/decoy-personas.js';

test('decoy persona keys stay unique and categories stay registered', () => {
  const keys = DECOY_PERSONAS.map(persona => persona.key);
  const knownCategories = new Set(DECOY_CATEGORIES.map(category => category.key));

  assert.equal(new Set(keys).size, keys.length);
  for (const persona of DECOY_PERSONAS) {
    assert.ok(knownCategories.has(persona.category), `${persona.key} uses an unknown category`);
  }
});

test('keeps the restored Imoo Z6 and Gree Phone 3 personas', () => {
  const imoo = DECOY_PERSONAS.find(persona => persona.key === 'imoo_watch');
  const gree = DECOY_PERSONAS.find(persona => persona.key === 'gree_phone');

  assert.ok(imoo, 'imoo_watch should remain in the decoy catalog');
  assert.equal(imoo.resolution, '320 × 360');
  assert.match(imoo.specs, /512MB RAM \+ 8GB/);

  assert.ok(gree, 'gree_phone should remain in the decoy catalog');
  assert.equal(gree.chip, 'Qualcomm Snapdragon 821 (MSM8996SG)');
  assert.match(gree.specs, /3160mAh/);
});

test('registers the Mitsubishi Heavy Industries excavator persona in scifi_defense', () => {
  const excavator = DECOY_PERSONAS.find(persona => persona.key === 'mitsubishi_excavator');
  assert.ok(excavator, 'mitsubishi_excavator should be registered in the decoy catalog');
  assert.equal(excavator.category, 'scifi_defense');
  assert.equal(excavator.resolution, '640 × 480 (油污电阻单色工控屏)');
  assert.match(excavator.specs, /柴油机/);
  assert.match(excavator.userAgent, /Heavy-Machinery/);
});
