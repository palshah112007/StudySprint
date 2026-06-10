export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-950 px-4 py-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="skeleton h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="skeleton h-96 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
