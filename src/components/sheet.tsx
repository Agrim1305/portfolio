"use client";

import { useEffect, useRef } from "react";
import { setPageScrollLocked } from "@/lib/scroll-lock";

/* A modal sheet built on the native <dialog>. showModal() supplies the focus
   trap, Escape to close, an inert page behind, and focus return on close, so
   none of that is hand-rolled. Clicking the backdrop closes it too. Callers
   size, place and colour it with `className`. */
export function Sheet({
  open,
  onClose,
  label,
  labelledBy,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    setPageScrollLocked(true);
    return () => setPageScrollLocked(false);
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // Lets a wheel over the sheet scroll the sheet, not the page behind.
      data-lenis-prevent
      className={`sheet m-0 max-h-none max-w-none p-0 text-ink shadow-[0_60px_120px_rgb(0_0_0/0.6)] ${className}`}
    >
      {children}
    </dialog>
  );
}
