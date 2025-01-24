import { confirmAlert, Icon, showToast, Toast } from "@raycast/api";
import { useEffect } from "react";
import { clearStash } from "./stash-utils";

export default function DeleteStash() {
  useEffect(() => {
    const deleteAllItems = async () => {
      const options = {
        title: "Delete All Stashed Items",
        message: "Are you sure you want to delete all items in the stash? This action cannot be undone.",
        icon: Icon.Trash,
        primaryAction: {
          title: "Delete",
          onAction: async () => {
            try {
              await clearStash();
              await showToast({
                style: Toast.Style.Success,
                title: "Success",
                message: "All stashed items have been deleted.",
              });
            } catch (error) {
              await showToast({
                style: Toast.Style.Failure,
                title: "Error",
                message: "Failed to delete stashed items.",
              });
            }
          },
        },
        dismissAction: {
          title: "Cancel",
          onAction: () => {
            showToast({
              style: Toast.Style.Animated,
              title: "Cancelled",
              message: "No items were deleted.",
            });
          },
        },
      };

      await confirmAlert(options);
    };

    deleteAllItems();
  }, []);

  return null;
}
