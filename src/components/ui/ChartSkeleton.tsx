export function ChartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-16 ml-auto" />
      </div>
      <div className="flex items-end gap-2 h-52">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 skeleton rounded-lg"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton h-4 w-32 mb-4" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded-sm"
            style={{
              aspectRatio: "1",
              opacity: 0.3 + (i % 5) * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
