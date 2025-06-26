"use client";
import { useState } from "react";

type Sku = {
  id: string;
  name: string;
  brand: string;
  chronicOOS: boolean;
};

export default function SkuCrudClient({ skus: initialSkus }: { skus: Sku[] }) {
  const [skus, setSkus] = useState<Sku[]>(initialSkus);
  const [form, setForm] = useState<{ id?: string; name: string; brand: string }>({ name: "", brand: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/skus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { sku } = await res.json();
      setSkus((prev) => {
        const idx = prev.findIndex((s) => s.id === sku.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = sku;
          return updated;
        }
        return [...prev, sku];
      });
      setForm({ name: "", brand: "" });
    }
    setLoading(false);
  };

  const handleEdit = (sku: Sku) => setForm(sku);

  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/skus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSkus((prev) => prev.filter((s) => s.id !== id));
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="SKU Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={form.brand}
          onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <button type="submit" className="bg-pink-600 text-white px-3 py-1 rounded" disabled={loading}>
          {form.id ? "Update" : "Add"}
        </button>
        {form.id && (
          <button type="button" className="px-3 py-1 rounded border" onClick={() => setForm({ name: "", brand: "" })}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {skus.map(sku => (
          <li key={sku.id} className="mb-2 flex items-center flex-wrap">
            <span className="font-bold text-pink-600 mr-2">{sku.name}</span>
            <span className="text-xs mr-2">({sku.brand})</span>
            {sku.chronicOOS && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Chronic OOS</span>
            )}
            <button className="ml-2 text-xs text-pink-700 underline" onClick={() => handleEdit(sku)} disabled={loading}>Edit</button>
            <button className="ml-2 text-xs text-red-600 underline" onClick={() => handleDelete(sku.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
