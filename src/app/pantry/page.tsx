"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/app/page-shell";
import { usePantry } from "@/hooks/use-live-data";
import { pantryRepo } from "@/lib/repositories";

export default function PantryPage() {
  const items = usePantry();
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [name, setName] = useState("");

  const filtered = useMemo(() => items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())).filter((i) => !lowOnly || i.quantity <= i.lowStockThreshold), [items, search, lowOnly]);

  return (
    <PageShell title="Pantry">
      <Card className="flex gap-2">
        <Input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={async () => { if (!name.trim()) return; await pantryRepo.save({ name, quantity: 1, unit: "item", lowStockThreshold: 1 }); setName(""); toast.success("Pantry item added"); }}>Add</Button>
      </Card>
      <div className="flex gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant={lowOnly ? "default" : "outline"} onClick={() => setLowOnly((v) => !v)}>Low stock only</Button>
      </div>
      {filtered.length === 0 ? <Card>Pantry empty.</Card> : <div className="space-y-2">{filtered.map((i) => <Card key={i.id} className="flex items-center gap-2"><Input value={i.name} onChange={async (e) => pantryRepo.save({ ...i, id: i.id, name: e.target.value })} /><Input className="w-20" type="number" value={i.quantity} onChange={async (e) => pantryRepo.save({ ...i, id: i.id, quantity: Number(e.target.value) })} /><Input className="w-20" type="number" value={i.lowStockThreshold} onChange={async (e) => pantryRepo.save({ ...i, id: i.id, lowStockThreshold: Number(e.target.value) })} /><Button size="sm" variant="destructive" onClick={async () => pantryRepo.remove(i.id)}>Delete</Button></Card>)}</div>}
    </PageShell>
  );
}
