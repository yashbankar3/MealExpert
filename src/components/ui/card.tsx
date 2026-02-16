import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 p-4 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-6",
        className
      )}
      {...props}
    />
  );
}
