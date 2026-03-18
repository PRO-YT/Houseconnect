export default function Loading() {
  return (
    <div className="container-padded section-space">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-64 rounded-full bg-slate-200" />
        <div className="h-6 w-96 rounded-full bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="h-96 rounded-[28px] bg-slate-200" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
