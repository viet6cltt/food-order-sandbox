import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

type SearchButtonProps = {
  isMobileIconOnly?: boolean
}

export default function SearchButton({ isMobileIconOnly = false }: SearchButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={isMobileIconOnly ? '' : 'w-full group'}> {/* Thêm div bọc để quản lý độ rộng */}
      {isMobileIconOnly ? (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-50/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Search (Cmd/Ctrl + K)"
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" aria-hidden="true" />
          <span className="flex-1 text-left text-gray-400 opacity-80">
            Tìm kiếm nhà hàng, món ăn...
          </span>
          {/* Shortcut hint trông chuyên nghiệp hơn */}
          <div className="hidden lg:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">K</kbd>
          </div>
        </button>
      )}

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </div>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    inputRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
      // Thêm shortcut Ctrl+K để mở search (nếu muốn)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Logic mở đã nằm ở component cha, đây là handler cho modal
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    onClose()
    navigate(`/restaurants?search=${encodeURIComponent(trimmedQuery)}`)
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all border border-gray-100">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500"
                aria-hidden="true"
              />
              <input
                id="global-search"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-none focus:ring-0 transition-colors placeholder:text-gray-400"
                placeholder="Bạn muốn ăn gì hôm nay?"
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Search Result Preview / Quick Tips */}
          <div className="px-4 py-3 bg-gray-50 -mx-4 -mb-4 border-t border-gray-100">
             <div className="flex justify-between items-center text-xs text-gray-400">
                <p>
                    {query.trim() ? (
                        <span>Nhấn <span className="font-bold text-gray-600">Enter</span> để tìm kiếm</span>
                    ) : (
                        <span>Nhập từ khóa để bắt đầu tìm kiếm...</span>
                    )}
                </p>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded shadow-sm">Esc</kbd> Đóng
                    </span>
                </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  )
}