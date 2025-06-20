import { useEffect, useState } from "react";
import { data, useFetcher } from "react-router";
import { namedAction } from "remix-utils/named-action";
import {
  DeleteSimpleNote,
  EditSimpleNote,
  ViewSimpleNote,
} from "~/components/notes/SimpleNote";
import { getUser } from "~/services/auth";
import type { SimpleNoteResponse } from "~/services/contacts";
import { deleteNote, editNote } from "~/services/contacts";
import { Route } from "../_layout.notes.$noteId.edit/+types/route";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const noteId = params.noteId;

  return namedAction(formData, {
    async edit() {
      const body = formData.get("body") as string;
      if (!body) {
        throw new Error("Note body is required");
      }

      await editNote(noteId, body);

      return data({
        success: true,
      });
    },
    async delete() {
      await deleteNote(noteId);

      return data({
        success: true,
      });
    },
  });
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticNote, setOptimisticNote] =
    useState<SimpleNoteResponse | null>(note);

  useEffect(() => {
    setOptimisticNote(note);
  }, [note]);

  useEffect(() => {
    if (fetcher.formData) {
      const intent = fetcher.formData.get("intent");
      if (intent === "edit") {
        setOptimisticNote({
          ...note,
          data: {
            ...note.data,
            body: fetcher.formData.get("body") as string,
          },
        });
      } else if (intent === "delete") {
        setOptimisticNote(null);
      }
    }
  }, [fetcher.formData, note]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setIsEditing(false);
      setIsDeleting(false);
    }
  }, [fetcher.state, fetcher.data?.success]);

  const handleCancel = () => {
    setIsEditing(false);
    setIsDeleting(false);
  };

  if (optimisticNote === null && !isDeleting) {
    return null;
  }

  return (
    <fetcher.Form
      method="post"
      action={`/notes/${note._id}/edit`}
      className="space-y-3"
    >
      {isDeleting ? (
        <DeleteSimpleNote
          note={note}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      ) : isEditing ? (
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
            note={optimisticNote!}
            onEdit={canEdit ? () => setIsEditing(true) : undefined}
            onDelete={canEdit ? () => setIsDeleting(true) : undefined}
          />
        </div>
      )}
    </fetcher.Form>
  );
}
