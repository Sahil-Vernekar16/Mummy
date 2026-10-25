import { getSlots } from './time.js';
import { readJSON, writeJSON, logToFile, buildWhatsAppUrl } from './utils.js';
import path from 'path';
import { exec } from 'child_process';

class BirthdayScheduler {
  constructor(options = {}) {
    this.baseDir = options.baseDir;
    this.configPath = options.configPath || path.join(this.baseDir, 'config', 'config.json');
    this.configExamplePath = options.configExamplePath || path.join(this.baseDir, 'config', 'config.example.json');
    this.messagesPath = options.messagesPath || path.join(this.baseDir, 'messages.json');
    this.statePath = options.statePath || path.join(this.baseDir, 'data', 'state.json');
    this.logPath = options.logPath || path.join(this.baseDir, 'logs', 'scheduler.log');
    this.testMode = options.testMode || false;
    this.paused = false;
    this.running = false;
    this.config = null;
    this.messages = [];
    this.slots = [];
    this.state = {
      slots: {}, // slotIndex -> { status: 'pending'|'opened'|'sent'|'skipped'|'missed', openedAt?, sentAt?, skippedAt?, missedAt? }
      lastChecked: null,
      paused: false
    };
  }

  loadConfig() {
    try {
      this.config = readJSON(this.configPath);
    } catch (e) {
      throw new Error(`Config not found. Copy config/config.example.json to config/config.json and configure it.\n${e.message}`);
    }
    // Basic validation
    if (!this.config.birthdayDate) throw new Error('birthdayDate missing in config');
    if (!this.config.timezone) throw new Error('timezone missing in config');
    if (!this.config.startTime || !this.config.endTime) throw new Error('startTime/endTime missing in config');
    if (typeof this.config.intervalMinutes !== 'number') throw new Error('intervalMinutes must be number');
    if (!this.config.recipient) throw new Error('recipient missing in config');
    return this.config;
  }

  loadMessages() {
    this.messages = readJSON(this.messagesPath);
    if (!Array.isArray(this.messages)) throw new Error('messages.json must be an array');
    if (this.messages.length === 0) throw new Error('messages.json cannot be empty');
    // Filter out non-strings? but just validate
    for (let i = 0; i < this.messages.length; i++) {
      if (typeof this.messages[i] !== 'string' || this.messages[i].trim() === '') {
        throw new Error(`Message at index ${i} is invalid or empty`);
      }
    }
    return this.messages;
  }

  loadState() {
    try {
      this.state = readJSON(this.statePath);
      if (!this.state.slots) this.state.slots = {};
    } catch (e) {
      // Initialize fresh state
      this.state = {
        slots: {},
        lastChecked: null,
        paused: false
      };
      this.saveState();
    }
    this.paused = this.state.paused || false;
    return this.state;
  }

  saveState() {
    this.state.lastChecked = new Date().toISOString();
    this.state.paused = this.paused;
    writeJSON(this.statePath, this.state);
  }

  init() {
    this.loadConfig();
    this.loadMessages();
    this.loadState();
    this.slots = getSlots(this.config);
    // Ensure state entries exist
    for (const slot of this.slots) {
      if (!this.state.slots[slot.index]) {
        this.state.slots[slot.index] = { status: 'pending' };
      }
    }
    this.saveState();
    logToFile(this.logPath, { event: 'init', testMode: this.testMode, slotCount: this.slots.length });
    return { config: this.config, messages: this.messages, slots: this.slots, state: this.state };
  }

  getNextPendingSlot() {
    for (const slot of this.slots) {
      const st = this.state.slots[slot.index];
      if (st && st.status === 'pending') {
        return slot;
      }
    }
    return null;
  }

  getSlotStatus(slotIndex) {
    return this.state.slots[slotIndex] || { status: 'pending' };
  }

  openMessage(slotIndex) {
    const slot = this.slots.find(s => s.index === slotIndex);
    if (!slot) throw new Error('Invalid slot index');
    if (!this.messages[slotIndex]) throw new Error(`No message found for slot ${slotIndex}`);
    const message = this.messages[slotIndex];
    const url = buildWhatsAppUrl(this.config.recipient, message);
    if (this.testMode) {
      logToFile(this.logPath, { event: 'open_message_test', slotIndex, url: '[REDACTED]' });
      this.state.slots[slotIndex] = { ...this.state.slots[slotIndex], status: 'opened', openedAt: new Date().toISOString(), testMode: true };
      this.saveState();
      return { success: true, testMode: true, url };
    }
    // Open in default browser
    try {
      const platform = process.platform;
      if (platform === 'win32') {
        exec(`start "" "${url}"`);
      } else if (platform === 'darwin') {
        exec(`open "${url}"`);
      } else {
        exec(`xdg-open "${url}"`);
      }
      logToFile(this.logPath, { event: 'open_message', slotIndex });
      this.state.slots[slotIndex] = { ...this.state.slots[slotIndex], status: 'opened', openedAt: new Date().toISOString() };
      this.saveState();
      return { success: true, url };
    } catch (e) {
      logToFile(this.logPath, { event: 'open_message_error', slotIndex, error: e.message });
      throw e;
    }
  }

  confirmSent(slotIndex) {
    if (!this.slots.find(s => s.index === slotIndex)) throw new Error('Invalid slot index');
    this.state.slots[slotIndex] = { ...this.state.slots[slotIndex], status: 'sent', sentAt: new Date().toISOString() };
    this.saveState();
    logToFile(this.logPath, { event: 'confirm_sent', slotIndex });
    return { success: true };
  }

  skip(slotIndex) {
    if (!this.slots.find(s => s.index === slotIndex)) throw new Error('Invalid slot index');
    this.state.slots[slotIndex] = { ...this.state.slots[slotIndex], status: 'skipped', skippedAt: new Date().toISOString() };
    this.saveState();
    logToFile(this.logPath, { event: 'skip', slotIndex });
    return { success: true };
  }

  pause() {
    this.paused = true;
    this.saveState();
    logToFile(this.logPath, { event: 'pause' });
  }

  resume() {
    this.paused = false;
    this.saveState();
    logToFile(this.logPath, { event: 'resume' });
  }

  stop() {
    this.running = false;
    logToFile(this.logPath, { event: 'stop' });
  }

  getStatus() {
    return {
      testMode: this.testMode,
      paused: this.paused,
      birthdayDate: this.config?.birthdayDate,
      timezone: this.config?.timezone,
      slotCount: this.slots.length,
      slots: this.slots.map(slot => ({
        ...slot,
        messagePreview: this.messages[slot.index] ? (this.messages[slot.index].substring(0, 60) + (this.messages[slot.index].length > 60 ? '...' : '')) : null,
        status: this.getSlotStatus(slot.index).status
      })),
      nextPending: this.getNextPendingSlot()?.index
    };
  }

  checkMissedSlots() {
    const now = new Date();
    const missed = [];
    for (const slot of this.slots) {
      const st = this.state.slots[slot.index];
      if (st.status === 'pending' || st.status === 'opened') {
        // If the slot time has passed (simple check - compare date/time strings)
        const slotDateTime = new Date(`${slot.date}T${slot.time}:00+05:30`);
        if (slotDateTime < now) {
          // Mark as missed if not sent/skipped
          if (st.status !== 'sent' && st.status !== 'skipped') {
            this.state.slots[slot.index] = { ...st, status: 'missed', missedAt: new Date().toISOString() };
            missed.push(slot.index);
          }
        }
      }
    }
    if (missed.length > 0) {
      this.saveState();
      logToFile(this.logPath, { event: 'missed_slots', slots: missed });
    }
    return missed;
  }
}

export { BirthdayScheduler };
