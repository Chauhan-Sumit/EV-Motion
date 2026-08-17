/**
 * Generates the vehicle-type illustrations declared in
 * `src/lib/vehicle-illustrations.ts` and uploads them to the ImageKit media
 * library at their recorded paths.
 *
 *   node --env-file=.env.local scripts/generate-vehicle-illustrations.mts
 *   node --env-file=.env.local scripts/generate-vehicle-illustrations.mts --force
 *   node --env-file=.env.local scripts/generate-vehicle-illustrations.mts --only=car:suv
 *
 * Safe to re-run: an illustration already published at its path is skipped, so
 * a run interrupted by a network blip is resumed by running it again. `--force`
 * regenerates regardless.
 *
 * Run manually, never at request time. Read the honesty rules at the top of
 * `src/lib/vehicle-illustrations.ts` before changing any prompt — the style
 * string and the negative prompts are load-bearing, and this script is the only
 * thing that acts on them.
 *
 * Node runs this file directly (native type stripping, Node 23.6+). The `.mts`
 * extension marks it as ESM TypeScript, which this package's CommonJS default
 * would otherwise warn about on every run. No build step, and no new
 * dependency: the ImageKit upload API is plain multipart HTTP over `fetch`, the
 * same choice `supabaseLeadStore.ts` makes for Supabase.
 *
 * Pipeline, per illustration:
 *   1. ik-genimg text-to-image  -> a flat-vector JPEG on white
 *   2. ?tr=e-bgremove,f-png     -> transparent PNG cutout
 *   3. upload to the library    -> a stable, promptless, cacheable path
 *
 * Step 3 is the point. Delivering the ik-genimg URL directly would put the
 * whole prompt in every page's HTML and re-run a paid, non-deterministic
 * generation on any cache purge.
 */

import { createHash } from "node:crypto";
import {
  ILLUSTRATION_TRANSFORMATION,
  VEHICLE_ILLUSTRATIONS,
  fullPromptFor,
  type VehicleIllustration,
} from "../src/lib/vehicle-illustrations.ts";

const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";
/** ImageKit answers an in-progress generation with this 200 + marker header. */
const INTERMEDIATE_HEADER = "is-intermediate-response";
const POLL_INTERVAL_MS = 8_000;
const POLL_ATTEMPTS = 30;

const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

if (!endpoint || !privateKey) {
  console.error(
    "Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT or IMAGEKIT_PRIVATE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/generate-vehicle-illustrations.ts",
  );
  process.exit(1);
}

const force = process.argv.includes("--force");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A generation takes minutes of polling, so a single transient socket error
 * shouldn't throw the whole illustration away — two runs hit `fetch failed`
 * mid-poll on the first real use of this script. Retries the *network* failure
 * only; an HTTP error status is a real answer and propagates.
 */
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt >= attempts) throw error;
      await sleep(2_000 * attempt);
    }
  }
}

/**
 * ImageKit caches a generation against its *path*, so changing a prompt at the
 * same path returns the old picture. Fingerprinting the prompt into the staging
 * filename means an edited prompt genuinely regenerates, and an unchanged one
 * costs nothing to re-run.
 */
function stagingUrl(key: string, prompt: string): string {
  const fingerprint = createHash("sha1").update(prompt).digest("hex").slice(0, 8);
  const slug = key.replace(/[^a-z0-9]+/gi, "-");
  return (
    `${endpoint}/ik-genimg-prompt-${encodeURIComponent(prompt)}` +
    `/generated/${slug}-${fingerprint}.jpg?tr=${ILLUSTRATION_TRANSFORMATION}`
  );
}

/** Polls a generation URL until ImageKit stops answering "being prepared". */
async function fetchGenerated(url: string, label: string): Promise<Buffer> {
  for (let attempt = 1; attempt <= POLL_ATTEMPTS; attempt++) {
    const response = await fetchWithRetry(url);
    if (!response.ok) {
      throw new Error(`${label}: generation failed with HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.startsWith("image/") && !response.headers.get(INTERMEDIATE_HEADER)) {
      return Buffer.from(await response.arrayBuffer());
    }
    await response.arrayBuffer(); // drain
    process.stdout.write(`  ${label}: generating… (${attempt}/${POLL_ATTEMPTS})\r`);
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`${label}: still generating after ${POLL_ATTEMPTS} attempts`);
}

/** True when a real image already lives at this delivery path. */
async function alreadyPublished(path: string): Promise<boolean> {
  const response = await fetchWithRetry(`${endpoint}${path}?tr=w-8`);
  return response.ok && (response.headers.get("content-type") ?? "").startsWith("image/");
}

async function upload(path: string, bytes: Buffer, key: string): Promise<string> {
  const lastSlash = path.lastIndexOf("/");
  const folder = path.slice(0, lastSlash);
  const fileName = path.slice(lastSlash + 1);

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(bytes)], { type: "image/png" }), fileName);
  form.append("fileName", fileName);
  form.append("folder", folder);
  // A fixed path is the whole point — never let ImageKit invent a unique name.
  form.append("useUniqueFileName", "false");
  form.append("overwriteFile", "true");
  form.append("tags", `ai-generated,illustration,${key.replace(":", "-")}`);
  form.append(
    "description",
    "AI-generated generic vehicle-type illustration (ImageKit ik-genimg). " +
      "Not a photograph and not a depiction of any specific vehicle model.",
  );

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
    body: form,
  });

  const body = (await response.json()) as { filePath?: string; message?: string };
  if (!response.ok) throw new Error(`upload failed (HTTP ${response.status}): ${body.message}`);
  return body.filePath ?? path;
}

async function run(): Promise<void> {
  const entries = Object.entries(VEHICLE_ILLUSTRATIONS).filter(
    (entry): entry is [string, VehicleIllustration] => Boolean(entry[1]) && (!only || entry[0] === only),
  );

  if (entries.length === 0) {
    console.error(only ? `No illustration declared for "${only}".` : "No illustrations declared.");
    process.exit(1);
  }

  console.log(`${entries.length} illustration(s) to process.\n`);
  let generated = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const [key, illustration] of entries) {
    try {
      if (!force && (await alreadyPublished(illustration.path))) {
        console.log(`- ${key}: already published at ${illustration.path} (--force to regenerate)`);
        skipped++;
        continue;
      }

      const prompt = fullPromptFor(illustration);
      const bytes = await fetchGenerated(stagingUrl(key, prompt), key);
      const filePath = await upload(illustration.path, bytes, key);
      console.log(`- ${key}: uploaded ${(bytes.byteLength / 1024).toFixed(0)} KB -> ${filePath}`);
      generated++;
    } catch (error) {
      console.error(`- ${key}: ${error instanceof Error ? error.message : String(error)}`);
      failures.push(key);
    }
  }

  console.log(`\nGenerated ${generated}, skipped ${skipped}, failed ${failures.length}.`);
  if (failures.length > 0) {
    console.error(`Failed: ${failures.join(", ")}`);
    process.exit(1);
  }
}

await run();
