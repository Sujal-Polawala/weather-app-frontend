const FiveDaySkeleton = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {Array(5)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4"
            >
              <div className="skeleton-shimmer h-4 w-16 rounded mb-4"></div>
              <div className="skeleton-shimmer h-12 w-12 rounded-xl mx-auto mb-4"></div>
              <div className="skeleton-shimmer h-5 w-20 rounded mx-auto mb-2"></div>
              <div className="skeleton-shimmer h-3 w-24 rounded mx-auto"></div>
              <div className="flex justify-around mt-3 pt-3 border-t border-slate-200">
                <div className="skeleton-shimmer h-3 w-12 rounded"></div>
                <div className="skeleton-shimmer h-3 w-12 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    );
  };
  
  export default FiveDaySkeleton;
  