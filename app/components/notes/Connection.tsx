import type { ConnectionNoteResponse } from "~/services/contacts";
import NoteTextarea from "../NoteTextarea";
import { DeleteBase, EditBase, ViewBase } from "./Base";

// View component for displaying connection notes
export function ViewConnection({
  note: {
    data,
    fullDefinition,
    created,
    author: { name: authorName },
  },
  onEdit,
  onDelete,
}: {
  note: ConnectionNoteResponse;
  editButton?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
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
    <ViewBase
      created={created}
      authorName={authorName}
      onEdit={onEdit}
      onDelete={onDelete}
    >
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
    </ViewBase>
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
  const connectionTypeField = note.fullDefinition.fields.find(
    (field) => field.key === "connectionType"
  );
  const connectedField = note.fullDefinition.fields.find(
    (field) => field.key === "connected"
  );

  return (
    <EditBase
      created={note.created}
      authorName={note.author.name}
      onCancel={onCancel}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Connection Type
            </label>
            <select
              name="connectionType"
              defaultValue={note.data?.connectionType}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {connectionTypeField?.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Connected
            </label>
            <select
              name="connected"
              defaultValue={note.data?.connected}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {connectedField?.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
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
    </EditBase>
  );
}

// Delete confirmation component for deleting connection notes
export function DeleteConnection({
  note,
  onCancel,
  isLoading,
}: {
  note: ConnectionNoteResponse;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <DeleteBase onCancel={onCancel} isLoading={isLoading}>
      <ViewConnection note={note} />
    </DeleteBase>
  );
}
