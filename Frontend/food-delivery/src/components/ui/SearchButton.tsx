import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex items-center text-sm text-gray-700 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Search</span>
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value ?? ''
    onClose()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-xl bg-white rounded-lg shadow p-6 z-10">
        <label htmlFor="global-search" className="sr-only">Search</label>
        <div className="flex items-center">
          <input
            id="global-search"
            ref={inputRef}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search restaurants, dishes, or cuisines..."
            aria-label="Search"
          />
          <button type="submit" className="ml-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md">Search</button>
          <button type="button" onClick={onClose} aria-label="Close search" className="ml-2 text-gray-500 hover:text-gray-700">✕</button>
        </div>
      </form>
    </div>
  )
}

