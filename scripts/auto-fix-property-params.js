#!/usr/bin/env node
//
// scripts/auto-fix-property-params.js
//
// Usage:
//   # preview changes (no write)
//   node scripts/auto-fix-property-params.js
//   # apply changes (will modify the file)
//   node scripts/auto-fix-property-params.js --apply
//

import { Project, SyntaxKind } from "ts-morph";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apply = process.argv.includes("--apply");
const repoRoot = process.cwd();
const targetRel = "packages/api/controllers/properties/property.controller.ts";
const targetPath = path.resolve(repoRoot, targetRel);

const paramNames = new Set(["property", "p"]);

try {
  const project = new Project({
    // if you want to use a different tsconfig, adjust path here
    tsConfigFilePath: path.resolve(repoRoot, "tsconfig.json"),
    // we add file explicitly so we don't load the whole workspace
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = project.addSourceFileAtPath(targetPath);
  const params = sourceFile.getDescendantsOfKind(SyntaxKind.Parameter);

  const toChange = params
    .filter(p => paramNames.has(p.getName()))
    .filter(p => !p.getTypeNode()) // only those lacking explicit type
    .map(p => ({
      name: p.getName(),
      line: p.getStartLineNumber(),
      kind: p.getParent().getKindName(),
      node: p,
    }));

  if (toChange.length === 0) {
    console.log(`No untyped parameters named ${[...paramNames].join(", ")} found in ${targetRel}`);
    process.exit(0);
  }

  console.log(`Found ${toChange.length} untyped parameter(s) in ${targetRel}:`);
  toChange.forEach(c => {
    console.log(`  - name: ${c.name}  line: ${c.line}  parentKind: ${c.kind}`);
  });

  if (!apply) {
    console.log("\nPreview only — no files modified.");
    console.log("Run with '--apply' to add ': any' to these parameters.");
    process.exit(0);
  }

  // Apply changes
  toChange.forEach(c => {
    c.node.setType("any");
  });

  sourceFile.saveSync();
  console.log("\nApplied changes and saved file:", targetRel);
  console.log("Tip: review the change and run your typecheck (commands below).");
} catch (err) {
  console.error("Error:", err && err.message ? err.message : err);
  process.exit(2);
}