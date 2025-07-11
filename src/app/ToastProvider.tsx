"use client";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<{
  show: (msg: string) => void;
}>({
  show: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = (msg: string) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white px-6 py-2 rounded shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
