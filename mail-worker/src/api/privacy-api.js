import app from '../hono/hono';
import result from '../model/result';
import { DECOY_PERSONAS } from '../../../mail-vue/src/utils/decoy-personas.js';

const SPECIAL_PERSONA_KEYS = new Set(['silent_block', 'native_real', 'adaptive_mix', 'quantum_random']);
const MAX_DELAY_SECONDS = 24 * 60 * 60;
const ARCHIVE_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

const PERSONA_UA_MAP = Object.fromEntries(DECOY_PERSONAS.map(persona => [persona.key, {
  ua: persona.userAgent,
  referer: persona.referer || '',
  name: persona.name,
  role: persona.badge || persona.specs || '',
  category: persona.category,
  plausibility: persona.plausibility ?? 50,
  absurdity: persona.absurdity ?? 50
}]));

function clampScore(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
}

function concretePersonaKeys() {
  return Object.keys(PERSONA_UA_MAP).filter(key => !SPECIAL_PERSONA_KEYS.has(key));
}

export function resolvePersonaKey(personaKey, tuning = {}, random = Math.random) {
  const keys = concretePersonaKeys();
  if (personaKey === 'quantum_random' || !PERSONA_UA_MAP[personaKey]) {
    return keys[Math.floor(random() * keys.length)];
  }
  if (personaKey !== 'adaptive_mix') return personaKey;

  const targetPlausibility = clampScore(tuning?.plausibility, 78);
  const targetAbsurdity = clampScore(tuning?.absurdity, 48);
  const ranked = keys.map(key => {
    const persona = PERSONA_UA_MAP[key];
    const distance = Math.abs(persona.plausibility - targetPlausibility)
      + Math.abs(persona.absurdity - targetAbsurdity);
    return { key, score: distance + random() * 12 };
  }).sort((a, b) => a.score - b.score);
  return ranked[0].key;
}

export async function runPrivacyProbe(
  body,
  { requestUserAgent = '', fetchImpl = fetch, random = Math.random } = {}
) {
  const { url, personaKey = 'smart_fridge', tuning = {} } = body || {};

  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    return result.fail('无效的目标 URL', 400);
  }

  const selectedKey = resolvePersonaKey(personaKey, tuning, random);
  if (selectedKey === 'silent_block') {
    return result.ok({
      targetUrl: url,
      statusCode: 200,
      statusText: 'Blocked by Silent Mode',
      requestedPersonaKey: personaKey,
      personaKey: 'silent_block',
      personaName: '绝对静默拦截 (彻底禁发探针 · 零网络出站)',
      personaRole: '物理沙箱级黑洞拦截 · 0 网络出站',
      userAgent: '[BLOCKED] 彻底封禁外发请求，目标端点未接收到任何流量',
      referer: '',
      node: 'Cloudflare Edge (Local Safe Block)',
      isSilent: true,
      message: '已启用绝对静默模式：未向追踪器发送任何探针。'
    });
  }

  const persona = PERSONA_UA_MAP[selectedKey] || PERSONA_UA_MAP.smart_fridge;
  const isNative = selectedKey === 'native_real';
  const targetUa = isNative
    ? (body.nativeUa || requestUserAgent || PERSONA_UA_MAP.windows11_pc.ua)
    : persona.ua;
  const targetReferer = isNative ? '' : persona.referer;
  const acceptLanguage = persona.category === 'foreign_iot'
    ? 'en-US,en;q=0.9'
    : 'zh-CN,zh;q=0.9,en;q=0.8';

  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        'User-Agent': targetUa,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': acceptLanguage,
        ...(targetReferer ? { 'Referer': targetReferer } : {}),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
  } catch (fetchErr) {
    return result.fail(`诱饵投毒失败: ${fetchErr.message || '网络错误'}`, 502);
  } finally {
    clearTimeout(timeout);
  }

  return result.ok({
    targetUrl: url,
    statusCode: response.status,
    statusText: response.statusText,
    requestedPersonaKey: personaKey,
    personaKey: selectedKey,
    personaName: isNative ? '真实本机直出 (未做伪装)' : persona.name,
    personaRole: isNative ? '原生客户端透传 · 本机真实环境' : persona.role,
    userAgent: targetUa,
    referer: targetReferer,
    node: 'Cloudflare Edge Worker (Datacenter IP)'
  });
}

async function ensurePrivacyArchive(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS privacy_probe_log (
      probe_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_url TEXT,
      target_host TEXT NOT NULL,
      url_fingerprint TEXT NOT NULL,
      requested_persona_key TEXT NOT NULL,
      tuning TEXT,
      persona_key TEXT,
      persona_name TEXT,
      status TEXT NOT NULL,
      scheduled_for INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      fired_at INTEGER,
      status_code INTEGER,
      status_text TEXT,
      error_message TEXT
    )
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_privacy_probe_due
    ON privacy_probe_log(status, scheduled_for)
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_privacy_probe_user
    ON privacy_probe_log(user_id, created_at DESC)
  `).run();
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function resolveDelaySeconds(body, random = Math.random) {
  const exact = Number(body?.delaySeconds);
  if (Number.isFinite(exact)) return Math.max(0, Math.min(MAX_DELAY_SECONDS, Math.round(exact)));

  const min = Math.max(0, Math.min(MAX_DELAY_SECONDS, Number(body?.delayMinSeconds) || 0));
  const max = Math.max(min, Math.min(MAX_DELAY_SECONDS, Number(body?.delayMaxSeconds) || min));
  return Math.round(min + (max - min) * random());
}

async function insertArchiveRow(db, { userId, url, personaKey, tuning, scheduledFor, status }) {
  const parsed = new URL(url);
  const fingerprint = await sha256(url);
  const createdAt = Date.now();
  const response = await db.prepare(`
    INSERT INTO privacy_probe_log (
      user_id, target_url, target_host, url_fingerprint, requested_persona_key,
      tuning, status, scheduled_for, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userId,
    url,
    parsed.hostname,
    fingerprint,
    personaKey,
    JSON.stringify(tuning || {}),
    status,
    scheduledFor,
    createdAt
  ).run();
  return Number(response.meta?.last_row_id);
}

async function finalizeArchiveRow(db, probeId, probeResult) {
  const succeeded = probeResult?.code === 200;
  const data = probeResult?.data || {};
  await db.prepare(`
    UPDATE privacy_probe_log
    SET target_url = NULL,
        status = ?,
        persona_key = ?,
        persona_name = ?,
        fired_at = ?,
        status_code = ?,
        status_text = ?,
        error_message = ?
    WHERE probe_id = ?
  `).bind(
    succeeded ? (data.isSilent ? 'blocked' : 'sent') : 'failed',
    data.personaKey || null,
    data.personaName || null,
    Date.now(),
    data.statusCode || probeResult?.code || null,
    data.statusText || null,
    succeeded ? null : (probeResult?.message || '诱饵发射失败'),
    probeId
  ).run();
}

async function executeAndArchive({ db, probeId, body, requestUserAgent = '' }) {
  const probeResult = await runPrivacyProbe(body, { requestUserAgent });
  await finalizeArchiveRow(db, probeId, probeResult);
  return probeResult;
}

export async function processDuePrivacyProbes({ env }) {
  if (!env?.db) return;
  await ensurePrivacyArchive(env.db);
  const now = Date.now();
  await env.db.prepare(`
    UPDATE privacy_probe_log
    SET status = 'scheduled'
    WHERE status = 'sending' AND scheduled_for < ?
  `).bind(now - 10 * 60 * 1000).run();
  const { results = [] } = await env.db.prepare(`
    SELECT * FROM privacy_probe_log
    WHERE status = 'scheduled' AND scheduled_for <= ?
    ORDER BY scheduled_for ASC
    LIMIT 25
  `).bind(now).all();

  for (const row of results) {
    const claimed = await env.db.prepare(`
      UPDATE privacy_probe_log SET status = 'sending'
      WHERE probe_id = ? AND status = 'scheduled'
    `).bind(row.probe_id).run();
    if (!claimed.meta?.changes) continue;

    try {
      await executeAndArchive({
        db: env.db,
        probeId: row.probe_id,
        body: {
          url: row.target_url,
          personaKey: row.requested_persona_key,
          tuning: JSON.parse(row.tuning || '{}')
        }
      });
    } catch (error) {
      await finalizeArchiveRow(env.db, row.probe_id, result.fail(error?.message || '延迟诱饵执行失败'));
    }
  }

  await env.db.prepare(`
    DELETE FROM privacy_probe_log
    WHERE created_at < ? AND status != 'scheduled' AND status != 'sending'
  `).bind(now - ARCHIVE_RETENTION_MS).run();
}

app.post('/privacy/poison', async (c) => {
  try {
    const body = await c.req.json();
    const { url, personaKey = 'smart_fridge', tuning = {} } = body || {};
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return c.json(result.fail('无效的目标 URL', 400));
    }

    await ensurePrivacyArchive(c.env.db);
    const delaySeconds = personaKey === 'native_real' ? 0 : resolveDelaySeconds(body);
    const scheduledFor = Date.now() + delaySeconds * 1000;
    const probeId = await insertArchiveRow(c.env.db, {
      userId: c.get('user')?.userId || 0,
      url,
      personaKey,
      tuning,
      scheduledFor,
      status: delaySeconds > 0 ? 'scheduled' : 'sending'
    });

    if (delaySeconds > 0) {
      return c.json(result.ok({
        probeId,
        status: 'scheduled',
        statusText: 'Scheduled',
        scheduledFor,
        delaySeconds,
        requestedPersonaKey: personaKey,
        message: '替身已进入延迟开信剧本。'
      }));
    }

    const response = await executeAndArchive({
      db: c.env.db,
      probeId,
      body,
      requestUserAgent: c.req.header('user-agent') || ''
    });
    if (response.data) response.data.probeId = probeId;
    return c.json(response);
  } catch (err) {
    return c.json(result.fail(err.message || '诱饵投毒执行失败'));
  }
});

app.get('/privacy/archive', async (c) => {
  await ensurePrivacyArchive(c.env.db);
  const limit = Math.max(1, Math.min(100, Number(c.req.query('limit')) || 40));
  const { results = [] } = await c.env.db.prepare(`
    SELECT probe_id AS probeId,
           target_host AS targetHost,
           substr(url_fingerprint, 1, 12) AS fingerprint,
           requested_persona_key AS requestedPersonaKey,
           persona_key AS personaKey,
           persona_name AS personaName,
           status,
           scheduled_for AS scheduledFor,
           created_at AS createdAt,
           fired_at AS firedAt,
           status_code AS statusCode,
           status_text AS statusText,
           error_message AS errorMessage
    FROM privacy_probe_log
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(c.get('user')?.userId || 0, limit).all();
  return c.json(result.ok(results));
});

app.delete('/privacy/archive/:probeId', async (c) => {
  await ensurePrivacyArchive(c.env.db);
  const probeId = Number(c.req.param('probeId'));
  if (!Number.isInteger(probeId) || probeId <= 0) {
    return c.json(result.fail('无效的替身任务编号', 400));
  }
  const response = await c.env.db.prepare(`
    UPDATE privacy_probe_log
    SET status = 'cancelled', target_url = NULL, error_message = '由用户取消'
    WHERE probe_id = ? AND user_id = ? AND status = 'scheduled'
  `).bind(probeId, c.get('user')?.userId || 0).run();
  if (!response.meta?.changes) return c.json(result.fail('该任务已经发射或不存在', 409));
  return c.json(result.ok({ probeId, status: 'cancelled' }));
});
