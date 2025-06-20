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
}: {
  note: SimpleNoteResponse;
  onEdit?: () => void;
}) {
  return (
    <div>
      <NoteHeader created={created} authorName={authorName}>
        {onEdit && (
          <Button onClick={onEdit} className="text-xs" variant="link">
            Edit
          </Button>
        )}
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
        label="Edit Note"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={isLoading}>
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
