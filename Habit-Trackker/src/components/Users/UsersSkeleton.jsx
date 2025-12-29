export default function UsersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-zinc-900 animate-pulse border border-zinc-800"
        />
      ))}
    </div>
  );
}
