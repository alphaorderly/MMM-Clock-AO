import { readdirSync, copyFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const jsFiles = readdirSync(root).filter(
  (f) => f.startsWith("MMM-") && f.endsWith(".js"),
);
if (jsFiles.length === 0) {
  console.error("[postbuild] No MMM-*.js file found in project root.");
  process.exit(1);
}
if (jsFiles.length > 1) {
  console.warn(
    `[postbuild] Multiple MMM-*.js files found: ${jsFiles.join(", ")}. Using first: ${jsFiles[0]}`,
  );
}

const moduleJs = jsFiles[0];
const moduleName = basename(moduleJs, ".js");
const distDir = join(root, "dist");
const outDir = join(root, moduleName);

if (!existsSync(distDir)) {
  console.error(
    `[postbuild] dist/ directory not found at ${distDir}. Did the build succeed?`,
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const targetDistDir = join(outDir, "dist");
mkdirSync(targetDistDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursiveSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursiveSync(distDir, targetDistDir);
console.log(`[postbuild] Copied dist/ → ${moduleName}/dist/`);

copyFileSync(join(root, moduleJs), join(outDir, moduleJs));
console.log(`[postbuild] Copied ${moduleJs} → ${moduleName}/${moduleJs}`);

console.log(`[postbuild] Done. Output folder: ${moduleName}/`);
