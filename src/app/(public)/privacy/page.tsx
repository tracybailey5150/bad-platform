import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BAD — Business Automation & Development',
  description: 'Privacy policy for BAD (Business Automation & Development) and badsaas.app.',
};

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-bad-gray mb-12">Last updated: April 10, 2026</p>

      <div className="space-y-8 text-sm text-bad-gray leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">1. Introduction</h2>
          <p>
            BAD -- Business Automation &amp; Development (&quot;BAD,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website
            badsaas.app and provides custom business automation software and consulting services. This
            Privacy Policy explains how we collect, use, disclose, and protect your information when you
            visit our website or use our services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">2. Information We Collect</h2>
          <p className="mb-3">We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-bad-light">Personal Information:</strong> Name, email address, phone number, company name, and any other information you provide through our contact forms or during consulting engagements.</li>
            <li><strong className="text-bad-light">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, browser type, and referring URLs.</li>
            <li><strong className="text-bad-light">Account Data:</strong> If you create an account on our platform, we collect login credentials and profile information necessary to provide our services.</li>
            <li><strong className="text-bad-light">Business Data:</strong> Information you provide as part of consulting engagements, including workflow documentation, operational data, and system requirements.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To respond to inquiries and contact form submissions</li>
            <li>To provide consulting and software development services</li>
            <li>To send project updates and service communications</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">4. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            information with trusted service providers who assist us in operating our website and
            delivering services (e.g., hosting providers, email services), subject to confidentiality
            agreements.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including
            encryption in transit (TLS/SSL), secure database storage, and access controls. However,
            no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">6. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes
            outlined in this policy, unless a longer retention period is required by law. Contact form
            submissions are retained for the duration of any resulting business relationship.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Request access to your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">8. Cookies</h2>
          <p>
            Our website may use cookies and similar tracking technologies to enhance your browsing
            experience. These are used for session management and analytics purposes only.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or your personal information, contact us at:
          </p>
          <div className="mt-3">
            <p className="text-bad-light">BAD -- Business Automation &amp; Development</p>
            <p>Email: <a href="mailto:hello@badsaas.app" className="text-bad-blue hover:text-blue-400 transition-colors">hello@badsaas.app</a></p>
            <p>Website: badsaas.app</p>
          </div>
        </div>
      </div>
    </section>
  );
}
