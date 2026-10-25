import { test } from 'node:test';
import assert from 'node:assert';
import { BirthdayScheduler } from '../src/scheduler.js';
import { getSlots } from '../src/time.js';
import { buildWhatsAppUrl, validatePhoneNumber } from '../src/utils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');

test('getSlots calculates correct number of slots', () => {
  const config = {
    birthdayDate: '2026-10-26',
    startTime: '00:00',
    endTime: '23:00',
    intervalMinutes: 60
  };
  const slots = getSlots(config);
  assert.strictEqual(slots.length, 24);
});

test('getSlots with different interval', () => {
  const config = {
    birthdayDate: '2026-10-26',
    startTime: '00:00',
    endTime: '02:00',
    intervalMinutes: 60
  };
  const slots = getSlots(config);
  assert.strictEqual(slots.length, 3);
});

test('validatePhoneNumber works', () => {
  const result = validatePhoneNumber({ countryCode: '91', number: '9876543210' });
  assert.strictEqual(result.full, '919876543210');
});

test('buildWhatsAppUrl encodes message correctly', () => {
  const url = buildWhatsAppUrl({ countryCode: '91', number: '9876543210' }, 'Hello, Mummy! How are you?');
  assert.ok(url.includes('wa.me/919876543210'));
  assert.ok(url.includes('text='));
});

test('buildWhatsAppUrl encodes punctuation and emoji', () => {
  const url = buildWhatsAppUrl({ countryCode: '91', number: '1234567890' }, 'Happy birthday!!! 🎉');
  assert.ok(url.includes('wa.me/'));
  assert.ok(decodeURIComponent(url).includes('🎉'));
});
