#!/usr/bin/env node
import { BirthdayScheduler } from './scheduler.js';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const testMode = args.includes('--test') || args.includes('-t');

async function main() {
  console.log('=== Mummy Birthday WhatsApp Scheduler ===');
  console.log(`Mode: ${testMode ? 'TEST MODE (simulated, no real WhatsApp)' : 'PRODUCTION'}`);
  console.log(`Timezone: Asia/Kolkata`);
  console.log('');

  const scheduler = new BirthdayScheduler({ baseDir, testMode });
  
  try {
    scheduler.init();
    const status = scheduler.getStatus();
    console.log(`Birthday: ${status.birthdayDate}`);
    console.log(`Total slots: ${status.slotCount}`);
    console.log(`Next pending: ${status.nextPending !== undefined && status.nextPending !== null ? status.nextPending : 'None'}`);
    console.log(`Paused: ${status.paused}`);
    console.log('');
    
    // Check for missed slots
    const missed = scheduler.checkMissedSlots();
    if (missed.length > 0) {
      console.log(`⚠️  Missed slots detected: ${missed.join(', ')}`);
      console.log('   These were not sent (app was stopped/offline). Please decide manually.');
      console.log('');
    }
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    function showMenu() {
      console.log('\n=== MENU ===');
      console.log('1. Show status');
      console.log('2. Show all slots');
      console.log('3. Open next pending message');
      console.log('4. Open message by slot number');
      console.log('5. Confirm message sent');
      console.log('6. Skip message');
      console.log('7. Pause scheduler');
      console.log('8. Resume scheduler');
      console.log('9. Reload messages');
      console.log('10. Check missed slots');
      console.log('0. Exit');
      console.log('');
      rl.question('Choose an option: ', handleChoice);
    }
    
    function handleChoice(choice) {
      try {
        switch (choice.trim()) {
          case '1': {
            const s = scheduler.getStatus();
            console.log('\n--- Status ---');
            console.log(`Birthday: ${s.birthdayDate} | TZ: ${s.timezone}`);
            console.log(`Mode: ${s.testMode ? 'TEST' : 'PROD'} | Paused: ${s.paused}`);
            console.log(`Next pending: ${s.nextPending}`);
            break;
          }
          case '2': {
            const s = scheduler.getStatus();
            console.log('\n--- All Slots ---');
            for (const slot of s.slots) {
              console.log(`[${slot.index}] ${slot.date} ${slot.time} | ${slot.status.toUpperCase()} | ${slot.messagePreview}`);
            }
            break;
          }
          case '3': {
            const next = scheduler.getNextPendingSlot();
            if (!next) {
              console.log('No pending slots.');
              break;
            }
            console.log(`\nOpening slot ${next.index} (${next.date} ${next.time})`);
            console.log(`Message: ${scheduler.messages[next.index]}`);
            const res = scheduler.openMessage(next.index);
            if (res.testMode) {
              console.log('[TEST MODE] Simulated - did not open real WhatsApp');
            } else {
              console.log('Opened in browser. Please review and send manually in WhatsApp.');
            }
            console.log('Use option 5 to confirm sent or option 6 to skip.');
            break;
          }
          case '4': {
            rl.question('Enter slot number: ', (num) => {
              try {
                const idx = parseInt(num);
                console.log(`\nMessage: ${scheduler.messages[idx]}`);
                const res = scheduler.openMessage(idx);
                if (res.testMode) {
                  console.log('[TEST MODE] Simulated');
                } else {
                  console.log('Opened in browser. Review and send manually.');
                }
                console.log('Use option 5 to confirm sent or option 6 to skip.');
              } catch (e) {
                console.log(`Error: ${e.message}`);
              }
              showMenu();
            });
            return;
          }
          case '5': {
            rl.question('Enter slot number to confirm sent: ', (num) => {
              try {
                const idx = parseInt(num);
                scheduler.confirmSent(idx);
                console.log(`✓ Slot ${idx} marked as sent`);
              } catch (e) {
                console.log(`Error: ${e.message}`);
              }
              showMenu();
            });
            return;
          }
          case '6': {
            rl.question('Enter slot number to skip: ', (num) => {
              try {
                const idx = parseInt(num);
                scheduler.skip(idx);
                console.log(`○ Slot ${idx} skipped`);
              } catch (e) {
                console.log(`Error: ${e.message}`);
              }
              showMenu();
            });
            return;
          }
          case '7': {
            scheduler.pause();
            console.log('Scheduler paused');
            break;
          }
          case '8': {
            scheduler.resume();
            console.log('Scheduler resumed');
            break;
          }
          case '9': {
            try {
              scheduler.loadMessages();
              console.log('Messages reloaded');
            } catch (e) {
              console.log(`Error: ${e.message}`);
            }
            break;
          }
          case '10': {
            const missed = scheduler.checkMissedSlots();
            if (missed.length === 0) {
              console.log('No missed slots');
            } else {
              console.log(`Missed slots: ${missed.join(', ')}`);
            }
            break;
          }
          case '0': {
            console.log('Exiting...');
            rl.close();
            process.exit(0);
          }
          default: {
            console.log('Invalid option');
            break;
          }
        }
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
      showMenu();
    }
    
    showMenu();
    
  } catch (e) {
    console.error(`Fatal error: ${e.message}`);
    console.error('\nMake sure you have:');
    console.error('1. Copied config/config.example.json to config/config.json');
    console.error('2. Configured your recipient number in config/config.json');
    console.error('3. Run from the whatsapp-birthday-scheduler directory');
    process.exit(1);
  }
}

main();
