export default function ListingsLoading() {
  return (
    <div className="container-padded section-space">
      <div className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
        <div className="h-[560px] animate-pulse rounded-[28px] bg-slate-200" />
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-[28px] bg-slate-200" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="h-96 animate-pulse rounded-[28px] bg-slate-200" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
