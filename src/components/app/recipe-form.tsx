"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  tags: z.string().default(""),
  servingsDefault: z.number().positive(),
  ingredients: z.string().default(""),
  steps: z.string().default("")
});

type FormValues = z.infer<typeof formSchema>;

export function RecipeForm({
  initial,
  onSubmit,
  submitLabel = "Save Recipe"
}: {
  initial?: Partial<FormValues>;
  onSubmit: (value: FormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      tags: initial?.tags ?? "",
      servingsDefault: initial?.servingsDefault ?? 2,
      ingredients: initial?.ingredients ?? "",
      steps: initial?.steps ?? ""
    }
  });

  return (
    <form onSubmit={handleSubmit(async (v) => onSubmit(v))} className="space-y-3">
      <Input aria-label="Recipe name" placeholder="Recipe name" {...register("name")} />
      <Textarea aria-label="Description" placeholder="Description" {...register("description")} />
      <Input aria-label="Tags" placeholder="Tags comma separated" {...register("tags")} />
      <Input aria-label="Servings" type="number" step="1" {...register("servingsDefault", { valueAsNumber: true })} />
      <Textarea aria-label="Ingredients" placeholder="Ingredients: one per line e.g. Rice|1|cup" {...register("ingredients")} />
      <Textarea aria-label="Steps" placeholder="Steps: one per line" {...register("steps")} />
      <Button type="submit" disabled={isSubmitting}>{submitLabel}</Button>
    </form>
  );
}
