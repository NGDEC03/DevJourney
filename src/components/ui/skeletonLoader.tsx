import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoader() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Skeleton className="h-64 col-span-2" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

