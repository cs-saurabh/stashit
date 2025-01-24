import { Action, ActionPanel, List, Clipboard, Icon } from "@raycast/api";
import { getStashedItems } from "./stash-utils";

export default function ListStash() {
  const items = getStashedItems();

  const copyFileToClipboard = async (filePath: string) => {
    try {
      // Pass the absolute file path directly
      await Clipboard.copy({ file: filePath });
    } catch (error) {
      console.error("Failed to copy file to clipboard:", error);
    }
  };

  return (
    <List>
      {items.map((item) => (
        <List.Item
          key={item.path}
          title={item.name}
          actions={
            <ActionPanel>
              <Action title="Copy File" icon={Icon.Clipboard} onAction={() => copyFileToClipboard(item.path)} />
              <Action.OpenWith path={item.path} />
              <Action.ShowInFinder path={item.path} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
