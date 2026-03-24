#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync } from "fs";
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
  const { preserveExisting = false, label = "" } = opts;
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

function install(args) {
  const force = args.includes("--force") || args.includes("-f");

  console.log();
  console.log(bold(cyan("  GSD-Lite Installer")));
  console.log(dim("  Pair programming protocol for AI agents"));
  console.log();

  // 1. Install .claude/ config (agents, commands, settings)
  const claudeResult = copyDir(
    join(TEMPLATE, ".claude"),
    join(CWD, ".claude"),
    { preserveExisting: false } // Always update agent + commands
  );
  console.log(green("  \u2714 Installed") + " .claude/ config" + dim(` (${claudeResult.created.length} files)`));

  // 2. Install gsd-lite/ artifacts (preserve user data)
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

  // 3. Print summary
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
  console.log(bold("  gsd-lite") + " — Pair programming protocol for Claude Code");
  console.log();
  console.log("  " + bold("Usage:"));
  console.log("    npx gsd-lite          Install into current project");
  console.log("    npx gsd-lite --force   Overwrite all files (including user artifacts)");
  console.log("    npx gsd-lite --help    Show this help");
  console.log();
  console.log("  " + bold("What it does:"));
  console.log("    Copies .claude/ config and gsd-lite/ artifacts into your project.");
  console.log("    Your existing WORK.md, PROJECT.md etc. are preserved (use --force to overwrite).");
  console.log();
}

// --- Main ---
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  showHelp();
} else {
  install(args);
}
