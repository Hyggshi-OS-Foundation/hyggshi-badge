#!/usr/bin/env node
/**
 * Regenerates lib/renderer/resource-icons.ts from lib/renderer/icon-manifest.ts.
 *
 * Why: resource-icons.ts must stay a plain static object (it's imported by
 * client components like app/page.tsx), so we can't read files from disk at
 * runtime. Instead, we read them once here at build time and inline them.
 *
 * Usage: npm run generate:icons
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'lib/renderer/icon-manifest.ts');
const OUTPUT_PATH = path.join(ROOT, 'lib/renderer/resource-icons.ts');

function loadManifest() {
  const src = readFileSync(MANIFEST_PATH, 'utf-8');
  const match = src.match(/ICON_MANIFEST[^{]*\{([\s\S]*?)\n\};/);
  if (!match) throw new Error('Could not find ICON_MANIFEST in icon-manifest.ts');

  const entries = {};
  const lineRe = /^\s*(\w+):\s*"([^"]+)",?\s*$/gm;
  let m;
  while ((m = lineRe.exec(match[1]))) {
    entries[m[1]] = m[2];
  }
  return entries;
}

function extractSvg(filePath) {
  const raw = readFileSync(filePath, 'utf-8');

  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) throw new Error(`No viewBox found in ${filePath}`);
  const viewBox = viewBoxMatch[1];

  // Inner content: everything between the <svg ...> open tag and </svg>,
  // with an optional <title>...</title> stripped off the front.
  const bodyMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!bodyMatch) throw new Error(`Could not parse <svg> body in ${filePath}`);
  const svgContent = bodyMatch[1].replace(/^<title>[^<]*<\/title>/, '').trim();

  const colorMatch = svgContent.match(/fill="(#[0-9a-fA-F]{3,8})"/);
  const defaultColor = colorMatch ? colorMatch[1] : '#000000';

  return { viewBox, svgContent, defaultColor };
}

function jsStringLiteral(str) {
  return JSON.stringify(str);
}

function main() {
  const manifest = loadManifest();
  const slugs = Object.keys(manifest).sort();

  const entries = slugs.map((slug) => {
    const relPath = manifest[slug]; // e.g. "./Resources/c-sharp.svg"
    const filePath = path.join(ROOT, relPath.replace(/^\.\//, ''));
    if (!existsSync(filePath)) {
      throw new Error(`Missing icon file for "${slug}": ${filePath}`);
    }
    const { viewBox, svgContent, defaultColor } = extractSvg(filePath);
    return `  ${slug}: {\n    viewBox: ${jsStringLiteral(viewBox)},\n    defaultColor: ${jsStringLiteral(defaultColor)},\n    svgContent: ${jsStringLiteral(svgContent)}\n  }`;
  });

  const output = `import { IconData } from './icons';

/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Generated from lib/renderer/icon-manifest.ts + the SVG files under
 * /Resources by scripts/generate-resource-icons.mjs.
 *
 * To add or change an icon: edit icon-manifest.ts, then run
 * \`npm run generate:icons\`.
 */
export const RESOURCE_ICONS: Record<string, IconData> = {
${entries.join(',\n')}
};
`;

  writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log(`Generated ${slugs.length} icons -> ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main();
