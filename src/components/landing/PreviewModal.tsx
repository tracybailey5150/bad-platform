'use client';

import { useEffect, useRef, useCallback } from 'react';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title: string;
}

export function PreviewModal({ open, onClose, imageSrc, imageAlt, title }: PreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Focus close button after open transition
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = '';
      if (triggerRef.current && triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-modal-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center animate-modal-content-in">
        {/* Header */}
        <div className="relative w-full flex items-center justify-between mb-4 z-10">
          <h3 className="text-lg font-semibold text-white/90 pl-1">{title}</h3>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close preview"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full overflow-auto rounded-xl border border-white/10 shadow-2xl">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto block"
          />
        </div>
      </div>
    </div>
  );
}
