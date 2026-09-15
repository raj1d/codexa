/**
 * CODEXA — Infrastructure connection validation script
 * Tests connectivity to Postgres (Neon), Redis (Upstash), and Meilisearch (Cloud)
 *
 * Usage: node scripts/validate-connections.mjs
 */

import pg from "pg";
import Redis from "ioredis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually
function loadEnv() {
  const envPath = resolve(__dirname, "..", ".env");
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
let allPassed = true;

// ── Test Postgres ────────────────────────────────────
async function testPostgres() {
  console.log("\n[1/3] Testing PostgreSQL (Neon)...");
  const client = new pg.Client({ connectionString: env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT version()");
    console.log("  OK — Connected to:", res.rows[0].version.split(",")[0]);

    // Enable pgvector
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("  OK — pgvector extension enabled");

    // Enable uuid-ossp
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log("  OK — uuid-ossp extension enabled");
  } catch (err) {
    console.error("  FAIL —", err.message);
    allPassed = false;
  } finally {
    await client.end();
  }
}

// ── Test Redis ───────────────────────────────────────
async function testRedis() {
  console.log("\n[2/3] Testing Redis (Upstash)...");
  const redis = new Redis(env.REDIS_URL, {
    tls: env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
    maxRetriesPerRequest: 1,
    connectTimeout: 10000,
  });
  try {
    const pong = await redis.ping();
    console.log("  OK — PING response:", pong);

    await redis.set("codexa:test", "connection-ok");
    const val = await redis.get("codexa:test");
    console.log("  OK — SET/GET test:", val);

    await redis.del("codexa:test");
  } catch (err) {
    console.error("  FAIL —", err.message);
    allPassed = false;
  } finally {
    redis.disconnect();
  }
}

// ── Test Meilisearch ─────────────────────────────────
async function testMeilisearch() {
  console.log("\n[3/3] Testing Meilisearch (Cloud)...");
  try {
    const res = await fetch(`${env.MEILI_URL}/health`, {
      headers: { Authorization: `Bearer ${env.MEILI_MASTER_KEY}` },
    });
    if (res.ok) {
      const data = await res.json();
      console.log("  OK — Health:", data.status);
    } else {
      console.error("  FAIL — HTTP", res.status, await res.text());
      allPassed = false;
    }

    // Get version info
    const verRes = await fetch(`${env.MEILI_URL}/version`, {
      headers: { Authorization: `Bearer ${env.MEILI_MASTER_KEY}` },
    });
    if (verRes.ok) {
      const ver = await verRes.json();
      console.log("  OK — Version:", ver.pkgVersion);
    }
  } catch (err) {
    console.error("  FAIL —", err.message);
    allPassed = false;
  }
}

// ── Run all ──────────────────────────────────────────
console.log("=".repeat(50));
console.log("CODEXA — Infrastructure Connection Validation");
console.log("=".repeat(50));

await testPostgres();
await testRedis();
await testMeilisearch();

console.log("\n" + "=".repeat(50));
if (allPassed) {
  console.log("ALL CONNECTIONS OK — infrastructure is ready");
} else {
  console.log("SOME CONNECTIONS FAILED — check errors above");
  process.exit(1);
}
console.log("=".repeat(50));
