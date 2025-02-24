import { NoteResponse } from "~/services/contacts";

function CompactNote({
  note: {
    data,
    fullDefinition,
    created,
    author: { name: authorName },
  },
  includeDate = true,
  includeAuthor = true,
}: {
  note: NoteResponse;
  includeDate?: boolean;
  includeAuthor?: boolean;
}) {
  const isConnection = fullDefinition.definitionName === "connection";
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

  const date = new Date(created).toLocaleDateString();

  return (
    <div>
      <div className="flex flex-wrap items-center text-sm">
        {/* Date */}
        {includeDate && (
          <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap pr-1">
            {date}
          </div>
        )}

        {/* Author */}
        {includeAuthor && (
          <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap pr-1">
            {authorName}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center text-sm">
        {/* Connection-specific elements */}
        {isConnection && (
          <div className="text-gray-600 dark:text-gray-300 whitespace-nowrap pr-1">
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
          <div className="text-gray-800 dark:text-gray-200 break-words">
            {data?.comments || (
              <span className="italic text-gray-500 dark:text-gray-400">
                No comments
              </span>
            )}
          </div>
        ) : (
          <div
            className="text-gray-800 dark:text-gray-200 break-words"
            dangerouslySetInnerHTML={{ __html: data?.body ?? "" }}
          />
        )}
      </div>
    </div>
  );
}

export default CompactNote;
