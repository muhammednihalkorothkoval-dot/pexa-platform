export default function AdminHome() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Internal Admin Panel</h1>

        <a
          href="/internal/admin/applications"
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          View Applications
        </a>
      </div>
    </main>
  );
}