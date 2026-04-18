'use client';

import { ServiceCard, type ServiceData } from './ServiceCard';

/* ------------------------------------------------------------------ */
/*  Inline icons                                                       */
/* ------------------------------------------------------------------ */
function InboxIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Service data                                                       */
/* ------------------------------------------------------------------ */
const services: ServiceData[] = [
  {
    id: 'lead-response',
    title: 'Lead Response & Automation',
    description: 'Capture, qualify, score, and route leads the moment they come in. AI-powered follow-up sequences and smart intake forms that never let a prospect slip through the cracks.',
    bullets: ['Instant lead capture & routing', 'AI-drafted follow-up emails', 'Smart scoring & prioritization', 'CRM integration'],
    imageSrc: '/preview-lead-response.png',
    imageAlt: 'Lead response and automation dashboard preview',
    modalTitle: 'Lead Response & Automation Example',
    viewLabel: 'View Example',
    icon: <InboxIcon />,
  },
  {
    id: 'workflow-operations',
    title: 'Workflow & Operations',
    description: 'Replace spreadsheets and manual tracking with custom workflow systems built around how your team actually works. Tasks, approvals, status boards, and automated handoffs.',
    bullets: ['Custom task management', 'Automated approval chains', 'Real-time status boards', 'Team notification flows'],
    imageSrc: '/preview-workflow-operations.png',
    imageAlt: 'Workflow and operations dashboard preview',
    modalTitle: 'Workflow & Operations Example',
    viewLabel: 'View Example',
    icon: <WorkflowIcon />,
  },
  {
    id: 'scheduling-intake',
    title: 'Scheduling & Intake',
    description: 'Client-facing booking pages, custom intake forms, automated reminders, and calendar management. All branded to your business, all connected to your systems.',
    bullets: ['Branded booking pages', 'Custom intake forms', 'Automated reminders & confirmations', 'Calendar sync'],
    imageSrc: '/preview-scheduling-intake.png',
    imageAlt: 'Scheduling and intake dashboard preview',
    modalTitle: 'Scheduling & Intake Example',
    viewLabel: 'View Example',
    icon: <CalendarIcon />,
  },
  {
    id: 'dashboards-analytics',
    title: 'Dashboards, Reporting & Analytics',
    description: 'Real-time KPIs, operational dashboards, analytics, and reporting platforms that give owners and managers actual visibility into what matters — trends, performance, and where to focus next.',
    bullets: ['Real-time KPI tracking & analytics', 'Trend analysis & forecasting', 'Custom report builders', 'Team performance & revenue views'],
    imageSrc: '/preview-dashboards-analytics.png',
    imageAlt: 'Dashboards reporting and analytics preview',
    modalTitle: 'Dashboards, Reporting & Analytics Example',
    viewLabel: 'View Example',
    icon: <DashboardIcon />,
  },
  {
    id: 'ai-integration',
    title: 'AI Integration & Consulting',
    description: 'Strategic AI integration that actually makes sense for your business. Not chatbot gimmicks -- real AI that drafts proposals, extracts data, routes work, and saves hours.',
    bullets: ['Document & data extraction', 'AI-drafted communications', 'Intelligent routing & triage', 'Workflow recommendations'],
    imageSrc: '/preview-ai-integration.png',
    imageAlt: 'AI integration and consulting dashboard preview',
    modalTitle: 'AI Integration & Consulting Example',
    viewLabel: 'View Example',
    icon: <BrainIcon />,
  },
];

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */
export function WhatWeBuildSection() {
  return (
    <section id="solutions" className="bg-bad-card/30 border-y border-bad-border">
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            What We Build
          </h2>
          <p className="text-lg text-bad-gray">
            From lead capture to AI integration, we build complete systems that replace manual work and disconnected tools.
          </p>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              reversed={i % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
