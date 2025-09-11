// import SkeletonCard from "@/components/SkeletonCard";

import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <main>
      <div className="grid grid-cols-1 gap-8">
        {"abcdefghi".split('').map(i => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  )
}