import { Link, useNavigation } from "react-router";
import { getUser } from "~/services/auth";
import { SearchInput } from "./SearchInput";
import { UserMenu } from "./UserMenu";

// Use the return type of getUser() for the user prop
type User = ReturnType<typeof getUser>;

interface SiteHeaderProps {
  user?: User;
  isLoading?: boolean;
}

export function SiteHeader({
  user = null,
  isLoading = false,
}: SiteHeaderProps) {
  const navigation = useNavigation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-md print:hidden">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Deacon Notes
            </Link>
            <div className="md:hidden">
              <UserMenu user={user} />
            </div>
          </div>
          <div className="flex-grow">
            <SearchInput disabled={!user} />
          </div>
          <div className="hidden md:block">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
      <div
        className={`h-1 bg-sky-500 transition-all duration-300 ease-in-out ${
          isLoading || navigation.state !== "idle" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: isLoading || navigation.state !== "idle" ? "100%" : "0%",
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
        }}
      />
    </nav>
  );
}
