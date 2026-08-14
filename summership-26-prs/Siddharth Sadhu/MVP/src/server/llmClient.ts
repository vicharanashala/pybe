import { GoogleGenAI } from '@google/genai';

console.log('[LLMClient] File llmClient.ts loaded successfully!');

/**
 * Unified LLM Request Options
 */
export interface GenerateOptions {
  systemInstruction?: string;
  userPrompt: string;
  responseSchema?: any;
  maxTokens?: number;    // Explicit token budget — use 32768 for production passes, 8192 for analysis
  temperature?: number;  // 0.85 for narrative/creative, 0.6 for structured JSON
  selectedProvider?: 'auto' | 'kimi' | 'groq' | 'minimax' | 'gemini'; // User selected LLM provider
}

/**
 * Key State Tracking for Multi-Key Rotation & Lockout
 */
interface KeyState {
  key: string;
  maskedKey: string;
  rateLimitedUntil: number; // Timestamp in ms when lock expires
  failCount: number;
}

// Memory pools of keys per provider
const keyPools: Record<string, KeyState[]> = {
  kimi: [],
  groq: [],
  gemini: [],
  minimax: []
};

// Pointer for round-robin key selection
const keyPointers: Record<string, number> = {
  kimi: 0,
  groq: 0,
  gemini: 0,
  minimax: 0
};

/**
 * Safe key masking for logging (e.g. "gsk_uy3J...tojz")
 */
function maskKey(key: string): string {
  if (!key || key.length <= 10) return '***';
  return key.substring(0, 8) + '...' + key.substring(key.length - 4);
}

/**
 * Discover all valid API keys for a provider from process.env.
 * Supports:
 * - Single keys: GROQ_API_KEY, GEMINI_API_KEY, MINIMAX_API_KEY
 * - Comma/space separated: GROQ_API_KEYS="key1,key2,key3"
 * - Numbered variables: GROQ_API_KEY_1, GROQ_API_KEY_2, GROQ_API_KEY1, GROQ_API_KEY2
 * - Typo tolerance: GR0Q_API_KEY1 (with zero 0 instead of letter O)
 */
function discoverKeysForProvider(provider: 'kimi' | 'groq' | 'gemini' | 'minimax'): KeyState[] {
  const foundKeys: string[] = [];
  const env = process.env;

  if (provider === 'kimi') {
    const patterns = [/^(KIMI)(_API|_KEYS|_KEY|_[0-9]+|[0-9]+)*$/i];
    for (const envKey of Object.keys(env)) {
      if (patterns.some(p => p.test(envKey))) {
        const val = env[envKey];
        if (val) {
          const parts = val.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
          foundKeys.push(...parts);
        }
      }
    }
  } else if (provider === 'groq') {
    const patterns = [/^(GROQ|GR0Q)(_API|_KEYS|_KEY|_[0-9]+|[0-9]+)*$/i];
    for (const envKey of Object.keys(env)) {
      if (patterns.some(p => p.test(envKey))) {
        const val = env[envKey];
        if (val) {
          const parts = val.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
          foundKeys.push(...parts);
        }
      }
    }
  } else if (provider === 'gemini') {
    const patterns = [/^(GEMINI)(_API|_KEYS|_KEY|_[0-9]+|[0-9]+)*$/i];
    for (const envKey of Object.keys(env)) {
      if (patterns.some(p => p.test(envKey))) {
        const val = env[envKey];
        if (val) {
          const parts = val.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
          foundKeys.push(...parts);
        }
      }
    }
  } else if (provider === 'minimax') {
    const patterns = [/^(MINIMAX)(_API|_KEYS|_KEY|_[0-9]+|[0-9]+)*$/i];
    for (const envKey of Object.keys(env)) {
      if (patterns.some(p => p.test(envKey))) {
        const val = env[envKey];
        if (val) {
          const parts = val.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
          foundKeys.push(...parts);
        }
      }
    }
  }

  // Deduplicate and filter out placeholders
  const uniqueKeys = Array.from(new Set(foundKeys)).filter(k =>
    k.length > 5 &&
    !k.includes('your_') &&
    !k.includes('MOCK_KEY')
  );

  // Preserve existing rateLimitedUntil timestamps if already tracked
  const currentPool = keyPools[provider] || [];
  const updatedPool: KeyState[] = uniqueKeys.map(k => {
    const existing = currentPool.find(item => item.key === k);
    return existing || {
      key: k,
      maskedKey: maskKey(k),
      rateLimitedUntil: 0,
      failCount: 0
    };
  });

  keyPools[provider] = updatedPool;
  return updatedPool;
}

/**
 * Get next available (unlocked) key for a provider.
 * Returns null if all keys are currently rate-limited, along with wait time.
 */
function getAvailableKey(provider: 'kimi' | 'groq' | 'gemini' | 'minimax'): {
  keyState: KeyState | null;
  keyIndex: number;
  poolSize: number;
  minWaitTimeMs: number;
} {
  const pool = discoverKeysForProvider(provider);
  if (pool.length === 0) {
    return { keyState: null, keyIndex: -1, poolSize: 0, minWaitTimeMs: 0 };
  }

  const now = Date.now();
  const startIdx = keyPointers[provider] % pool.length;

  // Search round-robin for an unlocked key
  for (let i = 0; i < pool.length; i++) {
    const candidateIdx = (startIdx + i) % pool.length;
    const item = pool[candidateIdx];
    if (now >= item.rateLimitedUntil) {
      keyPointers[provider] = (candidateIdx + 1) % pool.length;
      return { keyState: item, keyIndex: candidateIdx + 1, poolSize: pool.length, minWaitTimeMs: 0 };
    }
  }

  // All keys are currently locked out by rate limit (429)
  const minLockTime = Math.min(...pool.map(k => k.rateLimitedUntil));
  const minWaitTimeMs = Math.max(minLockTime - now, 1000);
  return { keyState: null, keyIndex: -1, poolSize: pool.length, minWaitTimeMs };
}

/**
 * Clean JSON string output from LLM responses
 * Strips <think>...</think> reasoning blocks and repairs unescaped raw code blocks/control chars in JSON strings.
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text;
  // Strip complete <think>...</think> blocks
  if (cleaned.includes('</think>')) {
    cleaned = cleaned.substring(cleaned.lastIndexOf('</think>') + 8);
  } else if (cleaned.includes('<think>')) {
    // Incomplete think block (no closing tag) — strip everything from <think> onwards
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<think>[\s\S]*/gi, '');
  }

  // Remove markdown wrapper if present
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Find outermost JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Fix unescaped backticks in property values (e.g. "example": ```python ... ```)
  cleaned = cleaned.replace(/(:\s*)```(?:[a-z]+)?\n?([\s\S]*?)```/gi, (_, prefix, code) => {
    return `${prefix}${JSON.stringify(code.trim())}`;
  });

  // Fix Python-style triple quotes """...""" or '''...''' in JSON property values
  cleaned = cleaned.replace(/(:\s*)"""([\s\S]*?)"""/g, (_, prefix, val) => {
    return `${prefix}${JSON.stringify(val.trim())}`;
  });
  cleaned = cleaned.replace(/(:\s*)'''([\s\S]*?)'''/g, (_, prefix, val) => {
    return `${prefix}${JSON.stringify(val.trim())}`;
  });

  // Fix raw unescaped newlines & tabs inside double quotes
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\' && inString) {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString) {
      if (ch === '\n') out += '\\n';
      else if (ch === '\r') out += '\\r';
      else if (ch === '\t') out += '\\t';
      else out += ch;
    } else {
      out += ch;
    }
  }

  return out.trim();
}

/**
 * Repair truncated JSON that was cut off mid-generation (finish_reason=length).
 */
function repairTruncatedJson(text: string): string {
  let cleaned = cleanJsonResponse(text);
  
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) return cleaned;
  cleaned = cleaned.substring(firstBrace);
  
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch (_) {
    // Needs repair
  }

  let inString = false;
  let escaped = false;
  const stack: string[] = [];
  
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    
    if (escaped) {
      escaped = false;
      continue;
    }
    
    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }
    
    if (ch === '"' && !escaped) {
      inString = !inString;
      continue;
    }
    
    if (inString) continue;
    
    if (ch === '{') stack.push('{');
    else if (ch === '[') stack.push('[');
    else if (ch === '}') { if (stack.length > 0 && stack[stack.length - 1] === '{') stack.pop(); }
    else if (ch === ']') { if (stack.length > 0 && stack[stack.length - 1] === '[') stack.pop(); }
  }
  
  if (inString) {
    cleaned += '"';
  }
  
  cleaned = cleaned.replace(/,\s*$/, '');
  
  while (stack.length > 0) {
    const open = stack.pop();
    cleaned = cleaned.replace(/,\s*$/, '');
    if (open === '{') cleaned += '}';
    else if (open === '[') cleaned += ']';
  }
  
  try {
    JSON.parse(cleaned);
    console.log('[LLMClient] ✅ Successfully repaired truncated JSON');
    return cleaned;
  } catch (err) {
    try {
      let lastValidEnd = cleaned.length;
      for (let end = cleaned.length; end > firstBrace + 1; end--) {
        const candidate = cleaned.substring(0, end);
        let depth = 0;
        let inStr = false;
        let esc = false;
        for (let j = 0; j < candidate.length; j++) {
          const c = candidate[j];
          if (esc) { esc = false; continue; }
          if (c === '\\' && inStr) { esc = true; continue; }
          if (c === '"') { inStr = !inStr; continue; }
          if (inStr) continue;
          if (c === '{') depth++;
          if (c === '}') depth--;
          if (depth === 0 && j > 0) {
            try {
              JSON.parse(candidate.substring(0, j + 1));
              console.log('[LLMClient] ✅ Recovered partial JSON (aggressive repair)');
              return candidate.substring(0, j + 1);
            } catch (_) {}
          }
        }
      }
    } catch (_) {}
    
    console.warn('[LLMClient] ⚠️ JSON repair failed, returning best effort');
    return cleaned;
  }
}

/**
 * Execute a single HTTP request to Groq API
 */
async function executeSingleGroqCall(groqKey: string, options: GenerateOptions): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  
  let systemText = options.systemInstruction || '';
  if (!systemText.toLowerCase().includes('json')) {
    systemText += '\n\nCRITICAL: You are a strict JSON generator. Respond ONLY with valid, raw JSON starting with "{" and ending with "}". Do NOT include markdown code blocks (```json), preamble, or commentary.';
  }
  messages.push({ role: 'system', content: systemText });

  let prompt = options.userPrompt;
  if (!prompt.toLowerCase().includes('json')) {
    prompt += '\n\nReturn your response as a valid json object.';
  }
  if (options.responseSchema) {
    prompt += `\n\nCRITICAL: Respond ONLY with valid json matching this structure:\n${JSON.stringify(options.responseSchema, null, 2)}`;
  }
  messages.push({ role: 'user', content: prompt });

  // Groq Free Tier has a hard 6,000 Tokens Per Minute (TPM) limit per request.
  // We cap maxTokens at 2500 to ensure Input + Output stays safely under 6,000 tokens.
  const maxTokens = Math.min(options.maxTokens ?? 2500, 2500);
  const temperature = options.temperature ?? 0.7;
  const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const body: any = {
    model: modelName,
    messages,
    max_tokens: maxTokens,
    temperature,
    response_format: { type: 'json_object' }
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (errText.includes('json_validate_failed')) {
      console.warn('[LLMClient] Groq json_validate_failed — retrying without strict json_object response_format...');
      delete body.response_format;
      const retryResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180000)
      });
      if (retryResp.ok) {
        const retryData = await retryResp.json();
        return cleanJsonResponse(retryData.choices?.[0]?.message?.content || '');
      } else {
        const retryErrText = await retryResp.text();
        throw new Error(`Groq API Error (${retryResp.status}): ${retryErrText}`);
      }
    }
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    console.warn('[LLMClient] Groq response hit max_tokens limit — attempting JSON repair...');
    return repairTruncatedJson(content);
  }

  return cleanJsonResponse(content);
}

/**
 * Execute Groq API with Multi-Key Rotation & 3-Round TPM Window Reset Strategy
 * - Round 1: Try Key 1 -> Key 2 -> Key 3 (instant failover on 429)
 * - If all keys hit 429 in Round 1: Wait 65s for TPM window reset
 * - Round 2: Try Key 1 -> Key 2 -> Key 3
 * - If all keys hit 429 in Round 2: Wait 65s for TPM window reset
 * - Round 3: Try Key 1 -> Key 2 -> Key 3
 * - Total rounds = 3 (across all Groq keys)
 */
async function callGroqApiMultiKey(options: GenerateOptions): Promise<string> {
  const pool = discoverKeysForProvider('groq');
  if (pool.length === 0) throw new Error('GROQ_API_KEY is not configured in .env');

  const maxRounds = 3;
  let lastError: Error | null = null;

  for (let round = 1; round <= maxRounds; round++) {
    let keysTriedThisRound = 0;
    const poolSize = pool.length;

    // In each round, iterate through all available keys in the pool
    for (let i = 0; i < poolSize; i++) {
      const { keyState, keyIndex } = getAvailableKey('groq');

      if (!keyState) {
        // All keys are currently locked by rate limit
        break;
      }

      keysTriedThisRound++;
      console.log(`[LLMClient] [Groq Round ${round}/${maxRounds}] Trying Key ${keyIndex}/${poolSize} (${keyState.maskedKey})...`);

      try {
        const result = await executeSingleGroqCall(keyState.key, options);
        return result;
      } catch (err) {
        const errMsg = (err as Error).message;
        const is429 = errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('tpm');

        if (is429) {
          keyState.rateLimitedUntil = Date.now() + 65000;
          keyState.failCount++;
          console.warn(`[LLMClient] ⚠️ Groq Key ${keyIndex}/${poolSize} (${keyState.maskedKey}) hit 429 Rate Limit. Locked for 65s. ${keysTriedThisRound < poolSize ? 'Switching to next Groq key instantly...' : ''}`);
          lastError = err as Error;
          continue;
        }

        // Non-429 error (e.g. 400 json_validate_failed, timeout, 500)
        keyState.rateLimitedUntil = Date.now() + 15000;
        keyState.failCount++;
        lastError = err as Error;
        console.warn(`[LLMClient] ⚠️ Groq Key ${keyIndex}/${poolSize} (${keyState.maskedKey}) failed: ${errMsg.substring(0, 150)}.`);
        continue;
      }
    }

    // If we finished trying all available keys in this round, wait 65s for TPM reset before next round
    if (round < maxRounds) {
      console.warn(`[LLMClient] ⏳ All ${poolSize} Groq API keys tried in Round ${round}/${maxRounds} (429 Rate Limits). Waiting 65s for TPM window reset before Round ${round + 1}...`);
      await new Promise(r => setTimeout(r, 65000));

      // Reset lockout timestamps so Round (round+1) can try all keys fresh
      for (const k of pool) {
        k.rateLimitedUntil = 0;
      }
    }
  }

  throw lastError || new Error(`All ${pool.length} Groq API keys failed after 3 full rounds (including 65s TPM window resets)`);
}

/**
 * Call MiniMax API via standard fetch (OpenAI compatible format) with key rotation
 */
async function callMiniMaxApi(options: GenerateOptions): Promise<string> {
  const pool = discoverKeysForProvider('minimax');
  if (pool.length === 0) throw new Error('MINIMAX_API_KEY is not set');

  const { keyState, keyIndex, poolSize } = getAvailableKey('minimax');
  const minimaxKey = keyState ? keyState.key : pool[0].key;

  const messages: { role: string; content: string }[] = [];
  const systemText = (options.systemInstruction ? `${options.systemInstruction}\n\n` : '') + 
    'CRITICAL: You are generating structured JSON output. Keep your internal reasoning extremely brief (under 20 words). ' +
    'Spend your entire token budget on producing COMPLETE, valid JSON. Close all brackets, quotes, and arrays properly. ' +
    'NEVER truncate mid-string. If running low on tokens, close all open structures immediately.';
  messages.push({ role: 'system', content: systemText });

  let prompt = options.userPrompt;
  if (options.responseSchema) {
    prompt += `\n\nRespond ONLY with valid JSON matching this structure. Every field must be complete:\n${JSON.stringify(options.responseSchema, null, 2)}`;
  }
  messages.push({ role: 'user', content: prompt });

  const requestedTokens = options.maxTokens ?? 4096;
  const temperature = options.temperature ?? 0.7;

  const baseUrl = process.env.MINIMAX_BASE_URL 
    ? (process.env.MINIMAX_BASE_URL.endsWith('/chat/completions') 
        ? process.env.MINIMAX_BASE_URL 
        : `${process.env.MINIMAX_BASE_URL.replace(/\/$/, '')}/chat/completions`)
    : 'https://api.minimax.chat/v1/chat/completions';

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${minimaxKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_MODEL || 'MiniMax-M3',
      messages,
      max_tokens: requestedTokens,
      temperature
    }),
    signal: AbortSignal.timeout(180000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (keyState && (response.status === 429 || response.status === 403)) {
      keyState.rateLimitedUntil = Date.now() + 30000;
    }
    throw new Error(`MiniMax API Error (${response.status}): ${errText}`);
  }

  const responseText = await response.text();
  let data: any;
  let content = '';
  
  try {
    data = JSON.parse(responseText);
    content = data.choices?.[0]?.message?.content || '';
  } catch (_e) {
    try {
      const sanitized = responseText.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
      data = JSON.parse(sanitized);
      content = data.choices?.[0]?.message?.content || '';
    } catch (__e) {
      const contentStartIdx = responseText.indexOf('"content"');
      if (contentStartIdx !== -1) {
        const valueStart = responseText.indexOf('"', contentStartIdx + 9);
        if (valueStart !== -1) {
          let rawValue = responseText.substring(valueStart + 1);
          let decoded = '';
          for (let i = 0; i < rawValue.length; i++) {
            if (rawValue[i] === '\\' && i + 1 < rawValue.length) {
              const next = rawValue[i + 1];
              if (next === 'n') { decoded += '\n'; i++; }
              else if (next === 't') { decoded += '\t'; i++; }
              else if (next === 'r') { decoded += '\r'; i++; }
              else if (next === '"') { decoded += '"'; i++; }
              else if (next === '\\') { decoded += '\\'; i++; }
              else if (next === '/') { decoded += '/'; i++; }
              else { decoded += rawValue[i]; }
            } else if (rawValue[i] === '"') {
              const afterQuote = rawValue.substring(i + 1, i + 30).trim();
              if (afterQuote.startsWith(',') || afterQuote.startsWith('}') || 
                  afterQuote.startsWith(']') || afterQuote.startsWith('"finish')) {
                break;
              }
              decoded += '"';
            } else {
              decoded += rawValue[i];
            }
          }
          console.warn(`[LLMClient] MiniMax proxy truncated response (${responseText.length} chars). Extracted content via decoder.`);
          return repairTruncatedJson(decoded);
        }
      }
      throw new Error(`Unterminated string in JSON at position ${responseText.length} (proxy truncated response)`);
    }
  }
  
  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    return repairTruncatedJson(content);
  }

  const cleaned = cleanJsonResponse(content);
  try {
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace !== -1) {
      JSON.parse(cleaned.substring(firstBrace));
    }
    return cleaned;
  } catch (_) {
    return repairTruncatedJson(content);
  }
}

/**
 * Call Gemini API using @google/genai SDK with key rotation
 */
async function callGeminiApi(ai: GoogleGenAI, options: GenerateOptions): Promise<string> {
  const pool = discoverKeysForProvider('gemini');
  const { keyState } = getAvailableKey('gemini');
  const activeKey = keyState ? keyState.key : (pool[0]?.key || process.env.GEMINI_API_KEY);

  const geminiClient = activeKey
    ? new GoogleGenAI({ apiKey: activeKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } })
    : ai;

  try {
    const response = await geminiClient.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: options.userPrompt,
      config: {
        systemInstruction: options.systemInstruction,
        responseMimeType: options.responseSchema ? 'application/json' : undefined,
        responseSchema: options.responseSchema,
        temperature: options.temperature ?? 0.75,
        maxOutputTokens: options.maxTokens ?? 8192
      }
    });
    return cleanJsonResponse(response.text || '');
  } catch (err) {
    if (keyState && (err as Error).message.includes('429')) {
      keyState.rateLimitedUntil = Date.now() + 60000;
    }
    throw err;
  }
}

/**
 * Helper to retry an operation with backoff
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 3000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const errMsg = (err as Error).message;
      const isRetryable = errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit') ||
                          errMsg.includes('504') || errMsg.toLowerCase().includes('timeout');
      if (isRetryable && i < retries - 1) {
        const waitTime = Math.max(baseDelayMs * Math.pow(2, i), 3000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw err;
    }
  }
  throw new Error('All retries exhausted');
}

/**
 * Call Kimi / TokenRouter API via standard OpenAI-compatible fetch
 */
async function callKimiApi(options: GenerateOptions): Promise<string> {
  const pool = discoverKeysForProvider('kimi');
  if (pool.length === 0) throw new Error('KIMI_API_KEY is not set in .env');

  const { keyState } = getAvailableKey('kimi');
  const kimiKey = keyState ? keyState.key : pool[0].key;

  const messages: { role: string; content: string }[] = [];
  if (options.systemInstruction) {
    messages.push({ role: 'system', content: options.systemInstruction });
  }

  let prompt = options.userPrompt;
  if (options.responseSchema) {
    prompt += `\n\nRespond ONLY with valid JSON matching this structure. Every field must be complete:\n${JSON.stringify(options.responseSchema, null, 2)}`;
  }
  messages.push({ role: 'user', content: prompt });

  const maxTokens = options.maxTokens ?? 8192;
  const temperature = options.temperature ?? 0.7;

  const baseUrl = process.env.KIMI_BASE_URL 
    ? (process.env.KIMI_BASE_URL.endsWith('/chat/completions') 
        ? process.env.KIMI_BASE_URL 
        : `${process.env.KIMI_BASE_URL.replace(/\/$/, '')}/chat/completions`)
    : 'https://api.tokenrouter.com/v1/chat/completions';

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${kimiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.KIMI_MODEL || 'moonshotai/kimi-k3-free',
      messages,
      max_tokens: maxTokens,
      temperature
    }),
    signal: AbortSignal.timeout(300000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (keyState && (response.status === 429 || response.status === 403)) {
      keyState.rateLimitedUntil = Date.now() + 30000;
    }
    throw new Error(`Kimi API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    return repairTruncatedJson(content);
  }

  return cleanJsonResponse(content);
}

/**
 * Master Robust LLM Dispatcher
 * Priority Order: 1. Kimi → 2. Groq (Multi-Key) → 3. MiniMax → 4. Gemini
 * Supports explicit user provider selection ('auto' | 'kimi' | 'groq' | 'minimax' | 'gemini').
 */
export async function generateLLMContent(ai: GoogleGenAI, options: GenerateOptions): Promise<string> {
  const kimiPool = discoverKeysForProvider('kimi');
  const groqPool = discoverKeysForProvider('groq');
  const minimaxPool = discoverKeysForProvider('minimax');
  const geminiPool = discoverKeysForProvider('gemini');

  const provider = options.selectedProvider || 'auto';

  // 1. Explicit Kimi Selection
  if (provider === 'kimi') {
    if (kimiPool.length === 0) throw new Error('KIMI_API_KEY is not configured in .env');
    return await retryWithBackoff(() => callKimiApi(options), 3, 2000);
  }

  // 2. Explicit Groq Selection (Uses multi-key rotation)
  if (provider === 'groq') {
    if (groqPool.length === 0) throw new Error('GROQ_API_KEY is not configured in .env');
    return await callGroqApiMultiKey(options);
  }

  // 3. Explicit MiniMax Selection
  if (provider === 'minimax') {
    if (minimaxPool.length === 0) throw new Error('MINIMAX_API_KEY is not configured in .env');
    return await retryWithBackoff(() => callMiniMaxApi(options), 3, 3000);
  }

  // 4. Explicit Gemini Selection
  if (provider === 'gemini') {
    if (geminiPool.length === 0) throw new Error('GEMINI_API_KEY is not configured in .env');
    return await retryWithBackoff(() => callGeminiApi(ai, options), 3, 2000);
  }

  // 5. AUTO Mode: Payload-Aware Smart Routing
  // If requested tokens > 8000 (heavy production blueprint pass), prioritize Gemini/MiniMax first since Groq Free Tier has a 6k TPM cap per request.
  const isHeavyPayload = (options.maxTokens && options.maxTokens > 8000);

  if (isHeavyPayload) {
    if (geminiPool.length > 0) {
      try {
        console.log(`[LLMClient] [Auto-Heavy] Payload > 8000 maxTokens. Routing to Gemini API...`);
        return await retryWithBackoff(() => callGeminiApi(ai, options), 3, 2000);
      } catch (err) {
        console.warn('[LLMClient] [Auto-Heavy] Gemini API failed:', (err as Error).message.substring(0, 200));
      }
    }
    if (minimaxPool.length > 0) {
      try {
        console.log(`[LLMClient] [Auto-Heavy] Routing to MiniMax API...`);
        return await retryWithBackoff(() => callMiniMaxApi(options), 3, 3000);
      } catch (err) {
        console.warn('[LLMClient] [Auto-Heavy] MiniMax API failed:', (err as Error).message.substring(0, 200));
      }
    }
  }

  // Standard Reasoning Steps: Try Groq (Multi-Key) -> Gemini -> MiniMax -> Kimi
  if (groqPool.length > 0) {
    try {
      console.log(`[LLMClient] [Auto] Attempting Groq API (${groqPool.length} key(s) available)...`);
      return await callGroqApiMultiKey(options);
    } catch (err) {
      const msg = (err as Error).message;
      console.warn(`[LLMClient] [Auto] Groq API pool exhausted:`, msg.substring(0, 200));
    }
  }

  if (geminiPool.length > 0) {
    try {
      console.log(`[LLMClient] [Auto] Attempting Gemini API...`);
      return await retryWithBackoff(() => callGeminiApi(ai, options), 3, 2000);
    } catch (err) {
      console.warn('[LLMClient] [Auto] Gemini API failed:', (err as Error).message.substring(0, 200));
    }
  }

  if (minimaxPool.length > 0) {
    try {
      console.log(`[LLMClient] [Auto] Attempting MiniMax API...`);
      return await retryWithBackoff(() => callMiniMaxApi(options), 3, 3000);
    } catch (err) {
      console.warn('[LLMClient] [Auto] MiniMax API failed:', (err as Error).message.substring(0, 200));
    }
  }

  if (kimiPool.length > 0) {
    try {
      console.log(`[LLMClient] [Auto] Attempting Kimi API...`);
      return await retryWithBackoff(() => callKimiApi(options), 2, 2000);
    } catch (err) {
      console.warn('[LLMClient] [Auto] Kimi API failed:', (err as Error).message.substring(0, 200));
    }
  }

  const configured = [
    kimiPool.length > 0 && `Kimi (${kimiPool.length} keys)`,
    groqPool.length > 0 && `Groq (${groqPool.length} keys)`,
    minimaxPool.length > 0 && `MiniMax (${minimaxPool.length} keys)`,
    geminiPool.length > 0 && `Gemini (${geminiPool.length} keys)`
  ].filter(Boolean).join(', ');

  const hint = configured
    ? `All configured providers (${configured}) failed. Please wait a minute or add more API keys to .env.`
    : 'No API keys found. Please add KIMI_API_KEY, GROQ_API_KEY, MINIMAX_API_KEY, or GEMINI_API_KEY to your .env file.';
  throw new Error(hint);
}

/**
 * Helper to retrieve the number of discovered Groq keys
 */
export function getGroqKeyCount(): number {
  return discoverKeysForProvider('groq').length;
}
