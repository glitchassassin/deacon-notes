import { Button } from "../Button";
import NoteHeader from "../NoteHeader";

// View component for displaying connection notes
export function ViewBase({
  created,
  authorName,
  onEdit,
  onDelete,
  children,
}: {
  created: string;
  authorName: string;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <NoteHeader
        created={created}
        authorName={authorName}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="flex flex-wrap items-center text-sm">{children}</div>
    </div>
  );
}

// Edit component for editing existing connection notes
export function EditBase({
  created,
  authorName,
  onEdit,
  onDelete,
  onCancel,
  isLoading,
  children,
}: {
  created: string;
  authorName: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 space-y-2 -mx-3 border-t border-b border-gray-200 dark:border-gray-700 p-3">
      <NoteHeader
        created={created}
        authorName={authorName}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {children}

      <div className="flex gap-2">
        <Button
          type="submit"
          name="intent"
          value="edit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Delete confirmation component for deleting connection notes
export function DeleteBase({
  onCancel,
  isLoading,
  children,
}: {
  children: React.ReactNode;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4 -mx-3 border-t border-b border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3">
      {children}

      <div className="flex gap-2">
        <Button
          type="submit"
          name="intent"
          value="delete"
          variant="danger"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
