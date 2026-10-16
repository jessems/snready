import { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/courses";
import { breadcrumbs, generateBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "ServiceNow Architecture Courses",
  description:
    "Free long-form ServiceNow courses for architects and implementation consultants: Service Mapping, Financial Management and more, grounded in the official ServiceNow docs.",
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "ServiceNow Architecture Courses | SNReady",
    description:
      "Free long-form ServiceNow courses for architects and implementation consultants.",
    url: "/courses",
  },
};

export default function CoursesPage() {
  const courses = getAllCourses();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs.courses());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                Home
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">Courses</span>
            </nav>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              ServiceNow Architecture Courses
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Long-form, free courses for architects and implementation consultants.
              Each one explains how a ServiceNow capability works, how to design it,
              and where implementations go wrong, with links to the official docs.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                    {course.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {course.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 text-sm font-medium text-emerald-600">
                    Read the course →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
