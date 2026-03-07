import Link from "next/link";
import {
  getAllCertifications,
  getTotalQuestionCount,
  getTotalFreeQuestionCount,
  getTopicsForCertification,
} from "@/lib/data";
import CertificationCard from "@/components/CertificationCard";

export default function Home() {
  const certifications = getAllCertifications();
  
  const readyCerts = certifications.filter(c => c.isReady);
  const comingSoonCerts = certifications.filter(c => !c.isReady);
  
  const totalQuestions = readyCerts.reduce((sum, cert) => sum + getTotalQuestionCount(cert.slug), 0);
  const totalFreeQuestions = readyCerts.reduce((sum, cert) => sum + getTotalFreeQuestionCount(cert.slug), 0);
  const activeCertifications = readyCerts.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Stripe style gradient mesh */}
      <section className="relative overflow-hidden gradient-mesh dark:gradient-mesh-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
              </span>
              <span>{activeCertifications} certifications ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)]">
              Pass your{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--gradient-mid)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                ServiceNow
              </span>{" "}
              exam
            </h1>
            
            <p className="mt-8 text-xl sm:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {totalQuestions.toLocaleString()}+ practice questions derived from official Now Learning content. No brain dumps. No guessing.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/csa/practice-questions" className="btn-primary text-lg px-8 py-4">
                Start Free Practice
              </Link>
              <Link href="#certifications" className="btn-secondary text-lg px-8 py-4">
                View All Certifications
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Updated for Xanadu</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{totalFreeQuestions}+ free questions</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>$9 lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="stat-number">{totalQuestions.toLocaleString()}+</div>
              <div className="mt-2 text-[var(--text-secondary)] font-medium">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{activeCertifications}</div>
              <div className="mt-2 text-[var(--text-secondary)] font-medium">Certifications</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{totalFreeQuestions}+</div>
              <div className="mt-2 text-[var(--text-secondary)] font-medium">Free Questions</div>
            </div>
            <div className="text-center">
              <div className="stat-number">$9</div>
              <div className="mt-2 text-[var(--text-secondary)] font-medium">Lifetime Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SNReady Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Stop wasting money on stale Udemy courses
            </h2>
            <p className="mt-6 text-lg text-[var(--text-secondary)]">
              Generic exam dumps become outdated the moment ServiceNow releases a new version. 
              SNReady questions are generated from official Now Learning content — always current, always accurate.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="stripe-card p-8">
              <div className="feature-icon">🎯</div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                From Real Course Content
              </h3>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                Every question is derived from official ServiceNow training materials — the same content tested on the actual exam. No guessing, no outdated braindumps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="stripe-card p-8">
              <div className="feature-icon">📚</div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                Learn Why You&apos;re Wrong
              </h3>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                Detailed explanations for every answer — correct and incorrect. Each explanation links back to the source material so you actually learn, not just memorize.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="stripe-card p-8">
              <div className="feature-icon">⏱️</div>
              <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                Realistic Mock Exams
              </h3>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                Timed mock exams that mirror the real ServiceNow certification format. Track your progress and identify weak areas before exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section id="certifications" className="py-24 bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Choose your certification
            </h2>
            <p className="mt-6 text-lg text-[var(--text-secondary)]">
              {activeCertifications} certifications ready with {totalQuestions.toLocaleString()}+ practice questions
            </p>
          </div>

          {/* Ready Now */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {readyCerts.map((cert) => (
              <CertificationCard 
                key={cert.slug} 
                certification={{
                  ...cert,
                  isReady: true,
                  topicCount: getTopicsForCertification(cert.slug).length,
                  totalQuestions: getTotalQuestionCount(cert.slug),
                }} 
              />
            ))}
          </div>

          {/* Coming Soon */}
          {comingSoonCerts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                Coming Soon
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {comingSoonCerts.map((cert) => (
                  <CertificationCard 
                    key={cert.slug} 
                    certification={{
                      ...cert,
                      isReady: false,
                      topicCount: 0,
                      totalQuestions: 0,
                    }} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg text-[var(--text-secondary)]">
              Try free questions first. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Single Certification */}
            <div className="stripe-card p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Single Certification
              </h3>
              <div className="mt-6">
                <span className="text-5xl font-bold text-[var(--text-primary)]">$9</span>
                <span className="text-[var(--text-muted)] ml-2">/ lifetime</span>
              </div>
              <p className="mt-4 text-[var(--text-secondary)]">
                Full access to one certification of your choice
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "All practice questions for one cert",
                  "Timed mock exams",
                  "Detailed explanations",
                  "Lifetime access — never expires",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <svg className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifetime All Access */}
            <div className="stripe-card p-8 relative glow-primary">
              <div className="absolute -top-3 left-6">
                <span className="bg-[var(--primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Lifetime All Access
              </h3>
              <div className="mt-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--gradient-end)] bg-clip-text text-transparent">$49</span>
                <span className="text-[var(--text-muted)] ml-2">/ forever</span>
              </div>
              <p className="mt-4 text-[var(--text-secondary)]">
                Every certification, current and future
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  `All ${activeCertifications} certifications included`,
                  "Timed mock exams for every cert",
                  `${totalQuestions.toLocaleString()}+ practice questions`,
                  "Future certifications included",
                  "Lifetime access — never expires",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <svg className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* CSA Topics */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[var(--primary)] bg-[rgba(99,91,255,0.1)] rounded-lg">
                  CSA
                </span>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  System Administrator
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Incident Management", slug: "incident-management", icon: "🚨" },
                  { name: "Problem Management", slug: "problem-management", icon: "🔍" },
                  { name: "Change Management", slug: "change-management", icon: "🔄" },
                  { name: "User Administration", slug: "user-administration", icon: "👤" },
                  { name: "Reporting", slug: "reporting-dashboards", icon: "📊" },
                  { name: "Service Catalog", slug: "self-service-automation", icon: "🛒" },
                ].map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/csa/practice-questions/${topic.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="font-medium text-[var(--text-primary)]">{topic.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/csa" className="inline-flex items-center gap-1 mt-6 text-[var(--primary)] font-medium hover:gap-2 transition-all">
                View all CSA topics
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* CAD Topics */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[var(--primary)] bg-[rgba(99,91,255,0.1)] rounded-lg">
                  CAD
                </span>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Application Developer
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Scripting & APIs", slug: "scripting-apis", icon: "💻" },
                  { name: "Business Rules", slug: "business-rules", icon: "⚙️" },
                  { name: "Client Scripts", slug: "client-scripts", icon: "🖥️" },
                  { name: "UI Policies", slug: "ui-policies-actions", icon: "🎨" },
                  { name: "Script Includes", slug: "script-includes", icon: "📦" },
                  { name: "REST APIs", slug: "integration-rest", icon: "🔗" },
                ].map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/cad/practice-questions/${topic.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="font-medium text-[var(--text-primary)]">{topic.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/cad" className="inline-flex items-center gap-1 mt-6 text-[var(--primary)] font-medium hover:gap-2 transition-all">
                View all CAD topics
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 gradient-mesh dark:gradient-mesh-dark">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Ready to get certified?
          </h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Start with our free practice questions and see how prepared you are for the real exam.
          </p>
          <div className="mt-10">
            <Link href="/csa/practice-questions" className="btn-primary text-lg px-10 py-4">
              Start Practicing Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
