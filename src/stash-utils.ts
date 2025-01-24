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

// Updated function to move items to the trash using AppleScript
export async function clearStash() {
  ensureStashDir();
  const items = fs.readdirSync(STASH_DIR);

  if (items.length === 0) {
    console.log("Stash directory is already empty.");
    return;
  }

  // Generate AppleScript to move all items to the trash
  const appleScript = `
  tell application "Finder"
    set stashPath to POSIX file "${STASH_DIR}" as alias
    set stashItems to every item of stashPath
    repeat with itemRef in stashItems
      move itemRef to trash
    end repeat
  end tell
  `;

  try {
    execSync(`osascript -e '${appleScript}'`);
    console.log("All stashed items moved to trash.");
  } catch (error) {
    console.error("Failed to move items to trash:", error);
    throw error;
  }
}
