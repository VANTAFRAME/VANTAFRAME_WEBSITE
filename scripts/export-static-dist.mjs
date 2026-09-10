import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const distDir = "dist";
const clientDir = join(distDir, "client");

if (!existsSync(clientDir)) {
  process.exit(0);
}

const tempDir = mkdtempSync(join(tmpdir(), "vf-static-dist-"));

cpSync(clientDir, tempDir, { recursive: true });
rmSync(distDir, { recursive: true, force: true });
cpSync(tempDir, distDir, { recursive: true });
rmSync(tempDir, { recursive: true, force: true });

console.log("Static FTP export prepared in dist/");
