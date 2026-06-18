import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4 py-6"
      >
        <motion.div
          initial={{ scale: 0.96, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-zinc-900/75 backdrop-blur-md p-6 shadow-2xl border border-white/20 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red dark:bg-brand-red/25 dark:text-brand-red flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red">Action Required</p>
                <h3 className="text-lg font-extrabold text-brand-navy dark:text-white tracking-tight">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isConfirming}
              className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-5 text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {message}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-zinc-800 pt-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isConfirming}
              className="text-xs rounded-xl"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              isLoading={isConfirming}
              className="text-xs rounded-xl px-5"
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
