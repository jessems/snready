import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGlossaryTermBySlug,
  getAllGlossaryTermSlugs,
} from "@/lib/data";
import { generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getCanonicalUrl } from "@/lib/seo";

interface Props {
  params: Promise<{
    term: string;
  }>;
}

export async function generateStaticParams() {
  return getAllGlossaryTermSlugs().map((slug) => ({
    term: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  
  const glossaryTerm = getGlossaryTermBySlug(term);
  
  if (!glossaryTerm) {
    return {
      title: "Term Not Found",
    };
  }

  const title = `${glossaryTerm.name} in ServiceNow - Definition & Exam Guide | SNReady`;
  const description = `Learn about ${glossaryTerm.name} in ServiceNow. Essential concept for ${glossaryTerm.certifications.map(c => c.certName).join(', ')} certifications. Includes definition, context, and related practice questions.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/glossary/${term}`),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(`/glossary/${term}`),
      images: ['/og-default.png'],
    },
    twitter: {
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

// Generate definition based on context
function generateDefinition(termName: string): string {
  const definitions: Record<string, string> = {
    // Common ServiceNow terms
    "application navigator": "The primary navigation interface in ServiceNow that provides hierarchical access to applications, modules, and functions. Located on the left side of the interface, it organizes platform capabilities by application area.",
    "business rules": "Server-side JavaScript code that executes when records are queried, updated, inserted, or deleted. Business rules run automatically based on configured conditions and can modify field values, validate data, or trigger additional processing.",
    "client scripts": "JavaScript code that runs in the user's browser to enhance the user interface and validate data before form submission. Client scripts can control field behavior, validate input, and provide dynamic user interactions.",
    "cmdb": "Configuration Management Database - a centralized repository that stores information about IT infrastructure components (CIs) and their relationships. The CMDB provides visibility into the IT environment for impact analysis and change management.",
    "service catalog": "A self-service portal where users can request IT services, equipment, and other items through a standardized interface. The service catalog streamlines request processes and provides consistent service delivery.",
    "incident management": "The ITIL process for quickly restoring normal service operation when service disruptions occur. Incident management focuses on minimizing the impact to business operations through efficient resolution procedures.",
    "change management": "The ITIL process for controlling and managing all changes to the IT infrastructure in a standardized way. Change management reduces risk by ensuring proper evaluation, approval, and implementation of changes.",
    "problem management": "The ITIL process for identifying and addressing the root causes of incidents to prevent their recurrence. Problem management focuses on permanently resolving underlying issues rather than just symptoms.",
    "knowledge management": "The process of creating, sharing, and maintaining organizational knowledge to improve decision-making and problem resolution. In ServiceNow, this includes knowledge articles and bases for self-service and agent support.",
    "workflow": "Automated business process logic that moves work between users or systems based on defined rules and conditions. Workflows coordinate activities, route approvals, and ensure consistent process execution.",
    "ui policies": "Client-side rules that control field behavior on forms without requiring custom JavaScript. UI policies can make fields mandatory, readonly, or visible based on specified conditions.",
    "acl": "Access Control Lists - security rules that determine what users can read, write, create, or delete on tables and fields. ACLs enforce data security by controlling access based on user roles and conditions.",
    "gliderecord": "ServiceNow's server-side API for database operations. GlideRecord provides methods to query, insert, update, and delete records from tables using JavaScript.",
    "glidedatetime": "ServiceNow's API for handling date and time operations in scripts. GlideDateTime provides methods for date arithmetic, formatting, and timezone conversion.",
    "scripted rest apis": "Custom web service endpoints created in ServiceNow that can be called by external systems. Scripted REST APIs enable integration by providing HTTP-based access to ServiceNow data and functionality.",
    "transform maps": "Data import configurations that define how external data maps to ServiceNow table fields. Transform maps enable data integration by specifying field mappings, transformations, and validation rules.",
    "scheduled jobs": "Automated tasks that run at specified intervals to perform maintenance, data processing, or integration activities. Scheduled jobs execute background scripts on defined schedules.",
    "discovery": "ServiceNow's automated process for identifying and mapping IT infrastructure components and their relationships. Discovery populates the CMDB by scanning networks and systems.",
    "orchestration": "ServiceNow's workflow automation platform that coordinates activities across multiple systems and technologies. Orchestration enables end-to-end process automation through workflow activities.",
    "service mapping": "The process of automatically discovering and visualizing relationships between business services and their supporting IT infrastructure. Service mapping creates accurate service models for impact analysis.",
    "event management": "The process of monitoring, filtering, and responding to events generated by IT infrastructure components. Event management provides operational visibility and automated incident creation."
  };

  const key = termName.toLowerCase();
  return definitions[key] || `A key concept in ServiceNow that appears across multiple certification domains. Understanding ${termName} is essential for ServiceNow platform knowledge and certification success.`;
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  
  const glossaryTerm = getGlossaryTermBySlug(term);
  
  if (!glossaryTerm) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary" },
    { name: glossaryTerm.name, url: `/glossary/${term}` },
  ];

  const definition = generateDefinition(glossaryTerm.name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <span>→</span>
            <Link href="/glossary" className="hover:text-zinc-700">Glossary</Link>
            <span>→</span>
            <span>{glossaryTerm.name}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {glossaryTerm.name}
          </h1>
          <p className="mt-2 text-xl text-emerald-600">
            ServiceNow Exam Concept
          </p>
        </div>

        {/* Definition */}
        <div className="mt-8">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Definition
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {definition}
            </p>
          </div>
        </div>

        {/* Certification Coverage */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Certification Coverage
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This concept appears in the following ServiceNow certifications and exam domains:
          </p>
          
          <div className="mt-4 space-y-4">
            {glossaryTerm.certifications.map((cert) => (
              <div
                key={cert.certSlug}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {cert.certName}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cert.topics.map((topic) => (
                    <Link
                      key={topic.topicSlug}
                      href={`/learn/${topic.topicSlug}`}
                      className="rounded bg-emerald-100 px-2 py-1 text-sm text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                    >
                      {topic.topicName}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex gap-4">
                  <Link
                    href={`/study-guide/${cert.certSlug}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Study Guide
                  </Link>
                  <Link
                    href={`/practice-tests/${cert.certSlug}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Practice Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Questions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Practice Questions
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Test your understanding with practice questions covering {glossaryTerm.name}:
          </p>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {glossaryTerm.certifications.slice(0, 4).map((cert) => (
              cert.topics.slice(0, 2).map((topic) => (
                <Link
                  key={`${cert.certSlug}-${topic.topicSlug}`}
                  href={`/${cert.certSlug}/questions/${topic.topicSlug}`}
                  className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {topic.topicName}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {cert.certName}
                  </p>
                  <span className="mt-2 inline-block text-sm font-medium text-emerald-600">
                    Practice Questions →
                  </span>
                </Link>
              ))
            )).flat()}
          </div>
        </div>

        {/* Back to Glossary */}
        <div className="mt-8 text-center">
          <Link
            href="/glossary"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            ← Back to ServiceNow Glossary
          </Link>
        </div>
      </div>
    </>
  );
}