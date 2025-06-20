import { useEffect, useState } from "react";
import { data, useFetcher } from "react-router";
import { namedAction } from "remix-utils/named-action";
import z from "zod";
import {
  DeleteConnection,
  EditConnection,
  ViewConnection,
} from "~/components/notes/Connection";
import { getUser } from "~/services/auth";
import type { ConnectionNoteResponse } from "~/services/contacts";
import { deleteConnection, editConnectionNote } from "~/services/contacts";
import { Route } from "../_layout.notes.$noteId.edit/+types/route";

const editSchema = z.object({
  connectionType: z.string(),
  connected: z.enum(["yes", "no"]),
  comments: z.string(),
});

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const noteId = params.noteId;

  return namedAction(formData, {
    async edit() {
      const { connectionType, connected, comments } = editSchema.parse(
        Object.fromEntries(formData.entries())
      );

      await editConnectionNote(noteId, {
        connectionType,
        connected,
        comments,
      });

      return data({
        success: true,
      });
    },
    async delete() {
      await deleteConnection(noteId);

      return data({
        success: true,
      });
    },
  });
}

interface EditableConnectionProps {
  note: ConnectionNoteResponse;
}

export function EditableConnection({ note }: EditableConnectionProps) {
  const currentUser = getUser();
  const canEdit = currentUser && note.author._id === currentUser._id;
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticNote, setOptimisticNote] =
    useState<ConnectionNoteResponse | null>(note);

  useEffect(() => {
    setOptimisticNote(note);
  }, [note]);

  useEffect(() => {
    if (fetcher.formData) {
      const intent = fetcher.formData.get("intent");
      if (intent === "edit") {
        const { connectionType, connected, comments } = editSchema.parse(
          Object.fromEntries(fetcher.formData.entries())
        );

        setOptimisticNote({
          ...note,
          data: {
            ...note.data,
            connectionType,
            connected,
            comments,
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
      action={`/connections/${note._id}/edit`}
      className="space-y-3"
    >
      {isDeleting ? (
        <DeleteConnection
          note={note}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      ) : isEditing ? (
        <>
          <EditConnection
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
          <ViewConnection
            note={optimisticNote!}
            onEdit={canEdit ? () => setIsEditing(true) : undefined}
            onDelete={canEdit ? () => setIsDeleting(true) : undefined}
          />
        </div>
      )}
    </fetcher.Form>
  );
}
