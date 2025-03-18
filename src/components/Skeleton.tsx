import { cn } from "../utils/utils";
import { SkeletonProps } from "../global.d";

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden animate-pulse",
        className
      )}
    >
      <div className="aspect-video bg-gray-200" />

      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />

        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

        <div className="flex justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>

        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
};

export default Skeleton;
