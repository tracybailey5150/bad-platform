import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions | BAD — Business Automation & Development',
  description:
    'Custom lead automation, workflow systems, scheduling, dashboards, and AI integration. Purpose-built solutions for businesses that demand better.',
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
