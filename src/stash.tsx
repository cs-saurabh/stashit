import { useState, useEffect } from "react";
import { LaunchProps, showToast, Toast } from "@raycast/api";
import { copyToStash } from "./stash-utils";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export default function StashCommand(props: LaunchProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const appleScript = `
  tell application "Finder"
    set theSelection to selection
    set pathsList to {}
    repeat with itemRef in theSelection
      set end of pathsList to POSIX path of (itemRef as alias)
    end repeat
    return pathsList
  end tell
  `;

  const runAppleScript = (script: string) => {
    const result = execSync(`osascript -e '${script}'`).toString().trim();
    // Parse the AppleScript output into an array of file paths
    return result.split(", ").map((path) => path.trim());
  };

  const isDirectory = (path: string) => {
    try {
      return fs.lstatSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const handleStash = async () => {
      try {
        const filePaths = runAppleScript(appleScript);
        if (filePaths.length === 0) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No files or folders selected in Finder!",
          });
          return;
        }

        // Determine if the selection contains files or folders
        const isSingleItem = filePaths.length === 1;
        const isDirectorySelection = isDirectory(filePaths[0]);

        if (isSingleItem) {
          const itemName = path.basename(filePaths[0]);
          if (isDirectorySelection) {
            await showToast({
              style: Toast.Style.Success,
              title: `📁 ${itemName} copied`,
            });
          } else {
            await showToast({
              style: Toast.Style.Success,
              title: `📄 ${itemName} copied`,
            });
          }
        } else {
          const containsFolders = filePaths.some((path) => isDirectory(path));
          if (containsFolders) {
            await showToast({
              style: Toast.Style.Success,
              title: "📁 Folders copied",
            });
          } else {
            await showToast({
              style: Toast.Style.Success,
              title: "📄 Files copied",
            });
          }
        }

        // Copy the selected items to the stash
        copyToStash(filePaths);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: error instanceof Error ? error.message : "Failed to stash items.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleStash();
  }, []);

  return null;
}
