"use client";
import { useState } from "react";

type Store = { id: string; name: string };
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  stores: Store[];
};

type UserListClientProps = {
  initialUsers: User[];
  stores: Store[];
};

export default function UserListClient({ initialUsers, stores }: UserListClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [form, setForm] = useState<{ id?: string; name: string; email: string; password: string; role: string; storeIds: string[] }>({ name: "", email: "", password: "", role: "BEAUTY_ADVISOR", storeIds: [] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { user } = await res.json();
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.id === user.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = user;
          return updated;
        }
        return [...prev, user];
      });
      setForm({ name: "", email: "", password: "", role: "BEAUTY_ADVISOR", storeIds: [] });
    }
    setLoading(false);
  };

  const handleEdit = (user: User) => setForm({ id: user.id, name: user.name, email: user.email, password: "", role: user.role, storeIds: user.stores.map(s => s.id) });

  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="px-2 py-1 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="px-2 py-1 border rounded"
          required={!form.id}
        />
        <select
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          className="px-2 py-1 border rounded"
        >
          <option value="ADMIN">Admin</option>
          <option value="BEAUTY_ADVISOR">Beauty Advisor</option>
        </select>
        <select
          multiple
          value={form.storeIds}
          onChange={e => setForm(f => ({ ...f, storeIds: Array.from(e.target.selectedOptions, o => o.value) }))}
          className="px-2 py-1 border rounded min-w-[120px]"
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-pink-600 text-white px-3 py-1 rounded" disabled={loading}>
          {form.id ? "Update" : "Add"}
        </button>
        {form.id && (
          <button type="button" className="px-3 py-1 rounded border" onClick={() => setForm({ name: "", email: "", password: "", role: "BEAUTY_ADVISOR", storeIds: [] })}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id} className="mb-2 flex items-center flex-wrap">
            <span className="font-bold text-pink-600 mr-2">{user.name}</span>
            <span className="text-xs mr-2">({user.email})</span>
            <span className="text-xs mr-2">[{user.role}]</span>
            <span className="text-xs mr-2">Stores: {user.stores.map(s => s.name).join(", ")}</span>
            <button className="ml-2 text-xs text-pink-700 underline" onClick={() => handleEdit(user)} disabled={loading}>Edit</button>
            <button className="ml-2 text-xs text-red-600 underline" onClick={() => handleDelete(user.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
