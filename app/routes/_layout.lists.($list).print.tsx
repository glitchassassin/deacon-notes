import { Outlet, redirect, useLocation } from "react-router";
import { Button, LinkButton } from "~/components/Button";
import { matchById } from "~/utils/matchById";
import type { Route } from "./+types/_layout.lists.($list).print";

// Define the parent route ID for useRouteLoaderData
const PARENT_ROUTE_ID = "routes/_layout.lists.($list)";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);

  if (url.pathname.endsWith("print")) {
    return redirect("spreadsheet");
  }

  return null;
}

export function meta({ matches }: Partial<Route.MetaArgs>) {
  if (!matches) {
    return [
      {
        title: "Print | Deacon Notes",
      },
    ];
  }
  const data = matchById(matches, PARENT_ROUTE_ID).data;
  return [
    {
      title: `Print | ${data?.title ?? "Deacon Notes"}`,
    },
  ];
}

export default function PrintPreview({ matches }: Route.ComponentProps) {
  const loaderData = matchById(matches, PARENT_ROUTE_ID).data;
  const location = useLocation();
  const currentView = location.pathname.endsWith("spreadsheet")
    ? "spreadsheet"
    : location.pathname.endsWith("facesheet")
    ? "facesheet"
    : null;

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const { title } = loaderData;

  return (
    <div className="min-h-screen min-w-[8.5in] bg-gray-100 dark:bg-gray-900 print:text-black p-4 print:p-0 print:bg-white">
      <div className="w-[8.5in] mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 print:text-black">
          {title}
        </h1>
        <div className="flex flex-wrap gap-4 mb-8 justify-between print:hidden">
          <div className="flex gap-2 order-2 sm:order-1">
            <LinkButton
              to="spreadsheet"
              variant={currentView === "spreadsheet" ? "primary" : "secondary"}
            >
              Spreadsheet
            </LinkButton>
            <LinkButton
              to="facesheet"
              variant={currentView === "facesheet" ? "primary" : "secondary"}
            >
              Face Sheet
            </LinkButton>
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2 justify-end">
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
