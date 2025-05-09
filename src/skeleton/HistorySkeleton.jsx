const HistorySkeleton = () => {
    return (
      <div className="animate-pulse space-y-2 mt-6 w-full flex flex-wrap gap-2 justify-center">
        {Array(5)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="bg-white/20 h-8 w-24 rounded-lg"
            ></div>
          ))}
      </div>
    );
  };
  
  export default HistorySkeleton;
  