import Button from '../ui/Button.jsx'

// Ek hi page ho toh kuch nahi dikhta
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}

export default Pagination