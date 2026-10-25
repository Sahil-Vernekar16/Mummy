// Time utilities for Asia/Kolkata timezone
const TIMEZONE = 'Asia/Kolkata';

function getNowInTZ(date = new Date()) {
  // Use Intl to get parts in IST
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find(p => p.type === type).value;
  return {
    year: parseInt(get('year')),
    month: parseInt(get('month')),
    day: parseInt(get('day')),
    hour: parseInt(get('hour')),
    minute: parseInt(get('minute')),
    second: parseInt(get('second')),
    dateString: `${get('year')}-${get('month')}-${get('day')}`
  };
}

function parseDateString(dateString) {
  // dateString YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function parseTimeString(timeString) {
  // HH:MM
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
}

function buildDateTime(dateString, timeString, timezone = TIMEZONE) {
  // Create a date object representing that time in IST
  // We construct by formatting
  return { dateString, timeString, timezone };
}

function getSlots(config) {
  const { birthdayDate, startTime, endTime, intervalMinutes } = config;
  const slots = [];
  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);
  let currentMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;
  let slotIndex = 0;
  while (currentMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60) % 24;
    const minute = currentMinutes % 60;
    slots.push({
      index: slotIndex,
      date: birthdayDate,
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      datetimeKey: `${birthdayDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`
    });
    currentMinutes += intervalMinutes;
    slotIndex++;
  }
  return slots;
}

export {
  TIMEZONE,
  getNowInTZ,
  parseDateString,
  parseTimeString,
  buildDateTime,
  getSlots
};
