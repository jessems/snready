// Blog posts data
// Add new posts here - they'll automatically appear on /blog and in sitemap

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // Markdown content
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: string;
  tags: string[];
  featured?: boolean;
  readingTime?: number; // minutes
}

export const blogPosts: BlogPost[] = [
  // Posts are added via separate PRs
];

// Helper to get all posts sorted by date
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Get featured posts
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
