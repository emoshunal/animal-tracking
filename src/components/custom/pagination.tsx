// components/ui/data-pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-4">
      <p className="text-xs font-medium text-slate-500">
        Page <span className="text-slate-900">{currentPage}</span> of{" "}
        {totalPages || 1}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 border-slate-200 p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 border-slate-200 p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
