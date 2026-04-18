'use client';

import { useState } from 'react';
import { PreviewModal } from './PreviewModal';

interface ExpandablePreviewImageProps {
  imageSrc: string;
  imageAlt: string;
  modalTitle: string;
  viewLabel?: string;
}

export function ExpandablePreviewImage({
  imageSrc,
  imageAlt,
  modalTitle,
  viewLabel = 'View Example',
}: ExpandablePreviewImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${viewLabel} - ${modalTitle}`}
        className="group/preview relative w-full rounded-2xl overflow-hidden border border-bad-border hover:border-bad-blue/40 bg-bad-card cursor-pointer transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bad-bg hover:shadow-[0_0_80px_rgba(37,99,235,0.15),0_20px_60px_rgba(0,0,0,0.4)]"
        style={{ boxShadow: '0 0 60px rgba(37, 99, 235, 0.06)' }}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* Image with hover zoom */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto block transition-all duration-500 ease-out group-hover/preview:scale-[1.08] group-hover/preview:brightness-110 group-hover/preview:contrast-[1.05]"
          />
        </div>

        {/* Hover overlay with view label */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center pb-5 pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
            </svg>
            {viewLabel}
          </span>
        </div>
      </div>

      <PreviewModal
        open={open}
        onClose={() => setOpen(false)}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        title={modalTitle}
      />
    </>
  );
}
