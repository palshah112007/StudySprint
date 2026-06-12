const barHeights = [45, 70, 55, 85, 40, 90, 65];

export function ChartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton h-4 w-24 rounded-md" />
        <div className="skeleton h-4 w-16 ml-auto rounded-md" />
      </div>

      {/* Chart area with Y-axis labels */}
      <div className="flex items-end gap-3 h-52 pr-2">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full pb-1 pr-1">
          {[100, 75, 50, 25, 0].map((val) => (
            <div key={val} className="skeleton h-2 w-6 rounded" />
          ))}
        </div>

        {/* Bars */}
        {barHeights.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div
              className="w-full skeleton rounded-lg"
              style={{ height: `${height}%` }}
            />
            <div className="skeleton h-2 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton h-4 w-28 rounded-md" />
        <div className="skeleton h-4 w-20 ml-auto rounded-md" />
      </div>

      {/* Weekday labels */}
      <div className="flex gap-1 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <div key={i} className="flex-1 skeleton h-2 w-6 rounded" />
        ))}
      </div>

      {/* Heatmap grid — multiple rows of varying opacity */}
      {Array.from({ length: 7 }).map((_, row) => (
        <div key={row} className="flex gap-1">
          {Array.from({ length: 12 }).map((_, col) => (
            <div
              key={col}
              className="flex-1 skeleton rounded-sm"
              style={{
                aspectRatio: "1",
                opacity: 0.2 + ((row * 12 + col) % 5) * 0.15,
              }}
            />
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-2 pt-2">
        <div className="skeleton h-2 w-12 rounded" />
        <div className="flex gap-1">
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((opacity, i) => (
            <div
              key={i}
              className="skeleton w-3 h-3 rounded-sm"
              style={{ opacity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
