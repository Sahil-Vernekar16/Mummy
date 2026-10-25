import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${e.message}`);
  }
}

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function validatePhoneNumber(recipient) {
  if (!recipient) {
    throw new Error('Recipient is missing in config');
  }
  const countryCode = String(recipient.countryCode || '').replace(/\D/g, '');
  const number = String(recipient.number || '').replace(/\D/g, '');
  if (countryCode.length < 1 || countryCode.length > 4) {
    throw new Error('Invalid country code');
  }
  if (number.length < 7 || number.length > 15) {
    throw new Error('Invalid phone number');
  }
  // Basic validation
  return { countryCode, number, full: countryCode + number };
}

function encodeWhatsAppMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }
  // Use encodeURIComponent for wa.me
  return encodeURIComponent(message);
}

function buildWhatsAppUrl(recipient, message) {
  const { full } = validatePhoneNumber(recipient);
  const encoded = encodeWhatsAppMessage(message);
  return `https://wa.me/${full}?text=${encoded}`;
}

function logToFile(logPath, entry) {
  const dir = path.dirname(logPath);
  ensureDir(dir);
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${JSON.stringify(entry)}\n`;
  fs.appendFileSync(logPath, line, 'utf-8');
}

export {
  ensureDir,
  readJSON,
  writeJSON,
  validatePhoneNumber,
  encodeWhatsAppMessage,
  buildWhatsAppUrl,
  logToFile
};
