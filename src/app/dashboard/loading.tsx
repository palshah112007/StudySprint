export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-surface-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Gradient orbs for visual polish */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="skeleton h-8 w-64 rounded-lg" />
              <div className="skeleton h-6 w-28 rounded-full" />
            </div>
            <div className="skeleton h-4 w-72 rounded-md" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* XP & Level Card */}
              <div className="rounded-2xl overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="skeleton h-5 w-28 rounded-md" />
                    <div className="skeleton h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="skeleton w-16 h-16 rounded-2xl" />
                    <div className="space-y-2">
                      <div className="skeleton h-7 w-32 rounded-md" />
                      <div className="skeleton h-4 w-44 rounded-md" />
                    </div>
                  </div>
                  <div className="skeleton h-3 w-full rounded-full" />
                  {/* Problems Chart placeholder */}
                  <div className="pt-4 border-t border-surface-800/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="skeleton h-4 w-4 rounded" />
                      <div className="skeleton h-4 w-44 rounded-md" />
                      <div className="skeleton h-6 w-16 rounded-md ml-auto" />
                    </div>
                    <div className="flex items-end gap-3 h-32">
                      {[55, 40, 70, 30, 85, 50, 65, 45, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 skeleton rounded-t-md"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="skeleton h-5 w-32 rounded-md" />
                  <div className="skeleton h-4 w-28 rounded-md" />
                </div>
                <div className="flex items-end justify-between gap-3 h-40">
                  {[55, 70, 45, 85, 60, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full skeleton rounded-lg"
                        style={{ height: `${h}%` }}
                      />
                      <div className="skeleton h-3 w-6 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Progress */}
              <div className="rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="skeleton h-5 w-32 rounded-md" />
                  <div className="skeleton h-6 w-16 rounded-md" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="skeleton w-2 h-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="skeleton h-4 w-24 rounded-md" />
                        <div className="skeleton h-3 w-8 rounded-md" />
                      </div>
                      <div className="skeleton h-1.5 w-full rounded-full" />
                    </div>
                    <div className="skeleton h-4 w-8 rounded-md" />
                  </div>
                ))}
              </div>

              {/* Heatmap */}
              <div className="rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="skeleton h-5 w-40 rounded-md" />
                  <div className="skeleton h-5 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton rounded-sm"
                      style={{
                        aspectRatio: "1",
                        opacity: 0.2 + (i % 5) * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Focus Score */}
              <div className="rounded-2xl p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 skeleton rounded-full" />
                <div className="skeleton h-4 w-24 mx-auto rounded-md" />
              </div>

              {/* Quote */}
              <div className="rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="skeleton w-5 h-5 rounded shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-full rounded-md" />
                    <div className="skeleton h-4 w-3/4 rounded-md" />
                    <div className="skeleton h-3 w-20 rounded-md mt-2" />
                  </div>
                </div>
              </div>

              {/* Deadlines */}
              <div className="rounded-2xl p-6 space-y-4">
                <div className="skeleton h-5 w-24 rounded-md mb-4" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="skeleton w-2 h-2 rounded-full mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="skeleton h-4 w-full rounded-md" />
                      <div className="skeleton h-3 w-32 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recommendation */}
              <div className="rounded-2xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="skeleton h-4 w-28 rounded-md" />
                    <div className="skeleton h-3 w-36 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-4 w-5/6 rounded-md" />
                </div>
                <div className="skeleton h-9 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
