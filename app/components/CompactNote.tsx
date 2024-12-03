import { NoteResponse } from "~/services/contacts";

function CompactNote({
  data,
  fullDefinition,
  created,
  author: { name: authorName },
}: NoteResponse) {
  const isConnection = fullDefinition.definitionName === "connection";
  const connectionTypeField = fullDefinition.fields.find(
    (field) => field.key === "connectionType"
  );
  const connectionType = connectionTypeField?.options?.find(
    (option) => option.value === data.connectionType
  )?.name;

  const connectedField = fullDefinition.fields.find(
    (field) => field.key === "connected"
  );
  const connected =
    connectedField?.options?.find((option) => option.value === data.connected)
      ?.name === "Yes";

  const date = new Date(created).toLocaleDateString();

  return (
    <div className="flex flex-wrap items-center text-sm">
      {/* Date */}
      <div className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap w-[10ch]">
        {date}
      </div>

      {/* Author */}
      <div className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap pr-1">
        {authorName}
      </div>

      {/* Connection-specific elements */}
      {isConnection && (
        <div className="text-zinc-600 dark:text-zinc-300 whitespace-nowrap pr-1">
          {connectionType ?? "Unknown connection type"} (
          {connected ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-red-600">✗</span>
          )}
          ):
        </div>
      )}

      {/* Note body or connection comments */}
      {isConnection ? (
        <div className="text-zinc-700 dark:text-zinc-200 break-words">
          {data.comments || (
            <span className="italic text-zinc-500 dark:text-zinc-400">
              No comments
            </span>
          )}
        </div>
      ) : (
        <div
          className="text-zinc-700 dark:text-zinc-200 break-words"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      )}
    </div>
  );
}

export default CompactNote;
