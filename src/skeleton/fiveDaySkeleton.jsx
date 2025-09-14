const FiveDaySkeleton = () => {
    return (
      <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-6">
        {Array(5)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-2xl shadow-md h-32 w-full flex flex-col items-center justify-center p-4"
            >
              {/* Day Title */}
              <div className="h-4 w-20 bg-white/40 rounded mb-4"></div>
  
              {/* Weather Icon */}
              <div className="h-10 w-10 bg-white/50 rounded-full mb-4"></div>
  
              {/* Temp Text */}
              <div className="h-4 w-16 bg-white/30 rounded"></div>
            </div>
          ))}
      </div>
    );
  };
  
  export default FiveDaySkeleton;
  