import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/data/blog/posts";

export const metadata: Metadata = {
  title: "ServiceNow Certification Blog - Tips, Guides & Resources",
  description: "Expert tips, study guides, and resources for ServiceNow certifications. Learn how to pass CSA, CAD, CIS-ITSM, and more with our comprehensive articles.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "ServiceNow Certification Blog | SNReady",
    description: "Expert tips and study guides for ServiceNow certifications",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          ServiceNow Certification Blog
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Study guides, exam tips, and resources to help you pass your ServiceNow certifications.
        </p>
      </div>

      {/* Tags */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.slice(0, 10).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {post.readingTime && (
                    <>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to Start Practicing?</h2>
        <p className="mt-2 text-emerald-100">
          Try our free practice questions and see how prepared you are.
        </p>
        <Link
          href="/certifications"
          className="mt-6 inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          Browse Certifications
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
