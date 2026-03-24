#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE = join(__dirname, "..", "template");
const CWD = process.cwd();

// ANSI colors (zero deps)
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function copyDir(src, dest, opts = {}) {
  const { preserveExisting = false } = opts;
  const created = [];
  const skipped = [];

  function walk(srcDir, destDir) {
    mkdirSync(destDir, { recursive: true });
    for (const entry of readdirSync(srcDir)) {
      const srcPath = join(srcDir, entry);
      const destPath = join(destDir, entry);
      if (statSync(srcPath).isDirectory()) {
        walk(srcPath, destPath);
      } else {
        if (preserveExisting && existsSync(destPath)) {
          skipped.push(relative(CWD, destPath));
        } else {
          copyFileSync(srcPath, destPath);
          created.push(relative(CWD, destPath));
        }
      }
    }
  }

  walk(src, dest);
  return { created, skipped };
}

// Merge settings.json: add "agent": "gsd-lite" without clobbering existing keys
function mergeSettings(claudeDir) {
  const settingsPath = join(claudeDir, "settings.json");

  if (existsSync(settingsPath)) {
    try {
      const existing = JSON.parse(readFileSync(settingsPath, "utf8"));
      if (existing.agent === "gsd-lite") {
        return "already_set";
      }
      existing.agent = "gsd-lite";
      writeFileSync(settingsPath, JSON.stringify(existing, null, 2) + "\n");
      return "merged";
    } catch {
      // Malformed JSON — write fresh
      writeFileSync(settingsPath, JSON.stringify({ agent: "gsd-lite" }, null, 2) + "\n");
      return "created";
    }
  } else {
    mkdirSync(claudeDir, { recursive: true });
    writeFileSync(settingsPath, JSON.stringify({ agent: "gsd-lite" }, null, 2) + "\n");
    return "created";
  }
}

function install(args) {
  const force = args.includes("--force") || args.includes("-f");

  console.log();
  console.log(bold(cyan("  GSD-Lite Installer")));
  console.log(dim("  Pair programming protocol for AI agents"));
  console.log();

  // 1. Install agent (ONLY gsd-lite.md — never touch other agents)
  const agentSrc = join(TEMPLATE, ".claude", "agents", "gsd-lite.md");
  const agentDest = join(CWD, ".claude", "agents", "gsd-lite.md");
  mkdirSync(dirname(agentDest), { recursive: true });
  copyFileSync(agentSrc, agentDest);
  console.log(green("  \u2714 Installed") + " .claude/agents/gsd-lite.md");

  // 2. Install commands (ONLY under commands/gsd/ — never touch other commands)
  const cmdResult = copyDir(
    join(TEMPLATE, ".claude", "commands", "gsd"),
    join(CWD, ".claude", "commands", "gsd"),
    { preserveExisting: false }
  );
  console.log(green("  \u2714 Installed") + " .claude/commands/gsd/" + dim(` (${cmdResult.created.length} files)`));

  // 3. Merge settings.json (add agent key, preserve existing hooks/statusLine/etc.)
  const settingsAction = mergeSettings(join(CWD, ".claude"));
  if (settingsAction === "merged") {
    console.log(green("  \u2714 Updated") + " .claude/settings.json" + dim(" (merged — preserved existing config)"));
  } else if (settingsAction === "created") {
    console.log(green("  \u2714 Created") + " .claude/settings.json");
  } else {
    console.log(yellow("  \u2139 Unchanged") + " .claude/settings.json" + dim(" (agent already set)"));
  }

  // 4. Install gsd-lite/ artifacts (preserve user data unless --force)
  const artifactResult = copyDir(
    join(TEMPLATE, "gsd-lite"),
    join(CWD, "gsd-lite"),
    { preserveExisting: !force }
  );
  if (artifactResult.created.length > 0) {
    console.log(green("  \u2714 Scaffolded") + " gsd-lite/ artifacts" + dim(` (${artifactResult.created.length} files)`));
  }
  if (artifactResult.skipped.length > 0) {
    console.log(yellow("  \u2139 Preserved") + " existing artifacts" + dim(` (${artifactResult.skipped.length} files)`));
  }

  // 5. Summary
  const version = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8")).version;
  console.log();
  console.log(bold("  Installation complete!") + dim(` v${version}`));
  console.log();
  console.log("  Next steps:");
  console.log(cyan("    1.") + " Run " + bold("claude") + " to start a session");
  console.log(cyan("    2.") + " The GSD-Lite agent activates automatically");
  console.log(cyan("    3.") + " Try " + bold("/gsd learn") + " to understand the protocol");
  console.log(cyan("    4.") + " Or just describe what you want to build!");
  console.log();
}

function showHelp() {
  console.log();
  console.log(bold("  @luutuankiet/gsd-lite") + " — Pair programming protocol for Claude Code");
  console.log();
  console.log("  " + bold("Usage:"));
  console.log("    npx @luutuankiet/gsd-lite          Install into current project");
  console.log("    npx @luutuankiet/gsd-lite --force   Overwrite all files (including user artifacts)");
  console.log("    npx @luutuankiet/gsd-lite --help    Show this help");
  console.log();
  console.log("  " + bold("What it does:"));
  console.log("    Installs .claude/agents/gsd-lite.md and .claude/commands/gsd/ into your project.");
  console.log("    Merges \"agent\": \"gsd-lite\" into settings.json without touching your existing config.");
  console.log("    Scaffolds gsd-lite/ artifacts (preserved on re-run, use --force to overwrite).");
  console.log();
  console.log("  " + bold("Safe by design:"));
  console.log("    - Your existing .claude/settings.json hooks, permissions, etc. are preserved");
  console.log("    - Other agents and commands are never touched");
  console.log("    - WORK.md, PROJECT.md, etc. are never overwritten without --force");
  console.log();
}

// --- Main ---
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  showHelp();
} else {
  install(args);
}
