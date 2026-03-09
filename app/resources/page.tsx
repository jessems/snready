import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free ServiceNow Resources - PDI, Docs, Training | SNReady",
  description:
    "Curated list of free ServiceNow resources: Personal Developer Instances (PDI), official documentation, Now Learning courses, community forums, and certification study materials.",
  keywords: [
    "free servicenow resources",
    "servicenow pdi",
    "servicenow personal developer instance",
    "servicenow documentation",
    "servicenow community",
    "servicenow training free",
    "servicenow certification resources",
    "now learning free courses",
  ],
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Free ServiceNow Resources - Everything You Need to Learn",
    description:
      "Complete guide to free ServiceNow learning resources including PDI access, official docs, training courses, and community forums.",
  },
};

interface Resource {
  name: string;
  url: string;
  description: string;
  tags: string[];
}

interface ResourceCategory {
  title: string;
  description: string;
  icon: string;
  resources: Resource[];
}

const resourceCategories: ResourceCategory[] = [
  {
    title: "Official Developer Resources",
    description: "Start here — official ServiceNow developer tools and instances",
    icon: "🛠️",
    resources: [
      {
        name: "Personal Developer Instance (PDI)",
        url: "https://developer.servicenow.com/dev.do",
        description:
          "Free ServiceNow instance to practice and build. Essential for certification prep. Requires ServiceNow account.",
        tags: ["Free", "Essential", "Hands-on"],
      },
      {
        name: "ServiceNow Developer Portal",
        url: "https://developer.servicenow.com/",
        description:
          "Official developer hub with tutorials, API references, code samples, and learning paths.",
        tags: ["Free", "Official"],
      },
      {
        name: "ServiceNow Store",
        url: "https://store.servicenow.com/",
        description:
          "Marketplace for ServiceNow apps and integrations. Great for learning what's possible on the platform.",
        tags: ["Free to Browse"],
      },
    ],
  },
  {
    title: "Official Documentation",
    description: "ServiceNow's comprehensive product documentation",
    icon: "📚",
    resources: [
      {
        name: "ServiceNow Docs (Product Documentation)",
        url: "https://docs.servicenow.com/",
        description:
          "Official product documentation for all ServiceNow modules. Updated with each release (currently Xanadu).",
        tags: ["Free", "Official", "Essential"],
      },
      {
        name: "API Reference",
        url: "https://developer.servicenow.com/dev.do#!/reference",
        description:
          "Complete API documentation including REST, GlideRecord, and all server/client-side APIs.",
        tags: ["Free", "Technical"],
      },
      {
        name: "Release Notes",
        url: "https://docs.servicenow.com/bundle/xanadu-release-notes/page/release-notes/family-release-notes.html",
        description:
          "What's new in each ServiceNow release. Critical for delta exams and staying current.",
        tags: ["Free", "Updates"],
      },
    ],
  },
  {
    title: "Official Training",
    description: "ServiceNow's Now Learning platform courses",
    icon: "🎓",
    resources: [
      {
        name: "Now Learning",
        url: "https://nowlearning.servicenow.com/",
        description:
          "ServiceNow's official learning platform. Many free courses, plus paid certification paths.",
        tags: ["Free + Paid", "Official"],
      },
      {
        name: "ServiceNow Basics Badge",
        url: "https://nowlearning.servicenow.com/lxp?id=learning_path&path_id=servicenow_basics",
        description:
          "Free foundational learning path. Great starting point before CSA certification.",
        tags: ["Free", "Beginner"],
      },
      {
        name: "Micro-Certifications",
        url: "https://nowlearning.servicenow.com/lxp?id=search&q=micro-certification",
        description:
          "Free bite-sized certifications for specific skills. Good for resume building.",
        tags: ["Free", "Credentials"],
      },
    ],
  },
  {
    title: "Community & Forums",
    description: "Connect with other ServiceNow professionals",
    icon: "👥",
    resources: [
      {
        name: "ServiceNow Community",
        url: "https://www.servicenow.com/community/",
        description:
          "Official community forums. Ask questions, share knowledge, find answers from experts.",
        tags: ["Free", "Community"],
      },
      {
        name: "r/servicenow (Reddit)",
        url: "https://www.reddit.com/r/servicenow/",
        description:
          "Active Reddit community. Honest discussions about careers, certifications, and technical problems.",
        tags: ["Free", "Community"],
      },
      {
        name: "ServiceNow LinkedIn Groups",
        url: "https://www.linkedin.com/groups/2098907/",
        description:
          "Professional networking and job opportunities in the ServiceNow ecosystem.",
        tags: ["Free", "Networking"],
      },
      {
        name: "Discord - ServiceNow Developers",
        url: "https://discord.gg/servicenow",
        description:
          "Real-time chat with ServiceNow developers. Good for quick questions.",
        tags: ["Free", "Chat"],
      },
    ],
  },
  {
    title: "Certification Exam Prep",
    description: "Resources specifically for ServiceNow certification exams",
    icon: "🎯",
    resources: [
      {
        name: "Certification Exam Blueprints",
        url: "https://nowlearning.servicenow.com/lxp?id=certifications",
        description:
          "Official exam blueprints showing topics, weights, and objectives for each certification.",
        tags: ["Free", "Official", "Essential"],
      },
      {
        name: "SNReady Practice Tests",
        url: "/certifications",
        description:
          "Practice questions derived from official Now Learning content. 19 certifications covered.",
        tags: ["Free Trial", "Practice"],
      },
      {
        name: "ServiceNow Certification FAQ",
        url: "https://nowlearning.servicenow.com/lxp?id=kb_article_view&sys_kb_id=a6f8f5b91b6fe01003cc67a8bd4bcb0a",
        description:
          "Official FAQ about certification process, retakes, vouchers, and delta exams.",
        tags: ["Free", "Official"],
      },
    ],
  },
  {
    title: "YouTube Channels",
    description: "Video tutorials and walkthroughs",
    icon: "📺",
    resources: [
      {
        name: "ServiceNow (Official)",
        url: "https://www.youtube.com/@servicenow",
        description:
          "Official ServiceNow channel. Product demos, Knowledge conference talks, and tutorials.",
        tags: ["Free", "Official"],
      },
      {
        name: "ServiceNow Dev Program",
        url: "https://www.youtube.com/@ServiceNowDevProgram",
        description:
          "Developer-focused tutorials, CreatorCon sessions, and technical deep-dives.",
        tags: ["Free", "Technical"],
      },
      {
        name: "Now Learning YouTube",
        url: "https://www.youtube.com/@NowLearning",
        description:
          "Training-focused content from the Now Learning team.",
        tags: ["Free", "Training"],
      },
    ],
  },
  {
    title: "Blogs & News",
    description: "Stay updated on ServiceNow news and best practices",
    icon: "📰",
    resources: [
      {
        name: "ServiceNow Blog",
        url: "https://www.servicenow.com/blogs.html",
        description:
          "Official blog with product announcements, customer stories, and thought leadership.",
        tags: ["Free", "Official"],
      },
      {
        name: "ServiceNow Community Blogs",
        url: "https://www.servicenow.com/community/blogs/ct-p/blogs",
        description:
          "Community-written blogs with tutorials, tips, and real-world experiences.",
        tags: ["Free", "Community"],
      },
      {
        name: "ServiceNow Events",
        url: "https://www.servicenow.com/events.html",
        description:
          "Knowledge conference, webinars, and virtual events. Many recordings available free.",
        tags: ["Free + Paid"],
      },
    ],
  },
  {
    title: "Tools & Utilities",
    description: "Helpful tools for ServiceNow development",
    icon: "🔧",
    resources: [
      {
        name: "SN Utils (Browser Extension)",
        url: "https://www.arnoudkooi.com/",
        description:
          "Essential browser extension for ServiceNow developers. Node switching, script macros, and more.",
        tags: ["Free", "Extension", "Essential"],
      },
      {
        name: "ServiceNow CLI",
        url: "https://docs.servicenow.com/bundle/xanadu-application-development/page/build/servicenow-cli/concept/servicenow-cli.html",
        description:
          "Command-line interface for app development, source control, and deployments.",
        tags: ["Free", "CLI"],
      },
      {
        name: "VS Code ServiceNow Extension",
        url: "https://marketplace.visualstudio.com/items?itemName=ServiceNow.now-vscode",
        description:
          "Official VS Code extension for ServiceNow development. Syntax highlighting, snippets, and sync.",
        tags: ["Free", "IDE"],
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Free ServiceNow Resources
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to learn ServiceNow — curated links to official
            documentation, free training, developer tools, and community
            resources.
          </p>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-8 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                🚀 New to ServiceNow?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Start with a free Personal Developer Instance (PDI) and the
                ServiceNow Basics badge.
              </p>
            </div>
            <a
              href="https://developer.servicenow.com/dev.do"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Get Your Free PDI →
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Free Interactive Tools
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Personalized tools to guide your certification journey
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Readiness Checker */}
            <Link
              href="/readiness"
              className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6 transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-800 dark:bg-blue-950/20 dark:hover:border-blue-600"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 dark:bg-blue-900/50">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Exam Readiness Checker
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Quick 10-question assessment to gauge your exam readiness. Get domain-by-domain score breakdown.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                Check Now →
              </span>
            </Link>

            {/* Study Plan Generator */}
            <Link
              href="/study-plan"
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 dark:bg-emerald-900/50">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Study Plan Generator
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Create a personalized week-by-week study schedule based on your timeline and availability.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Generate Plan →
              </span>
            </Link>

            {/* Certification Quiz */}
            <Link
              href="/quiz"
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-700"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 dark:bg-purple-900/50">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Which Cert Is Right?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Not sure which certification to pursue? Take a quick quiz to find your ideal path.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400">
                Take Quiz →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-12">
            {resourceCategories.map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {category.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.resources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target={resource.url.startsWith("/") ? undefined : "_blank"}
                      rel={resource.url.startsWith("/") ? undefined : "noopener noreferrer"}
                      className="block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            {resource.name}
                            {!resource.url.startsWith("/") && (
                              <svg
                                className="h-4 w-4 text-zinc-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            )}
                          </h3>
                          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            {resource.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {resource.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                tag === "Essential"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : tag === "Free"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                  : tag === "Official"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Tests CTA */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to Test Your Knowledge?
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Practice with questions derived from official Now Learning content.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/csa/practice-questions"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Try CSA Questions Free
            </Link>
            <Link
              href="/certifications"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Browse All Certifications
            </Link>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Know a great resource we missed?
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Let us know and we&apos;ll add it to the list.
          </p>
          <a
            href="mailto:hello@snready.com?subject=Resource Suggestion for SNReady"
            className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Suggest a resource →
          </a>
        </div>
      </section>
    </div>
  );
}
