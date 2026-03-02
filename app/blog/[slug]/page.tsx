import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/data/blog/posts";
import { MarkdownContent } from "@/components/MarkdownContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  // JSON-LD for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SNReady",
      url: "https://snready.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-emerald-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-emerald-600">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="truncate text-zinc-700 dark:text-zinc-300">
              {post.title.slice(0, 40)}...
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {post.description}
          </p>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 border-b border-zinc-200 pb-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span>{post.author}</span>
            <span>•</span>
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
        </header>

        {/* Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-code:text-emerald-600 dark:prose-a:text-emerald-400 dark:prose-code:text-emerald-400">
          <MarkdownContent content={post.content} />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Ready to practice?
          </h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Test your knowledge with questions generated from official ServiceNow content.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/csa/free-questions"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              CSA Practice
            </Link>
            <Link
              href="/cad/free-questions"
              className="inline-flex items-center rounded-lg border border-emerald-600 px-4 py-2 font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              CAD Practice
            </Link>
            <Link
              href="/certifications"
              className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              All Certifications
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Related Articles
            </h2>
            <div className="mt-6 space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10"
                >
                  <h3 className="font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
