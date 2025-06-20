import type { SimpleNoteResponse } from "~/services/contacts";
import { Button } from "../Button";
import NoteHeader from "../NoteHeader";
import NoteTextarea from "../NoteTextarea";

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
    <div>
      <NoteHeader created={created} authorName={authorName}>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={onEdit} className="text-xs" variant="link">
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={onDelete}
              className="text-xs"
              variant="link-danger"
            >
              Delete
            </Button>
          )}
        </div>
      </NoteHeader>

      <div className="flex flex-wrap items-center text-sm">
        <div
          className="text-gray-800 dark:text-gray-200 break-words"
          dangerouslySetInnerHTML={{ __html: data?.body ?? "" }}
        />
      </div>
    </div>
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
    <div>
      <NoteHeader created={note.created} authorName={note.author.name} />

      <NoteTextarea
        name="body"
        id="body"
        defaultValue={note.data?.body}
        rows={4}
        disabled={isLoading}
      />
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

      <button
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
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
    <div className="-mx-3 border-t border-b border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3">
      <ViewSimpleNote note={note} />

      <div className="mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <p className="font-medium text-red-800 dark:text-red-200">
            Are you sure you want to delete this note?
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            name="intent"
            value="delete"
            variant="danger"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Note"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
