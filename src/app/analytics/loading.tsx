export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-surface-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-4 w-64 mb-8" />
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="skeleton h-72 rounded-2xl" />
          <div className="skeleton h-72 rounded-2xl" />
        </div>
        {/* Weekly breakdown */}
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}
