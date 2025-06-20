import { Button } from "./Button";

interface NoteHeaderProps {
  created: string;
  authorName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NoteHeader({
  created,
  authorName,
  onEdit,
  onDelete,
}: NoteHeaderProps) {
  return (
    <div className="flex flex-wrap items-center text-sm gap-2">
      <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap pr-1">
        {new Date(created).toLocaleDateString()}
      </div>
      <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {authorName}
      </div>
      {onEdit && (
        <Button onClick={onEdit} className="text-xs" variant="link">
          Edit
        </Button>
      )}
      {onDelete && (
        <Button onClick={onDelete} className="text-xs" variant="link-danger">
          Delete
        </Button>
      )}
    </div>
  );
}
