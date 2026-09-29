"use client";

import { useEffect, useRef } from "react";
import { setPageScrollLocked } from "@/lib/scroll-lock";

/* A modal sheet built on the native <dialog>. showModal() supplies the focus
   trap, an inert page behind, and focus return on close, so none of that is
   hand-rolled. Escape and a backdrop click ask the caller to close, so a close
   can animate (or update history) the same way whichever route it takes.
   Callers size, place and colour it with `className`. */
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
      onCancel={(e) => {
        // The browser only lets a page hold Escape back after a user
        // gesture; otherwise the dialog closes itself and onClose follows.
        if (!e.cancelable) return;
        e.preventDefault();
        onClose();
      }}
      // Also fires after the caller closes the sheet itself; `open` is false
      // by then, so it is not reported twice.
      onClose={() => {
        if (open) onClose();
      }}
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
