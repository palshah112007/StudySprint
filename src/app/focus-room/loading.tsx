export default function FocusRoomLoading() {
  return (
    <div className="min-h-screen bg-surface-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-8 w-48 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer area */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="skeleton h-6 w-24 rounded-full mb-6" />
            <div className="skeleton w-80 h-80 rounded-full mb-8" />
            <div className="flex gap-4 mb-8">
              <div className="skeleton w-14 h-14 rounded-full" />
              <div className="skeleton w-20 h-20 rounded-full" />
              <div className="skeleton w-14 h-14 rounded-full" />
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton w-28 h-16 rounded-xl" />
              ))}
            </div>
          </div>
          {/* Side panel */}
          <div className="space-y-6">
            <div className="skeleton h-48 rounded-2xl" />
            <div className="skeleton h-36 rounded-2xl" />
            <div className="skeleton h-52 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
