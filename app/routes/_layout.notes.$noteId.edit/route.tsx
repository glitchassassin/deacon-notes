import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/Button";
import CompactNote from "~/components/CompactNote";
import EditNote from "~/routes/_layout.notes.$noteId.edit/EditNote";
import { getUser } from "~/services/auth";
import type { NoteResponse } from "~/services/contacts";
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
  note: NoteResponse;
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
          <EditNote note={note} onCancel={handleCancel} isLoading={isLoading} />
          {fetcher.data?.error && (
            <div className="text-red-600 text-sm">{fetcher.data.error}</div>
          )}
        </>
      ) : (
        <div className="relative group">
          <CompactNote
            note={optimisticNote}
            editButton={
              canEdit ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="text-xs"
                  variant="link"
                >
                  Edit
                </Button>
              ) : undefined
            }
          />
        </div>
      )}
    </fetcher.Form>
  );
}
