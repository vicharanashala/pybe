import React, { useState } from 'react';

/**
 * PlaceholderImage Component
 * Attempts to load real image from src (e.g. "/assets/image-1.png").
 * If the image file exists in public/assets/, it renders the real image cleanly.
 * If the image fails to load or is missing, it falls back to the styled placeholder box.
 */
export default function PlaceholderImage({ src, className = "" }) {
  const [imageError, setImageError] = useState(false);
  const filename = src ? src.split('/').pop() : 'image-placeholder';

  // If src is provided and hasn't errored out, attempt rendering real <img>
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={filename}
        onError={() => setImageError(true)}
        className={`w-full max-h-[420px] object-contain rounded-2xl shadow-2xl border border-slate-800/80 bg-slate-900/60 ${className}`}
      />
    );
  }

  // Fallback to styled placeholder container when image file does not exist yet
  return (
    <div
      className={`w-full h-64 sm:h-80 md:h-96 bg-slate-800 border border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500 text-sm rounded-md shadow-inner transition-all ${className}`}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        <svg className="w-8 h-8 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="font-mono text-slate-300 font-medium px-3 py-1 bg-slate-900/60 rounded-md border border-slate-700/50">
        {filename}
      </span>
      <span className="text-xs text-slate-500 mt-2 font-sans">
        Image Placeholder ({src})
      </span>
    </div>
  );
}
