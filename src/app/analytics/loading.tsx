export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-surface-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Gradient orbs for visual polish */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="skeleton w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-8 w-40 rounded-lg" />
              <div className="skeleton h-4 w-52 rounded-md" />
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2">
            <div className="skeleton h-9 w-20 rounded-lg" />
            <div className="skeleton h-9 w-24 rounded-lg" />
            <div className="skeleton h-9 w-20 rounded-lg" />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
              <div className="skeleton h-7 w-16 rounded-md" />
              <div className="skeleton h-3 w-20 rounded-md" />
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="skeleton h-5 w-32 rounded-md" />
              <div className="skeleton h-5 w-12 rounded-full" />
            </div>
            <div className="flex items-end gap-2 h-48">
              {[45, 65, 55, 80, 70, 90, 85, 60, 75, 50, 68, 78].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 skeleton rounded-lg"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            {/* X-axis labels */}
            <div className="flex gap-2 mt-3">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <div key={i} className="flex-1 skeleton h-3 w-6 rounded" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="skeleton h-5 w-36 rounded-md" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton w-3 h-3 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="skeleton h-4 w-28 rounded-md" />
                      <div className="skeleton h-4 w-20 rounded-md" />
                    </div>
                    <div className="skeleton h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="skeleton h-5 w-36 rounded-md" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-full skeleton rounded-lg"
                  style={{ height: `${30 + i * 8}px` }}
                />
                <div className="skeleton h-3 w-6 rounded" />
                <div className="skeleton h-2 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="skeleton h-5 w-28 rounded-md" />
            <div className="skeleton h-6 w-24 rounded-md" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="skeleton w-4 h-4 rounded" />
                  <div className="skeleton h-4 w-20 rounded-md" />
                </div>
                <div className="skeleton h-8 w-24 rounded-md" />
                <div className="skeleton h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
