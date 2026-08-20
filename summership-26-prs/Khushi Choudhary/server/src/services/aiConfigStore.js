// Reads/writes the mentor's per-provider settings (data/aiConfig.json) —
// which provider is active, and each provider's key/model/baseUrl. This file
// is gitignored: it holds real API keys and is never committed. Keys are
// masked before any of this ever reaches the browser — see readMaskedConfig.

const fs = require('fs/promises');
const path = require('path');
const { AI_PROVIDERS } = require('./providers');

const configPath = path.join(__dirname, '..', 'data', 'aiConfig.json');

function defaultConfig() {
  const providers = {};
  AI_PROVIDERS.forEach((name) => {
    providers[name] = { apiKey: '', model: '', ...(name === 'custom' ? { baseUrl: '' } : {}) };
  });
  return { activeProvider: 'anthropic', providers };
}

async function ensureConfig() {
  try {
    await fs.access(configPath);
  } catch {
    await writeConfig(defaultConfig());
  }
}

async function readConfig() {
  await ensureConfig();
  const raw = await fs.readFile(configPath, 'utf8');
  return JSON.parse(raw);
}

async function writeConfig(config) {
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 4) return '*'.repeat(key.length);
  return `${'*'.repeat(key.length - 4)}${key.slice(-4)}`;
}

// This is the shape ever sent to the browser. The real key never leaves the
// server. availableProviders lives here (not bolted on by individual routes)
// so every caller — GET /config, PUT /config/active-provider, PUT
// /config/providers/:name — returns the exact same shape. Previously only
// the GET route added it by hand, so the settings screen would crash the
// moment you saved a key or switched providers, since that response was
// missing the field the UI needed to render the provider list.
async function readMaskedConfig() {
  const config = await readConfig();
  const providers = {};
  Object.entries(config.providers).forEach(([name, entry]) => {
    providers[name] = {
      ...entry,
      apiKey: maskKey(entry.apiKey),
      hasKey: Boolean(entry.apiKey)
    };
  });
  return { activeProvider: config.activeProvider, providers, availableProviders: AI_PROVIDERS };
}

async function setActiveProvider(providerName) {
  if (!AI_PROVIDERS.includes(providerName)) {
    throw new Error(`Unknown provider "${providerName}"`);
  }
  const config = await readConfig();
  config.activeProvider = providerName;
  await writeConfig(config);
  return readMaskedConfig();
}

// patch: { apiKey?, model?, baseUrl? } — only provided fields are updated,
// so re-saving the form doesn't wipe a key you didn't mean to change (the
// browser never sees the real key, so it can't round-trip it back to you).
async function updateProvider(providerName, patch) {
  if (!AI_PROVIDERS.includes(providerName)) {
    throw new Error(`Unknown provider "${providerName}"`);
  }
  const config = await readConfig();
  config.providers[providerName] = {
    ...config.providers[providerName],
    ...(typeof patch.apiKey === 'string' && patch.apiKey.length ? { apiKey: patch.apiKey } : {}),
    ...(typeof patch.model === 'string' ? { model: patch.model } : {}),
    ...(typeof patch.baseUrl === 'string' ? { baseUrl: patch.baseUrl } : {})
  };
  await writeConfig(config);
  return readMaskedConfig();
}

// server-only accessor — never expose this return value to a client response
async function getActiveProviderCredentials() {
  const config = await readConfig();
  const active = config.providers[config.activeProvider];
  return { providerName: config.activeProvider, ...active };
}

module.exports = {
  readConfig,
  readMaskedConfig,
  setActiveProvider,
  updateProvider,
  getActiveProviderCredentials
};
