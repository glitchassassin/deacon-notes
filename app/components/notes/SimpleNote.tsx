import type { SimpleNoteResponse } from "~/services/contacts";
import { Button } from "../Button";
import NoteTextarea from "../NoteTextarea";
import { DeleteBase, EditBase, ViewBase } from "./Base";

// View component for displaying simple notes
export function ViewSimpleNote({
  note: {
    data,
    created,
    author: { name: authorName },
  },
  onEdit,
  onDelete,
}: {
  note: SimpleNoteResponse;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <ViewBase
      created={created}
      authorName={authorName}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div
        className="text-gray-800 dark:text-gray-200 break-words"
        dangerouslySetInnerHTML={{ __html: data?.body ?? "" }}
      />
    </ViewBase>
  );
}

// Edit component for editing existing simple notes
export function EditSimpleNote({
  note,
  onCancel,
  isLoading,
}: {
  note: SimpleNoteResponse;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <EditBase
      created={note.created}
      authorName={note.author.name}
      onCancel={onCancel}
      isLoading={isLoading}
    >
      <NoteTextarea
        name="body"
        id="body"
        defaultValue={note.data?.body}
        rows={4}
        disabled={isLoading}
      />
    </EditBase>
  );
}

// Create component for creating new simple notes
export function CreateSimpleNote({
  value,
  onChange,
  isLoading,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <NoteTextarea
        name="body"
        id="body"
        value={value}
        onChange={onChange}
        rows={3}
        disabled={isLoading}
        label="New Note"
      />
      {error && <div className="mt-1 text-red-600 text-sm">{error}</div>}

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

// Delete confirmation component for deleting notes
export function DeleteSimpleNote({
  note,
  onCancel,
  isLoading,
}: {
  note: SimpleNoteResponse;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <DeleteBase onCancel={onCancel} isLoading={isLoading}>
      <ViewSimpleNote note={note} />
    </DeleteBase>
  );
}
