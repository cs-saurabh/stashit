import { Action, ActionPanel, List, Icon, showToast, Toast, Clipboard } from "@raycast/api";
import { getStashedItems } from "./stash-utils";
import fs from "fs";
import path from "path";

// Helper function to get the appropriate icon for a file or folder
const getIconForItem = (itemPath: string) => {
  if (fs.lstatSync(itemPath).isDirectory()) {
    return Icon.Folder; // Use folder icon for directories
  }

  const extension = path.extname(itemPath).toLowerCase();

  // Map file extensions to icons
  switch (extension) {
    case ".png":
    case ".jpg":
    case ".jpeg":
    case ".gif":
    case ".bmp":
    case ".webp":
      return Icon.Image; // Use image icon for image files
    case ".pdf":
      return Icon.Document; // Use document icon for PDFs
    case ".txt":
    case ".md":
      return Icon.TextDocument; // Use text document icon for text files
    case ".zip":
    case ".tar":
    case ".gz":
      return Icon.Folder; // Use zip file icon for archives
    default:
      return Icon.Document; // Use generic file icon for other file types
  }
};

// Helper function to check if a file is an image
const isImageFile = (filePath: string) => {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];
  const extension = path.extname(filePath).toLowerCase();
  return imageExtensions.includes(extension);
};

// Helper function to convert a file path to a file URL
const getFileUrl = (filePath: string) => {
  return `file://${filePath}`;
};

export default function ListStash() {
  const items = getStashedItems();

  const handleCopy = async (filePath: string) => {
    try {
      await Clipboard.copy({ file: filePath });
      await showToast({
        style: Toast.Style.Success,
        title: "Copied to Clipboard",
        message: `${path.basename(filePath)} is ready to be pasted.`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to copy the item to the clipboard.",
      });
    }
  };

  return (
    <List
      isShowingDetail={true} // Enable detail view
      filtering={false}
    >
      {items.map((item) => (
        <List.Item
          key={item.path}
          id={item.path}
          title={item.name}
          icon={getIconForItem(item.path)}
          detail={
            <List.Item.Detail
              markdown={
                isImageFile(item.path)
                  ? `![${item.name}](${getFileUrl(item.path)})` // Use file URL for image preview
                  : `**${item.name}**` // Show file name for non-image files
              }
            />
          }
          actions={
            <ActionPanel>
              <Action
                title="Copy File"
                icon={Icon.Clipboard}
                onAction={() => handleCopy(item.path)}
                shortcut={{ modifiers: [], key: "enter" }} // Use Enter to copy
              />
              <Action.OpenWith path={item.path} />
              <Action.ShowInFinder path={item.path} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
