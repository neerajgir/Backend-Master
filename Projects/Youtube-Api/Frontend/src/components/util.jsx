import { useEffect, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  const show = (message, err = false) => setToast({ message, err });
  const node = toast ? (
    <div className={toast.err ? "toast err" : "toast"} role="status">
      [{toast.err ? "err" : "ok"}] {toast.message}
    </div>
  ) : null;
  return { show, node };
}

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
