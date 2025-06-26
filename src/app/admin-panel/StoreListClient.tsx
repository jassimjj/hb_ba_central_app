"use client";
import { useState } from "react";

type Store = {
  id: string;
  name: string;
  location: string;
};

type StoreListClientProps = {
  stores: Store[];
};

export default function StoreListClient({ stores: initialStores }: StoreListClientProps) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [form, setForm] = useState<{ id?: string; name: string; location: string }>({ name: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { store } = await res.json();
      setStores((prev) => {
        const idx = prev.findIndex((s) => s.id === store.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = store;
          return updated;
        }
        return [...prev, store];
      });
      setForm({ name: "", location: "" });
    }
    setLoading(false);
  };

  const handleEdit = (store: Store) => setForm(store);

  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/stores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setStores((prev) => prev.filter((s) => s.id !== id));
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Store Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <button type="submit" className="bg-pink-600 text-white px-3 py-1 rounded" disabled={loading}>
          {form.id ? "Update" : "Add"}
        </button>
        {form.id && (
          <button type="button" className="px-3 py-1 rounded border" onClick={() => setForm({ name: "", location: "" })}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {stores.map(store => (
          <li key={store.id} className="mb-2 flex items-center flex-wrap">
            <span className="font-bold text-pink-600 mr-2">{store.name}</span>
            <span className="text-xs mr-2">({store.location})</span>
            <button className="ml-2 text-xs text-pink-700 underline" onClick={() => handleEdit(store)} disabled={loading}>Edit</button>
            <button className="ml-2 text-xs text-red-600 underline" onClick={() => handleDelete(store.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
