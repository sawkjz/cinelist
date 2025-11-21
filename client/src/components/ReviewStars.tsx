import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

const sizeMap: Record<NonNullable<ReviewStarsProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export const ReviewStars = ({ value, size = "md", className, showValue = true }: ReviewStarsProps) => {
  const clampedValue = Math.max(0, Math.min(5, Number.isNaN(value) ? 0 : value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const threshold = index + 1 - 0.25;
          const isFilled = clampedValue >= threshold;
          return (
            <Star
              key={`review-star-${index}`}
              className={cn(
                sizeMap[size],
                isFilled ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/50"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="font-semibold text-foreground">
          {clampedValue.toFixed(1)}
          <span className="text-sm text-muted-foreground">/5</span>
        </span>
      )}
    </div>
  );
};

export default ReviewStars;
