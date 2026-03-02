import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { competitorComparisons, getCompetitorBySlug, getAllCompetitorSlugs } from "@/data/competitor-comparisons";
import { CheckCircle, XCircle, Star, ArrowRight, Shield, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react";

interface PageProps {
  params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
  return getAllCompetitorSlugs().map((slug) => ({
    competitor: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor: competitorSlug } = await params;
  const competitor = getCompetitorBySlug(competitorSlug);
  
  if (!competitor) {
    return { title: "Not Found" };
  }

  return {
    title: `SNReady vs ${competitor.name} - ServiceNow Practice Tests Comparison 2026`,
    description: `Compare SNReady and ${competitor.name} for ServiceNow certification prep. See features, pricing, question quality, and which platform is right for you.`,
    keywords: [
      ...competitor.seoKeywords,
      "servicenow practice tests",
      "servicenow certification prep",
      `${competitor.name.toLowerCase()} alternative`,
      `${competitor.name.toLowerCase()} review`
    ],
    openGraph: {
      title: `SNReady vs ${competitor.name} - Which is Better?`,
      description: `Detailed comparison of SNReady and ${competitor.name} for ServiceNow certification practice.`,
      type: "website",
    },
  };
}

export default async function CompetitorComparisonPage({ params }: PageProps) {
  const { competitor: competitorSlug } = await params;
  const competitor = getCompetitorBySlug(competitorSlug);

  if (!competitor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/vs" className="hover:text-indigo-600">Compare</Link>
          <span>/</span>
          <span className="text-gray-900">vs {competitor.name}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            SNReady vs {competitor.name}
          </h1>
          <p className="text-lg text-indigo-200 max-w-3xl mx-auto text-center">
            {competitor.description}
          </p>
        </div>
      </section>

      {/* Warning Banner for Brain Dumps */}
      {competitor.slug === "examtopics" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-6xl mx-auto mt-8 mx-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800">Warning: Brain Dump Site</h3>
              <p className="text-red-700 text-sm">
                ExamTopics uses crowd-sourced brain dumps — real exam questions memorized and shared by test-takers. 
                Using brain dumps violates the ServiceNow Certification Agreement and can result in certification revocation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Verdict */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            The Verdict
          </h2>
          <p className="text-green-900">{competitor.verdict}</p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-center font-semibold bg-green-700">SNReady</th>
                <th className="px-6 py-4 text-center font-semibold">{competitor.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {competitor.features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                  <td className="px-6 py-4 text-center bg-green-50">
                    {typeof feature.snready === "boolean" ? (
                      feature.snready ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-green-700 font-medium">{feature.snready}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.competitor === "boolean" ? (
                      feature.competitor ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-600">{feature.competitor}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* SNReady Pricing */}
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-800">SNReady</h3>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">$9<span className="text-lg font-normal text-green-600">/certification</span></div>
            <p className="text-green-700 mb-4">One-time purchase, lifetime access</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>60-130 questions per certification</span>
              </li>
              <li className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>35+ free questions to try first</span>
              </li>
              <li className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Timed mock exams included</span>
              </li>
              <li className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Domain progress tracking</span>
              </li>
            </ul>
          </div>
          
          {/* Competitor Pricing */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{competitor.name}</h3>
            <div className="text-4xl font-bold text-gray-700 mb-2">{competitor.pricing.cost.split(" ")[0]}<span className="text-lg font-normal text-gray-500">/{competitor.pricing.model.toLowerCase().includes("month") ? "month" : "purchase"}</span></div>
            <p className="text-gray-600 mb-4">{competitor.pricing.model}</p>
            <p className="text-gray-500 text-sm">{competitor.pricing.details}</p>
          </div>
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{competitor.name} Pros & Cons</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
              Pros
            </h3>
            <ul className="space-y-3">
              {competitor.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cons */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
              <ThumbsDown className="w-5 h-5" />
              Cons
            </h3>
            <ul className="space-y-3">
              {competitor.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Question Quality */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Quality</h2>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-700 font-medium">{competitor.name} Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= competitor.questionQuality.score
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500">({competitor.questionQuality.score}/5)</span>
          </div>
          <p className="text-gray-600">{competitor.questionQuality.details}</p>
        </div>
      </section>

      {/* Who Should Use */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Should Use What?</h2>
        
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <p className="text-indigo-900 text-lg">{competitor.whoShouldUse}</p>
        </div>
      </section>

      {/* Other Comparisons */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Comparisons</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {competitorComparisons
            .filter((c) => c.slug !== competitor.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/vs/${c.slug}`}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 group-hover:text-indigo-600">
                    vs {c.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 text-white py-12 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Try SNReady Free
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            35+ free questions per certification. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/free-questions"
              className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
            >
              Start Free Practice
            </Link>
            <Link
              href="/pricing"
              className="bg-indigo-700 text-white border border-indigo-500 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `SNReady vs ${competitor.name} - ServiceNow Practice Tests Comparison`,
            "description": competitor.description,
            "author": {
              "@type": "Organization",
              "name": "SNReady"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SNReady",
              "url": "https://snready.com"
            }
          })
        }}
      />
    </div>
  );
}
