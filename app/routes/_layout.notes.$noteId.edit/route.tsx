import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { EditSimpleNote, ViewSimpleNote } from "~/components/notes/SimpleNote";
import { getUser } from "~/services/auth";
import type { SimpleNoteResponse } from "~/services/contacts";
import { editNote } from "~/services/contacts";

export async function clientAction({
  request,
  params,
}: {
  request: Request;
  params: { noteId: string };
}) {
  const formData = await request.formData();
  const body = formData.get("body") as string;
  const noteId = params.noteId;

  if (!noteId) {
    throw new Error("Note ID is required");
  }

  if (!body) {
    throw new Error("Note body is required");
  }

  await editNote(noteId, body);

  return {
    success: true,
  };
}

interface EditableNoteProps {
  note: SimpleNoteResponse;
}

export function EditableNote({ note }: EditableNoteProps) {
  const currentUser = getUser();
  const canEdit = currentUser && note.author._id === currentUser._id;
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticNote, setOptimisticNote] = useState(note);

  useEffect(() => {
    setOptimisticNote(note);
  }, [note]);

  useEffect(() => {
    if (fetcher.formData) {
      setOptimisticNote({
        ...note,
        data: {
          ...note.data,
          body: fetcher.formData.get("body") as string,
        },
      });
    }
  }, [fetcher.formData, note]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setIsEditing(false);
    }
  }, [fetcher.state, fetcher.data?.success]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <fetcher.Form
      method="post"
      action={`/notes/${note._id}/edit`}
      className="space-y-3"
    >
      {isEditing ? (
        <>
          <EditSimpleNote
            note={note}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
          {fetcher.data?.error && (
            <div className="text-red-600 text-sm">{fetcher.data.error}</div>
          )}
        </>
      ) : (
        <div className="relative group">
          <ViewSimpleNote
            note={optimisticNote}
            onEdit={canEdit ? () => setIsEditing(true) : undefined}
          />
        </div>
      )}
    </fetcher.Form>
  );
}
