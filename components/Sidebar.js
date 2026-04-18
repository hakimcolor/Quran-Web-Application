'use client';

import { useState } from 'react';

export default function Sidebar({
  fontSize,
  setFontSize,
  darkMode,
  setDarkMode,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-emerald-700 transition"
        aria-label="Open settings"
      >
        ⚙️ Settings
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border p-4 z-50 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-semibold mb-3 text-emerald-600">Settings</h3>

          {/* Font Size */}
          <div className="mb-4">
            <label className="text-sm block mb-1">
              Arabic Font Size:{' '}
              <span className="font-mono font-bold">{fontSize}px</span>
            </label>
            <input
              type="range"
              min={14}
              max={40}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                darkMode ? 'bg-emerald-500' : 'bg-gray-300'
              } relative`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
