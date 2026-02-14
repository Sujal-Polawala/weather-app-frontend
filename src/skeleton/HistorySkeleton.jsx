const HistorySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {Array(6)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="skeleton-shimmer h-12 w-12 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
              <div className="skeleton-shimmer h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistorySkeleton;
