import { NoteResponse } from "~/services/contacts";
import NoteHeader from "./NoteHeader";

function CompactNote({
  note: {
    data,
    fullDefinition,
    created,
    author: { name: authorName },
  },
  editButton,
}: {
  note: NoteResponse;
  editButton?: React.ReactNode;
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

  return (
    <div>
      <NoteHeader created={created} authorName={authorName}>
        {editButton}
      </NoteHeader>

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
