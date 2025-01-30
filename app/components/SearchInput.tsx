import { Form } from "react-router";

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  defaultValue,
  placeholder = "Search contacts...",
  className = "",
}: SearchInputProps) {
  return (
    <Form
      method="get"
      action="/search"
      className={`flex items-center gap-2 ${className}`}
    >
      <div className="relative flex-grow">
        <input
          type="search"
          name="query"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full px-4 py-1.5 pr-10 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
