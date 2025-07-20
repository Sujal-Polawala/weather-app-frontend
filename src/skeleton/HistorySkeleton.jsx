const HistorySkeleton = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-6">
      {Array(5)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-2xl shadow h-20 sm:h-24 md:h-28 w-full flex items-center px-6"
          >
            <div className="h-10 w-10 bg-white/40 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/40 rounded w-2/3"></div>
              <div className="h-3 bg-white/30 rounded w-1/3"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistorySkeleton;
  