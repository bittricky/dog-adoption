import { cn } from "../utils/utils";
import { SpinnerProps } from "../global.d";

const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-primary-500 border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Spinner;
