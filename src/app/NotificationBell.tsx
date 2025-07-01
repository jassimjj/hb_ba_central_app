"use client";
import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NotificationBell({ userId }: { userId: string }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/alerts?userId=${userId}`)
      .then(res => res.json())
      .then(res => setAlerts(res.alerts));
  }, [userId, open]);

  const unread = alerts.filter(a => !a.read).length;

  const handleMarkRead = async (id: string) => {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAlerts(alerts => alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!bellRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative">
      <button ref={bellRef} onClick={() => setOpen(o => !o)} className="relative focus:outline-none">
        <span className="material-symbols-outlined align-middle text-2xl">notifications</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white text-black rounded shadow-lg z-50 border border-pink-200">
          <div className="p-2 font-semibold text-pink-700 border-b">Notifications</div>
          <ul className="max-h-64 overflow-y-auto">
            {alerts.length === 0 && <li className="p-4 text-center text-gray-500">No notifications</li>}
            {alerts.map(alert => (
              <li key={alert.id} className={`p-3 border-b last:border-b-0 ${alert.read ? "bg-gray-50" : "bg-pink-50"}`}>
                <div className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  {!alert.read && (
                    <button onClick={() => handleMarkRead(alert.id)} className="ml-2 text-xs text-pink-600 underline">Mark as read</button>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
