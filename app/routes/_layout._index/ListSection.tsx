import { Link } from "react-router";

type ListItem = {
  _id: string;
  title: string;
  url: string;
  isFavorite: boolean;
};

export function ListSection({
  title,
  items,
  onToggleFavorite,
}: {
  title: string;
  items: ListItem[] | undefined;
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">{title}</h2>
      <div className="grid gap-4">
        {!items ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
            No items found
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(item._id)}
                  className={`p-4 transition-all duration-200 ease-in-out ${
                    item.isFavorite
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-gray-400 [@media(hover:hover)]:hover:text-yellow-500 [@media(hover:hover)]:dark:hover:text-yellow-400"
                  }`}
                  title={
                    item.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform transition-transform duration-200 ease-in-out active:scale-125"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                      fill={item.isFavorite ? "currentColor" : "none"}
                    />
                  </svg>
                </button>
              )}
              <Link
                to={item.url}
                className="flex-1 p-4 text-gray-900 dark:text-gray-100 [@media(hover:hover)]:hover:text-sky-600 [@media(hover:hover)]:dark:hover:text-sky-400"
              >
                {item.title}
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
