interface NoteHeaderProps {
  created: string;
  authorName: string;
  children?: React.ReactNode;
}

export default function NoteHeader({
  created,
  authorName,
  children,
}: NoteHeaderProps) {
  return (
    <div className="flex flex-wrap items-center text-sm">
      <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap pr-1">
        {new Date(created).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {authorName}
        </div>
        {children && <div className="ml-1">{children}</div>}
      </div>
    </div>
  );
}
