'use client';

import { type ReactNode } from 'react';
import { ExpandablePreviewImage } from './ExpandablePreviewImage';

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  modalTitle: string;
  viewLabel: string;
  icon: ReactNode;
}

interface ServiceCardProps {
  service: ServiceData;
  reversed?: boolean;
}

export function ServiceCard({ service, reversed = false }: ServiceCardProps) {
  return (
    <div
      className={`flex flex-col gap-10 lg:gap-16 items-center ${
        reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      {/* Text side */}
      <div className="flex-1">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-bad-blue/10 text-bad-blue mb-6">
          {service.icon}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-bad-light mb-4">{service.title}</h3>
        <p className="text-bad-gray leading-relaxed mb-6">{service.description}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-bad-light/80">
              <svg className="w-4 h-4 text-bad-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual side */}
      <div className="flex-1 w-full max-w-lg">
        <ExpandablePreviewImage
          imageSrc={service.imageSrc}
          imageAlt={service.imageAlt}
          modalTitle={service.modalTitle}
          viewLabel={service.viewLabel}
        />
      </div>
    </div>
  );
}
