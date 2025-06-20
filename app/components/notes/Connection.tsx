import type { ConnectionNoteResponse, NoteResponse } from "~/services/contacts";
import { Button } from "../Button";
import NoteHeader from "../NoteHeader";
import NoteTextarea from "../NoteTextarea";

// View component for displaying connection notes
export function ViewConnection({
  note: {
    data,
    fullDefinition,
    created,
    author: { name: authorName },
  },
  editButton,
}: {
  note: ConnectionNoteResponse;
  editButton?: React.ReactNode;
}) {
  const connectionTypeField = fullDefinition.fields.find(
    (field) => field.key === "connectionType"
  );
  const connectionType = connectionTypeField?.options?.find(
    (option) => option.value === data?.connectionType
  )?.name;

  const connectedField = fullDefinition.fields.find(
    (field) => field.key === "connected"
  );
  const connected =
    connectedField?.options?.find((option) => option.value === data?.connected)
      ?.name === "Yes";

  return (
    <div>
      <NoteHeader created={created} authorName={authorName}>
        {editButton}
      </NoteHeader>

      <div className="flex flex-wrap items-center text-sm">
        <div className="text-gray-600 dark:text-gray-300 whitespace-nowrap pr-1">
          {connectionType ?? "Unknown connection type"} (
          {connected ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-red-600">✗</span>
          )}
          ):
        </div>

        <div className="text-gray-800 dark:text-gray-200 break-words">
          {data?.comments || (
            <span className="italic text-gray-500 dark:text-gray-400">
              No comments
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Edit component for editing existing connection notes
export function EditConnection({
  note,
  onCancel,
  isLoading,
}: {
  note: ConnectionNoteResponse;
  onCancel: () => void;
  isLoading: boolean;
}) {
  // TODO: Generate form fields dynamically from note.fullDefinition.fields
  // This will include connectionType, connected, and any other fields defined in the note definition

  return (
    <div>
      <NoteHeader created={note.created} authorName={note.author.name} />

      {/* TODO: Dynamic form fields based on note.fullDefinition.fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Connection Type
          </label>
          <select
            name="connectionType"
            defaultValue={note.data?.connectionType}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {/* TODO: Populate options from note.fullDefinition.fields */}
            <option value="">Select connection type...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Connected
          </label>
          <select
            name="connected"
            defaultValue={note.data?.connected}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {/* TODO: Populate options from note.fullDefinition.fields */}
            <option value="">Select status...</option>
          </select>
        </div>

        <NoteTextarea
          name="comments"
          id="comments"
          defaultValue={note.data?.comments}
          rows={4}
          label="Comments"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 mt-4">
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

// Create component for creating new connection notes
export function CreateConnection({
  noteDefinition,
  onSubmit,
  isLoading,
  error,
}: {
  noteDefinition: NoteResponse["fullDefinition"];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: string;
}) {
  // TODO: Generate form fields dynamically from noteDefinition.fields

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-md transition-shadow p-3 my-4 print:hidden"
    >
      <div className="flex flex-col gap-3">
        {/* TODO: Dynamic form fields based on noteDefinition.fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Connection Type
          </label>
          <select
            name="connectionType"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {/* TODO: Populate options from noteDefinition.fields */}
            <option value="">Select connection type...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Connected
          </label>
          <select
            name="connected"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {/* TODO: Populate options from noteDefinition.fields */}
            <option value="">Select status...</option>
          </select>
        </div>

        <NoteTextarea
          name="comments"
          id="comments"
          rows={3}
          disabled={isLoading}
          label="Comments"
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
    </form>
  );
}
