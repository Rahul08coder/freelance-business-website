import { useEffect, useRef } from 'react'
import Button from '../ui/Button.jsx'

// Browser ka apna <dialog> use kiya hai. Isme ye sab free milta hai:
// peeche ka page click nahi hota, Tab dialog ke andar hi ghoomta hai, aur Esc se band hota hai.
// Khulte hi focus "Cancel" par aata hai (galti se Delete na dab jaye).
function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
  error = '',
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        // Esc dabane par: dialog khud band na ho, hum state se band karenge
        event.preventDefault()
        if (!loading) onCancel()
      }}
      className="m-auto w-full max-w-md rounded-xl border border-line bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        <div className="mt-3 text-sm text-muted">{children}</div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog