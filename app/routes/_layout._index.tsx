export function meta() {
  return [
    {
      title: "Deacon Notes",
    },
  ];
}

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <div className="text-center text-zinc-800 dark:text-zinc-200">
        <h1 className="text-4xl mb-4">Welcome to Deacon Notes</h1>
        <p className="text-lg">Manage your notes efficiently and securely.</p>
      </div>
    </div>
  );
}
