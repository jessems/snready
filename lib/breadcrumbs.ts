// Breadcrumb utilities for structured data
import { BASE_URL } from "./seo";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Common breadcrumb builders for different page types
 */
export const breadcrumbs = {
  home(): BreadcrumbItem[] {
    return [{ name: "Home", url: "/" }];
  },

  certification(certName: string, certSlug: string): BreadcrumbItem[] {
    return [
      { name: "Home", url: "/" },
      { name: "Certifications", url: "/#certifications" },
      { name: certName, url: `/certifications/${certSlug}` },
    ];
  },

  category(categoryName: string, categorySlug: string): BreadcrumbItem[] {
    return [
      { name: "Home", url: "/" },
      { name: "Certifications", url: "/#certifications" },
      { name: categoryName, url: `/certifications/category/${categorySlug}` },
    ];
  },

  topic(
    certName: string,
    certSlug: string,
    topicName: string,
    topicSlug: string
  ): BreadcrumbItem[] {
    return [
      { name: "Home", url: "/" },
      { name: certName, url: `/certifications/${certSlug}` },
      { name: topicName, url: `/${certSlug}/questions/${topicSlug}` },
    ];
  },

  question(
    certName: string,
    certSlug: string,
    topicName: string,
    topicSlug: string,
    questionNumber: number,
    questionId: string
  ): BreadcrumbItem[] {
    return [
      { name: "Home", url: "/" },
      { name: certName, url: `/certifications/${certSlug}` },
      { name: topicName, url: `/${certSlug}/questions/${topicSlug}` },
      {
        name: `Question ${questionNumber}`,
        url: `/${certSlug}/questions/${topicSlug}/${questionId}`,
      },
    ];
  },

  comparison(
    cert1Name: string,
    cert2Name: string,
    slug: string
  ): BreadcrumbItem[] {
    return [
      { name: "Home", url: "/" },
      { name: "Compare Certifications", url: "/compare" },
      { name: `${cert1Name} vs ${cert2Name}`, url: `/compare/${slug}` },
    ];
  },
};
