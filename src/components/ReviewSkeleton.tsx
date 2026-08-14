export function ReviewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-surface-2" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-48 rounded bg-surface-2" />
          <div className="h-3 w-72 rounded bg-surface-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-2" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-40 rounded-xl bg-surface-2" />
        <div className="h-40 rounded-xl bg-surface-2" />
      </div>
    </div>
  )
}
