import { Link } from "react-router";
import { groupContactsByFamily } from "~/services/contacts";

function lastPostActivity(
  posts: {
    updated: string;
  }[]
) {
  const lastPost = posts.reduce((acc, post) => {
    return post.updated > acc ? post.updated : acc;
  }, "");
  if (!lastPost) return undefined;
  return new Date(lastPost);
}

type Family = ReturnType<typeof groupContactsByFamily>[string];

function FamilyContact({ contact }: { contact: Family["parents"][number] }) {
  return (
    <Link
      to={`/contacts/${contact._id}`}
      className="pl-4 flex justify-between items-center hover:text-sky-600 dark:hover:text-sky-400"
    >
      <span>
        {contact.preferredName ?? contact.firstName}&nbsp;{contact.lastName}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {lastPostActivity(contact._posts.all)?.toLocaleDateString() ??
          "No activity"}
      </span>
    </Link>
  );
}

export function Family({ family }: { family: Family }) {
  return (
    <div className="p-4 bg-white dark:bg-zinc-700 rounded-lg shadow-sm transition-shadow text-zinc-800 dark:text-zinc-100">
      <h2 className="text-lg font-semibold">{family.familyName} Family</h2>
      {family.parents.map((contact) => (
        <FamilyContact key={contact._id} contact={contact} />
      ))}
      {family.children.length > 0 && (
        <>
          <h3 className="pl-2 text-md font-semibold mt-4">Children</h3>
          {family.children.map((contact) => (
            <FamilyContact key={contact._id} contact={contact} />
          ))}
        </>
      )}
    </div>
  );
}
