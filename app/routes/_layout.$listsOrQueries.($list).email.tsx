import { useEffect, useState } from "react";
import { Link, useParams, useRouteLoaderData } from "react-router";
import { getUser } from "~/services/auth";
import { createBulkEmailConnections } from "~/services/contacts";
import { matchById } from "~/utils/matchById";
import { type Info as ParentInfo } from "./+types/_layout.$listsOrQueries.($list)";
import { Route } from "./+types/_layout.$listsOrQueries.($list).email";

// Define the parent route ID for useRouteLoaderData
const PARENT_ROUTE_ID = "routes/_layout.$listsOrQueries.($list)";

export function meta({ matches }: Partial<Route.MetaArgs>) {
  if (!matches) {
    return [
      {
        title: "Deacon Notes",
      },
    ];
  }
  const data = matchById(matches, PARENT_ROUTE_ID).data;
  return [
    {
      title: `${data?.title}`,
    },
  ];
}

export default function SendEmail() {
  const params = useParams();
  const loaderData =
    useRouteLoaderData<ParentInfo["loaderData"]>(PARENT_ROUTE_ID);

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const { title, _realm, emailAddresses } = loaderData;

  const [showConnectionNote, setShowConnectionNote] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    emailAddresses.then((emails) => {
      setEmails(emails);
      setLoading(false);
    });
  }, [emailAddresses]);

  const handleCopyEmails = () => {
    navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.list || !message.trim()) return;

    setSending(true);
    setSendResult(null);
    try {
      const result = await createBulkEmailConnections({
        contactListId: _realm,
        comments: message,
      });
      setSendResult({
        success: result.success,
        error: "error" in result ? result.error : undefined,
      });
    } catch (error) {
      setSendResult({ success: false, error: "An unexpected error occurred" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Send Bulk Email
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                to {title}
              </p>
            </div>
            <Link
              to={`/lists/${params.list}`}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ✕
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Step 1: Send the Email
              </h2>
              {loading ? (
                <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                  Loading email addresses...
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Choose how you want to send your email (list only includes
                    parents with email addresses):
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${user?.email}?bcc=${emails.join(",")}`}
                      onClick={() => setShowConnectionNote(true)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 text-center"
                    >
                      Open in Email Client
                    </a>
                    <button
                      onClick={() => {
                        handleCopyEmails();
                        setShowConnectionNote(true);
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {copied ? "Copied!" : "Copy Email Addresses"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {showConnectionNote && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Step 2: Record Email Connection
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add a note to record that you sent this email:
                </p>

                <form onSubmit={handleSubmitNote} className="space-y-4">
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Connection Note
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter details about the email you sent..."
                      required
                    />
                  </div>

                  {sendResult && (
                    <div
                      className={`p-4 rounded-md ${
                        sendResult.success
                          ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200"
                          : "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200"
                      }`}
                    >
                      {sendResult.success
                        ? "Successfully recorded email connections!"
                        : `Failed to record connections: ${sendResult.error}`}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    {sendResult?.success ? (
                      <Link
                        to={`/lists/${params.list}`}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Close
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/lists/${params.list}`}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          disabled={sending || !message.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending ? "Recording..." : "Record Connection"}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
