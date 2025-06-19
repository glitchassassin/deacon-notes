import clsx from "clsx";
import { Form } from "react-router";

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchInput({
  defaultValue,
  placeholder = "Search contacts...",
  className = "",
  disabled = false,
}: SearchInputProps) {
  return (
    <Form
      method="get"
      action="/search"
      className={clsx(
        "flex items-center gap-2",
        className,
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <div className="relative grow">
        <input
          type="search"
          name="query"
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-1.5 pr-10 rounded-sm border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
        />
        <button
          type="submit"
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </Form>
  );
}
