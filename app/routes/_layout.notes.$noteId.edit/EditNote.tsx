import type { NoteResponse } from "~/services/contacts";
import { Button } from "../../components/Button";
import NoteHeader from "../../components/NoteHeader";
import NoteTextarea from "../../components/NoteTextarea";

interface EditNoteProps {
  note: NoteResponse;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EditNote({ note, onCancel, isLoading }: EditNoteProps) {
  return (
    <div>
      <NoteHeader created={note.created} authorName={note.author.name} />

      <NoteTextarea
        name="body"
        id="body"
        defaultValue={note.data?.body}
        rows={4}
        label="Edit Note"
        disabled={isLoading}
      />
      <div className="flex gap-2">
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
