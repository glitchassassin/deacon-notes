export function meta() {
  return [
    {
      title: "Deacon Notes",
    },
  ];
}

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="text-center text-gray-800 dark:text-gray-200">
        <h1 className="text-4xl mb-4">Welcome to Deacon Notes</h1>
        <p className="text-lg">Manage your notes efficiently and securely.</p>
      </div>
    </div>
  );
}
