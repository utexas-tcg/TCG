export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-tcg-gray-100 rounded-lg ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-tcg-blue-100">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-tcg-gray-100">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16 ml-auto" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-tcg-blue-100 overflow-hidden">
      <div className="bg-tcg-gray-50 px-4 py-3 border-b border-tcg-gray-100">
        <Skeleton className="h-4 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  )
}
