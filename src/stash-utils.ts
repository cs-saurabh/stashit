import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const STASH_DIR = path.join(process.env.HOME || "", ".stashit");

export function ensureStashDir() {
  if (!fs.existsSync(STASH_DIR)) {
    fs.mkdirSync(STASH_DIR, { recursive: true });
  }
}

export function copyToStash(filePaths: string[]) {
  ensureStashDir();
  filePaths.forEach((filePath) => {
    const dest = path.join(STASH_DIR, path.basename(filePath));
    execSync(`cp -R "${filePath}" "${dest}"`);
  });
}

export function getStashedItems() {
  ensureStashDir();
  return fs.readdirSync(STASH_DIR).map((file) => ({
    name: file,
    path: path.join(STASH_DIR, file),
  }));
}

// Updated function to recursively delete all files and folders in the stash directory
export function clearStash() {
  ensureStashDir();
  const items = fs.readdirSync(STASH_DIR);

  items.forEach((item) => {
    const itemPath = path.join(STASH_DIR, item);
    fs.rmSync(itemPath, { recursive: true, force: true });
  });

  console.log("Stash directory cleared successfully.");
}
