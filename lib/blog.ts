// Published blog posts: everything in data/blog/posts.ts except posts that were
// merged into a cert hub and now 301 there (lib/hubs.ts, public/_redirects).
import { getAllPosts, getPostBySlug, type BlogPost } from "@/data/blog/posts";
import { REDIRECTED_BLOG_POSTS } from "@/lib/hubs";

export function isPublishedPost(slug: string): boolean {
  return !(slug in REDIRECTED_BLOG_POSTS);
}

/** Published posts, newest first. */
export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => isPublishedPost(post.slug));
}

export function getPublishedPostBySlug(slug: string): BlogPost | undefined {
  return isPublishedPost(slug) ? getPostBySlug(slug) : undefined;
}
