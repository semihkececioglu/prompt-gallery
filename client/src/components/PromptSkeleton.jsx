function PromptSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white/60 border border-gray-200 rounded-lg p-3 flex justify-between items-center gap-3 animate-pulse"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Image skeleton */}
            <div className="w-10 h-10 rounded-lg bg-gray-300 flex-shrink-0"></div>

            {/* Text skeleton */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
            <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default PromptSkeleton;
