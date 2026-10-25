# Mummy's Birthday - WhatsApp Hourly Message Scheduler

A local, manual-send WhatsApp birthday message scheduler for Windows. This application helps you prepare and send personalized birthday messages to your mother throughout her birthday using your existing personal WhatsApp account.

**Important:** This app does **NOT** automatically send messages. It opens the WhatsApp link for you to review and manually send each message. You must explicitly confirm each send.

## Features

- 24 hourly slots for 26 October 2026 (00:00 to 23:00 IST)
- Configurable birthday date, times, interval, and recipient
- 24 editable, personalized birthday messages
- Manual send workflow via `wa.me` links
- Track status per slot (pending/opened/sent/skipped/missed)
- Pause/resume functionality
- Test mode for safe testing
- Persistent state across restarts
- Missed slot detection
- No automatic sending, no credentials stored

## Requirements

- Windows 10
- Node.js >= 18.0.0
- npm (comes with Node.js)
- WhatsApp installed on your device (or WhatsApp Web accessible)
- Computer must remain awake and connected to internet while running

## Setup Instructions

### 1. Check Node.js and npm

Open Command Prompt or PowerShell and run:

```cmd
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/).

### 2. Navigate to the scheduler directory

```cmd
cd "C:\Projects\Mummy Birthday\whatsapp-birthday-scheduler"
```

### 3. Install dependencies

```cmd
npm install
```

(No dependencies are required, but this is safe to run.)

### 4. Configure recipient number

Copy the example config and edit it:

```cmd
copy config\config.example.json config\config.json
```

Edit `config\config.json` with your preferred text editor (Notepad, VS Code, etc.):

```json
{
  "birthdayDate": "2026-10-26",
  "timezone": "Asia/Kolkata",
  "startTime": "00:00",
  "endTime": "23:00",
  "intervalMinutes": 60,
  "recipient": {
    "countryCode": "91",
    "number": "9876543210"
  }
}
```

- `countryCode`: Country code without + (e.g., 91 for India)
- `number`: Phone number without country code
- Use your actual WhatsApp number

**Never commit real phone numbers.** `config/config.json` is gitignored.

### 5. Edit the message list (optional)

Open `messages.json` in your text editor. It contains 24 messages (one per slot). You can:
- Edit existing messages
- Reorder messages
- Add messages (but ensure count matches slots or adjust schedule)
- Remove messages

The app validates that messages exist for each slot.

### 6. Run automated tests

```cmd
npm test
```

All tests should pass. Tests cover schedule calculation, timezone handling, URL encoding, phone validation, etc.

## Running the Scheduler

### 7. Run in test mode (safe, no real WhatsApp)

Test mode simulates everything without opening real WhatsApp links:

```cmd
npm start -- --test
```

Or:

```cmd
node src/index.js --test
```

In test mode:
- No real browser/WhatsApp links opened
- All actions are simulated
- Safe to test restart recovery, state changes, etc.

### 8. Start the real schedule

**Before starting:**
- Make sure your computer will stay awake
- Connected to internet
- WhatsApp is accessible on your device

```cmd
npm start
```

Or:

```cmd
node src/index.js
```

### 9. Open and manually send a scheduled WhatsApp message

From the menu:
1. Choose option `3` to open the next pending message, OR
2. Choose option `4` and enter a specific slot number

This will open `https://wa.me/...` with the pre-filled message in your default browser. 
- Review the message
- Send it manually in WhatsApp (on your phone or WhatsApp Web)
- Return to the app

### 10. Confirm, skip, pause, resume, and stop

From the menu:
- `5` - Confirm message sent (enter slot number)
- `6` - Skip message (enter slot number)
- `7` - Pause scheduler
- `8` - Resume scheduler
- `0` - Exit

**Important:** The app only marks a slot as "sent" when you explicitly confirm it with option 5. Opening the link does NOT mark it as sent.

### 11. Restart safely

If you stop the app (exit) or if your computer sleeps/restarts:
1. Start the app again: `npm start`
2. The app will load previous state from `data/state.json`
3. It will check for missed slots and report them
4. It will NOT automatically send backlog messages
5. You decide what to do with missed slots manually

**Do not rely on automatic catch-up.** Missed slots are reported for your awareness.

### 12. View logs

Logs are stored in:
```
logs/scheduler.log
```

Each line contains a timestamped JSON entry of events (init, open_message, confirm_sent, skip, missed_slots, etc.).

### 13. How to avoid duplicate messages

- Each slot can only be marked sent once (explicit confirmation required)
- State is persisted to `data/state.json`
- On restart, previous states are loaded
- The app prevents automatic re-sending
- Always confirm or skip each message explicitly

### 14. How to change the schedule for a future birthday

1. Edit `config/config.json`:
   - Change `birthdayDate` to the new date (YYYY-MM-DD)
   - Adjust `startTime`, `endTime`, `intervalMinutes` as needed
2. The number of slots is calculated automatically from your schedule
3. Update `messages.json` with new messages if desired
4. Delete or reset `data/state.json` if starting fresh: `del data\state.json` (on Windows)
5. Restart the app

## Important Notes

- **Computer must stay awake:** If your computer sleeps or is powered off, the scheduler cannot open messages. Windows power settings may put your PC to sleep.
- **No guarantee of delivery:** This is a manual workflow. You control when messages are sent.
- **No auto-send:** The app will never click Send or automate WhatsApp sending.
- **No credentials stored:** No passwords, cookies, QR codes, or session data are stored.
- **Local only:** All data stays on your computer.
- **Test first:** Always test with `--test` mode before using on the actual birthday.

## Optional: Windows Task Scheduler

You can use Windows Task Scheduler to launch this app automatically, but **there are important caveats**:

1. Open Task Scheduler
2. Create a new task
3. Set trigger (e.g., at startup or at a specific time)
4. Set action: Start a program
   - Program: `node` (or full path to node.exe)
   - Arguments: `src/index.js` (or `src\index.js`)
   - Start in: `C:\Projects\Mummy Birthday\whatsapp-birthday-scheduler`

**Caveats:**
- Task Scheduler cannot wake a powered-off computer
- If the computer is asleep, the task may not run depending on power settings
- Even if launched, the app still needs the computer awake to open browser/WhatsApp links
- You still need to manually send messages and confirm them
- Auto-starting does not solve the "computer must stay awake" requirement

## Troubleshooting

- **Config not found:** Copy `config/config.example.json` to `config/config.json`
- **Invalid messages:** Ensure all messages are non-empty strings in `messages.json`
- **Invalid phone number:** Check country code and number format
- **Missed slots:** Normal if app was stopped. Handle manually.
- **WhatsApp doesn't open:** Check default browser settings

## Remaining Limitations

- Cannot send messages automatically (by design)
- Requires computer to be awake and running
- Cannot run while computer is powered off
- No cloud sync
- Manual confirmation required for each message
- Browser must be able to open `wa.me` links
