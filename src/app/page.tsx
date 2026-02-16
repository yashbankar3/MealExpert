import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/app/page-shell";

const cards = [
  ["Recipes", "/recipes", "Build your meal catalog"],
  ["Planner", "/planner", "Plan breakfast, lunch and dinner"],
  ["Grocery", "/grocery", "Track shopping items"],
  ["Pantry", "/pantry", "Monitor low stock"],
  ["Dashboard", "/dashboard", "Weekly insights"],
  ["Settings", "/settings", "Theme, import/export, seed data"]
] as const;

export default function HomePage() {
  return (
    <PageShell title="MealPrep Mini">
      <p className="text-sm text-muted-foreground">Offline-first meal planning PWA with a minimal glass interface.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(([title, href, desc]) => (
          <Link key={href} href={href}>
            <Card className="hover:bg-white/20">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
