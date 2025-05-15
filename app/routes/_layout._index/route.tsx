import { useEffect, useMemo, useState } from "react";
import { useUserPreferences } from "~/contexts/UserPreferencesContext";
import { optimisticCache } from "~/services/cache";
import { getContactLists, getContactQueries } from "~/services/contacts";
import { Route } from "../_layout._index/+types/route";
import { ListSection } from "./ListSection";

export function meta() {
  return [
    {
      title: "Contact Lists",
    },
  ];
}

export async function clientLoader() {
  return {
    contactLists: optimisticCache("contactLists", getContactLists),
    contactQueries: optimisticCache("contactQueries", getContactQueries),
  };
}

type ListItem = {
  _id: string;
  title: string;
  url: string;
  isFavorite: boolean;
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contactLists, contactQueries } = loaderData;
  const [lists, setLists] = useState(contactLists.optimistic);
  const [queries, setQueries] = useState(contactQueries.optimistic);
  const { preferences, toggleFavorite, isPastoralStaff, isDeacon } =
    useUserPreferences();

  useEffect(() => {
    contactLists.fetched.then(setLists);
    contactQueries.fetched.then(setQueries);
  }, [contactLists.fetched, contactQueries.fetched]);

  const filteredContactLists = useMemo(() => {
    if (isDeacon) {
      return lists?.filter((list) =>
        list.title.startsWith("Deacon Care Group")
      );
    }
    return lists;
  }, [lists, isDeacon]);

  // Create favorites list by combining matching lists and queries
  const favoriteItems = useMemo(
    () =>
      preferences.favorites
        .map((id) => {
          const list = lists?.find((l) => l._id === id);
          if (list) {
            return {
              _id: list._id,
              title: list.title,
              url: `/lists/${list._id}`,
              isFavorite: true,
            };
          }
          const query = queries?.find((q) => q._id === id);
          if (query) {
            return {
              _id: query._id,
              title: query.title,
              url: `/queries/${query._id}`,
              isFavorite: true,
            };
          }
          return null;
        })
        .filter((item): item is ListItem => item !== null),
    [preferences.favorites, lists, queries]
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-4xl mx-auto">
        {favoriteItems.length > 0 && (
          <ListSection
            title="Favorites"
            items={favoriteItems}
            onToggleFavorite={toggleFavorite}
          />
        )}

        <ListSection
          title="Contact Lists"
          items={filteredContactLists?.map((list) => ({
            _id: list._id,
            title: list.title,
            url: `/lists/${list._id}`,
            isFavorite: preferences.favorites.includes(list._id),
          }))}
          onToggleFavorite={toggleFavorite}
        />

        {isPastoralStaff && (
          <ListSection
            title="Contact Queries"
            items={queries?.map((query) => ({
              _id: query._id,
              title: query.title,
              url: `/queries/${query._id}`,
              isFavorite: preferences.favorites.includes(query._id),
            }))}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}
