import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SearchButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        aria-label="Search (Cmd/Ctrl + K)"
      >
        <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        <span className="hidden sm:inline text:sm text-gray-400 opacity-70">Tìm kiếm</span>
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
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
    }

    // Prevent body scroll when modal is open
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
    // Navigate to search results or home with query
    // For now, navigate to home and can filter/search there
    navigate(`/?search=${encodeURIComponent(trimmedQuery)}`)
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl z-10 transform transition-all">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="global-search"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400 placeholder:opacity-70"
                placeholder="Tìm kiếm nhà hàng, món ăn hoặc món ăn..."
                aria-label="Tìm kiếm"
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Đóng tìm kiếm"
            >
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Quick tips */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
                Esc
              </kbd>{' '}
              để đóng
            </p>
          </div>
        </form>

        {/* Search suggestions or recent searches can be added here */}
        {query.trim() && (
          <div className="px-4 pb-4">
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Nhấn <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
                  Enter
                </kbd>{' '}
                để tìm kiếm &quot;{query}&quot;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

