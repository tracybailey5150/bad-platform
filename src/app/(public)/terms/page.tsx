import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BAD — Business Automation & Development',
  description: 'Terms of service for BAD (Business Automation & Development) and badsaas.app.',
};

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-bad-gray mb-12">Last updated: April 10, 2026</p>

      <div className="space-y-8 text-sm text-bad-gray leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing or using badsaas.app and any services provided by BAD -- Business Automation
            &amp; Development (&quot;BAD,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of
            Service. If you do not agree to these terms, do not use our website or services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">2. Services</h2>
          <p>
            BAD provides custom business automation software development, AI integration consulting,
            and related technology services. The specific scope, deliverables, timeline, and pricing
            for each engagement will be defined in a separate project agreement or statement of work.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">3. User Accounts</h2>
          <p>
            If you create an account on our platform, you are responsible for maintaining the
            confidentiality of your account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">4. Intellectual Property</h2>
          <p className="mb-3">
            Unless otherwise specified in a project agreement:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Custom software and platforms built for clients become the property of the client upon full payment.</li>
            <li>BAD retains the right to use general methodologies, techniques, and non-proprietary code in future projects.</li>
            <li>The BAD brand, logo, website content, and marketing materials remain the property of BAD.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">5. Payment Terms</h2>
          <p>
            Payment terms are defined in individual project agreements. Unless otherwise specified,
            invoices are due within 15 days of receipt. Late payments may be subject to a 1.5% monthly
            interest charge. BAD reserves the right to suspend services for overdue accounts.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BAD shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or
            revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or
            other intangible losses resulting from your use of our services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">7. Confidentiality</h2>
          <p>
            Both parties agree to maintain the confidentiality of any proprietary information shared
            during the course of a consulting or development engagement. This includes business
            processes, technical specifications, and any other information not publicly available.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">8. Termination</h2>
          <p>
            Either party may terminate a service engagement with 30 days written notice. Upon
            termination, the client will be responsible for payment of all work completed up to the
            termination date. BAD will deliver all completed work product upon receipt of final payment.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">9. Disclaimer</h2>
          <p>
            Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
            express or implied. BAD does not guarantee specific business outcomes or results from
            the use of our software or consulting services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of
            Arkansas, without regard to its conflict of law provisions.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this
            page with an updated revision date. Continued use of our services after changes are posted
            constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-bad-light mb-3">12. Contact</h2>
          <p>
            For questions about these Terms of Service, contact us at:
          </p>
          <div className="mt-3">
            <p className="text-bad-light">BAD -- Business Automation &amp; Development</p>
            <p>Email: <a href="mailto:tracy@badsaas.app" className="text-bad-blue hover:text-blue-400 transition-colors">tracy@badsaas.app</a></p>
            <p>Phone: (479) 670-6073</p>
            <p>Website: badsaas.app</p>
          </div>
        </div>
      </div>
    </section>
  );
}
