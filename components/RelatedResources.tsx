import Link from "next/link";
import {
  getCertRelatedBlogPosts,
  getCertRelatedTools,
  type RelatedTool,
} from "@/lib/internal-links";
import { getPostBySlug } from "@/data/blog/posts";

const toolIcons: Record<RelatedTool["icon"], string> = {
  mock: "🎯",
  plan: "📅",
  quiz: "❓",
  paths: "🗺️",
  salary: "💰",
  compare: "⚖️",
  blog: "📝",
};

interface RelatedResourcesProps {
  certSlug: string;
  certName: string;
}

export function RelatedResources({ certSlug, certName }: RelatedResourcesProps) {
  const blogSlugs = getCertRelatedBlogPosts(certSlug);
  const tools = getCertRelatedTools(certSlug);

  const blogPosts = blogSlugs
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="bg-zinc-50 py-16 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {certName} Study Resources
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Everything you need to prepare for the {certName} certification exam
        </p>

        {/* Tools Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
            >
              <span className="mt-0.5 text-xl" role="img" aria-hidden>
                {toolIcons[tool.icon]}
              </span>
              <div>
                <span className="font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                  {tool.title}
                </span>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Related Blog Posts */}
        {blogPosts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Related Articles
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {blogPosts.map((post) => (
                <Link
                  key={post!.slug}
                  href={`/blog/${post!.slug}`}
                  className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-600"
                >
                  <span className="font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                    {post!.title}
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {post!.description}
                  </p>
                  <span className="mt-2 inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
