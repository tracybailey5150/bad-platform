import Link from 'next/link';

const navLinks = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'How We Work', href: '/#how-we-work' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const footerLinks = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bad-bg text-bad-light flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black border-b border-bad-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-4">
            <img src="/bad-logo.png" alt="BAD" className="h-16" />
            <div className="hidden sm:block border-l border-bad-border pl-4">
              <div className="text-[11px] font-semibold text-bad-light tracking-widest uppercase leading-tight">
                Business Automation &amp; Development
              </div>
              <div className="text-[10px] text-bad-blue tracking-wider">
                AI Integration &middot; Analytics &middot; Consulting
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-bad-gray hover:text-bad-light transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="px-5 py-2 text-sm font-semibold bg-bad-blue hover:bg-bad-blue/90 text-white rounded-lg transition-colors"
          >
            Book a Call
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-black border-t border-bad-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/bad-logo-transparent.png" alt="BAD" className="h-7" />
              <span className="text-xs text-bad-gray">
                &copy; 2026 BAD &mdash; Business Automation &amp; Development
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-bad-gray">
              {footerLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="hover:text-bad-light transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-bad-gray/50 mt-8">www.badsaas.app</p>
        </div>
      </footer>
    </div>
  );
}
