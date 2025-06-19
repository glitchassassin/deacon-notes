interface NoteTextareaProps {
  name: string;
  id: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  label?: string;
}

export default function NoteTextarea({
  name,
  id,
  defaultValue,
  value,
  onChange,
  placeholder = "Enter note content...",
  rows = 3,
  disabled = false,
  label,
}: NoteTextareaProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        name={name}
        id={id}
        rows={rows}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        className="w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-sky-500 disabled:opacity-50"
        placeholder={placeholder}
        onChange={(event) => {
          onChange?.(event.target.value);
        }}
      />
    </div>
  );
}
