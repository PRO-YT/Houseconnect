export default function PropertyLoading() {
  return (
    <div className="container-padded section-space">
      <div className="space-y-8">
        <div className="h-[420px] animate-pulse rounded-[28px] bg-slate-200" />
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
          </div>
          <div className="space-y-6">
            <div className="h-96 animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
