import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";
import { cn } from "../utils/utils";
import { ErrorMessageProps } from "../global.d";

const ErrorMessage = ({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 bg-red-50 border border-red-100 rounded-lg text-center",
        className
      )}
    >
      <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="text-lg font-semibold text-red-700 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
