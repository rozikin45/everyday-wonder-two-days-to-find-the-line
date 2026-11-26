// Everyday Wonder, Two Days to Find the Line — entry program.
// Writes a single sentence about an ordinary moment turning strange
// to /output/entry.txt. Deterministic: the same bytes on every run.
// No input, no network, no randomness, no secrets.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "The crossing beeped, strangers stepped off the kerb in unison, and for eight seconds the whole street agreed on something.";

// The grader mounts /output; resolve it absolutely so the working
// directory never matters. import.meta.url anchors us to this file.
const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, "/output", "entry.txt");
const tmpPath = resolve(dirname(outPath), `.entry.txt.tmp-${process.pid}`);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(tmpPath, LINE, "utf8");
renameSync(tmpPath, outPath);

// Read back and verify: exactly the line, one sentence, 1-200 chars.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry verification failed: bytes on disk differ from the line");
}
const chars = [...written].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry verification failed: ${chars} characters, need 1-200`);
}
if (written.trim().length === 0 || written.includes("\n") || written.includes("\r")) {
  throw new Error("entry verification failed: entry must be one non-blank line");
}
// One sentence: exactly one sentence-ending period, at the very end.
if (!written.endsWith(".") || written.slice(0, -1).includes(".")) {
  throw new Error("entry verification failed: entry must be exactly one sentence");
}
