import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("w-full rounded-xl border border-border bg-white/10 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2", className)} {...props} />
));
Textarea.displayName = "Textarea";
