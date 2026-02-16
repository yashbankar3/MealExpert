"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/app/page-shell";
import { useGrocery } from "@/hooks/use-live-data";
import { groceryRepo } from "@/lib/repositories";

type Filter = "all" | "checked" | "unchecked";

export default function GroceryPage() {
  const items = useGrocery();
  const [filter, setFilter] = useState<Filter>("all");
  const [name, setName] = useState("");

  const filtered = useMemo(() => items.filter((i) => filter === "all" ? true : filter === "checked" ? i.checked : !i.checked), [items, filter]);

  const exportCsv = () => {
    const rows = ["name,quantity,unit,checked,source,category", ...items.map((i) => `${i.name},${i.quantity},${i.unit},${i.checked},${i.source},${i.category}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grocery.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell title="Grocery" action={<div className="flex gap-2"><Button variant="outline" onClick={exportCsv}>Export CSV</Button><Button variant="outline" onClick={async () => { await groceryRepo.clearChecked(); toast.success("Cleared checked"); }}>Clear checked</Button></div>}>
      <Card className="flex gap-2">
        <Input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={async () => { if (!name.trim()) return; await groceryRepo.save({ name, quantity: 1, unit: "item", checked: false, source: "manual" }); setName(""); }}>Add</Button>
      </Card>
      <div className="flex gap-2">
        {(["all","unchecked","checked"] as const).map((f) => <Button key={f} variant={filter===f?"default":"outline"} onClick={() => setFilter(f)}>{f}</Button>)}
      </div>
      {filtered.length === 0 ? <Card>No grocery items.</Card> : <div className="space-y-2">{filtered.map((i) => <Card key={i.id} className="flex items-center gap-2"><input aria-label={`check ${i.name}`} type="checkbox" checked={i.checked} onChange={async (e) => groceryRepo.save({ ...i, checked: e.target.checked, id: i.id, category: i.category })} /><Input value={i.name} onChange={async (e) => groceryRepo.save({ ...i, name: e.target.value, id: i.id, category: i.category })} /><Input type="number" value={i.quantity} onChange={async (e) => groceryRepo.save({ ...i, quantity: Number(e.target.value), id: i.id, category: i.category })} className="w-24"/><p className="text-xs">{i.unit}</p><Button size="sm" variant="destructive" onClick={async () => groceryRepo.remove(i.id)}>Delete</Button></Card>)}</div>}
    </PageShell>
  );
}
