import { execFileSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = join(__dirname, "..", "bin", "cli.mjs");
const TMP = join(__dirname, "..", ".test-workspace");

function run(args = [], cwd = TMP) {
  return execFileSync("node", [CLI, ...args], { cwd, encoding: "utf8" });
}

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("gsd-lite installer", () => {
  beforeEach(() => {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
  });

  afterEach(() => {
    rmSync(TMP, { recursive: true, force: true });
  });

  // --- Fresh install ---

  test("fresh install creates .claude/ and gsd-lite/ structure", () => {
    run();
    assert.ok(existsSync(join(TMP, ".claude/agents/gsd-lite.md")));
    assert.ok(existsSync(join(TMP, ".claude/commands/gsd/learn.md")));
    assert.ok(existsSync(join(TMP, ".claude/commands/gsd/new-project.md")));
    assert.ok(existsSync(join(TMP, ".claude/commands/gsd/map-codebase.md")));
    assert.ok(existsSync(join(TMP, ".claude/commands/gsd/progress.md")));
    assert.ok(existsSync(join(TMP, ".claude/settings.json")));
    assert.ok(existsSync(join(TMP, "gsd-lite/WORK.md")));
    assert.ok(existsSync(join(TMP, "gsd-lite/PROJECT.md")));
    assert.ok(existsSync(join(TMP, "gsd-lite/ARCHITECTURE.md")));
  });

  test("fresh install does not create INBOX.md or HISTORY.md", () => {
    run();
    assert.ok(!existsSync(join(TMP, "gsd-lite/INBOX.md")));
    assert.ok(!existsSync(join(TMP, "gsd-lite/HISTORY.md")));
  });

  test("fresh install creates settings.json with agent key", () => {
    run();
    const settings = readJSON(join(TMP, ".claude/settings.json"));
    assert.equal(settings.agent, "gsd-lite");
  });

  // --- Settings merge ---

  test("preserves existing hooks in settings.json", () => {
    mkdirSync(join(TMP, ".claude"), { recursive: true });
    const existing = {
      hooks: { SessionStart: [{ hooks: [{ type: "command", command: "echo hi" }] }] },
      statusLine: { type: "command", command: "node status.js" }
    };
    writeFileSync(join(TMP, ".claude/settings.json"), JSON.stringify(existing));

    run();

    const after = readJSON(join(TMP, ".claude/settings.json"));
    assert.equal(after.agent, "gsd-lite");
    assert.deepEqual(after.hooks, existing.hooks);
    assert.deepEqual(after.statusLine, existing.statusLine);
  });

  test("preserves existing permissions in settings.json", () => {
    mkdirSync(join(TMP, ".claude"), { recursive: true });
    const existing = {
      permissions: { allow: ["Bash(npm test)", "Read"] },
      agent: "some-other-agent"
    };
    writeFileSync(join(TMP, ".claude/settings.json"), JSON.stringify(existing));

    run();

    const after = readJSON(join(TMP, ".claude/settings.json"));
    assert.equal(after.agent, "gsd-lite");
    assert.deepEqual(after.permissions, existing.permissions);
  });

  test("skips settings update when agent already set", () => {
    mkdirSync(join(TMP, ".claude"), { recursive: true });
    writeFileSync(join(TMP, ".claude/settings.json"), JSON.stringify({ agent: "gsd-lite", custom: true }));

    const output = run();

    assert.ok(output.includes("Unchanged"));
    const after = readJSON(join(TMP, ".claude/settings.json"));
    assert.equal(after.custom, true);
  });

  // --- Never clobber other files ---

  test("does not delete other agents", () => {
    mkdirSync(join(TMP, ".claude/agents"), { recursive: true });
    writeFileSync(join(TMP, ".claude/agents/my-agent.md"), "custom agent");

    run();

    assert.equal(readFileSync(join(TMP, ".claude/agents/my-agent.md"), "utf8"), "custom agent");
  });

  test("does not delete other commands", () => {
    mkdirSync(join(TMP, ".claude/commands"), { recursive: true });
    writeFileSync(join(TMP, ".claude/commands/deploy.md"), "deploy cmd");

    run();

    assert.equal(readFileSync(join(TMP, ".claude/commands/deploy.md"), "utf8"), "deploy cmd");
  });

  test("does not delete other command namespaces", () => {
    mkdirSync(join(TMP, ".claude/commands/myteam"), { recursive: true });
    writeFileSync(join(TMP, ".claude/commands/myteam/run.md"), "team cmd");

    run();

    assert.equal(readFileSync(join(TMP, ".claude/commands/myteam/run.md"), "utf8"), "team cmd");
  });

  // --- Artifact preservation ---

  test("preserves existing WORK.md on re-run", () => {
    run();
    writeFileSync(join(TMP, "gsd-lite/WORK.md"), "# My work log\nreal data here");

    run();

    const content = readFileSync(join(TMP, "gsd-lite/WORK.md"), "utf8");
    assert.equal(content, "# My work log\nreal data here");
  });

  test("preserves all artifact files on re-run", () => {
    run();
    const files = ["WORK.md", "PROJECT.md", "ARCHITECTURE.md"];
    for (const f of files) {
      writeFileSync(join(TMP, "gsd-lite", f), `custom-${f}`);
    }

    run();

    for (const f of files) {
      assert.equal(readFileSync(join(TMP, "gsd-lite", f), "utf8"), `custom-${f}`);
    }
  });

  test("--force overwrites artifact files", () => {
    run();
    writeFileSync(join(TMP, "gsd-lite/WORK.md"), "user data");

    run(["--force"]);

    const content = readFileSync(join(TMP, "gsd-lite/WORK.md"), "utf8");
    assert.notEqual(content, "user data");
    assert.ok(content.includes("# Work Log"));
  });

  // --- Agent updates ---

  test("updates gsd-lite agent on re-run", () => {
    run();
    writeFileSync(join(TMP, ".claude/agents/gsd-lite.md"), "old version");

    run();

    const content = readFileSync(join(TMP, ".claude/agents/gsd-lite.md"), "utf8");
    assert.ok(content.includes("GSD-Lite Protocol"));
  });

  test("updates gsd commands on re-run", () => {
    run();
    writeFileSync(join(TMP, ".claude/commands/gsd/learn.md"), "old version");

    run();

    const content = readFileSync(join(TMP, ".claude/commands/gsd/learn.md"), "utf8");
    assert.ok(content.includes("Learn GSD-Lite"));
  });

  // --- Bounded-read contract ---
  //
  // The installed artifacts must carry the boundary headings that let an onboarding
  // agent stop reading before the append-only zones. Losing one of these headings is
  // silent at install time and only shows up months later as a context blowout on a
  // mature project, so it is asserted here rather than left to review.

  test("ARCHITECTURE.md ships the read contract and archive boundary", () => {
    run();
    const md = readFileSync(join(TMP, "gsd-lite/ARCHITECTURE.md"), "utf8");
    assert.match(md, /^## How To Read This File/m);
    assert.match(md, /^## Version Archive/m);
  });

  test("WORK.md ships the read contract and archive boundary", () => {
    run();
    const md = readFileSync(join(TMP, "gsd-lite/WORK.md"), "utf8");
    assert.match(md, /^## How To Read This File/m);
    assert.match(md, /^## 2b\./m);
    assert.match(md, /^## 3\. Atomic Session Log/m);
  });

  test("PROJECT.md ships the file index", () => {
    run();
    const md = readFileSync(join(TMP, "gsd-lite/PROJECT.md"), "utf8");
    assert.match(md, /^## File Index/m);
  });

  test("boundary headings appear before the zones they bound", () => {
    run();
    const arch = readFileSync(join(TMP, "gsd-lite/ARCHITECTURE.md"), "utf8").split("\n");
    const work = readFileSync(join(TMP, "gsd-lite/WORK.md"), "utf8").split("\n");
    const at = (lines, re) => lines.findIndex((l) => re.test(l));

    assert.ok(at(arch, /^## How To Read This File/) < at(arch, /^## Version Archive/));
    assert.ok(at(work, /^## 1\. Current Understanding/) < at(work, /^## 2b\./));
    assert.ok(at(work, /^## 2\. Key Events/) < at(work, /^## 2b\./));
    assert.ok(at(work, /^## 2b\./) < at(work, /^## 3\. Atomic Session Log/));
  });

  test("agent protocol teaches the bounded boot sequence", () => {
    run();
    const md = readFileSync(join(TMP, ".claude/agents/gsd-lite.md"), "utf8");
    assert.match(md, /\^## Version Archive/);
    assert.match(md, /\^## 2b/);
    assert.match(md, /Never read `ARCHITECTURE\.md` or `WORK\.md` without a bound/);
  });

  // --- Help ---

  test("--help shows usage without installing", () => {
    const output = run(["--help"]);
    assert.ok(output.includes("@luutuankiet/gsd-lite"));
    assert.ok(output.includes("Usage"));
    assert.ok(!existsSync(join(TMP, ".claude")));
  });
});
