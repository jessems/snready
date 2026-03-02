import { Metadata } from "next";
import Link from "next/link";
import { competitorComparisons } from "@/data/competitor-comparisons";
import { CheckCircle, XCircle, Star, ArrowRight, Shield, BookOpen, Timer, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "SNReady vs Competitors - Best ServiceNow Practice Tests Comparison 2026",
  description: "Compare SNReady with ExamTopics, Udemy, SkillCertPro, and Now Learning. Find the best ServiceNow certification practice test platform for your needs.",
  keywords: [
    "servicenow practice tests",
    "examtopics alternative",
    "servicenow certification prep",
    "best servicenow practice tests",
    "servicenow exam prep comparison"
  ],
  openGraph: {
    title: "SNReady vs Competitors - ServiceNow Practice Test Comparison",
    description: "Compare the best ServiceNow certification practice test platforms side by side.",
    type: "website",
  },
};

export default function CompetitorComparisonIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            SNReady vs. The Competition
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto text-center mb-8">
            Choosing the right practice test platform can make or break your certification journey. 
            See how SNReady compares to other popular options.
          </p>
        </div>
      </section>

      {/* Quick Comparison Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Quick Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-indigo-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Platform</th>
                <th className="px-6 py-4 text-center font-semibold">Ethics</th>
                <th className="px-6 py-4 text-center font-semibold">Questions</th>
                <th className="px-6 py-4 text-center font-semibold">Mock Exams</th>
                <th className="px-6 py-4 text-center font-semibold">Domain Tracking</th>
                <th className="px-6 py-4 text-center font-semibold">Price</th>
                <th className="px-6 py-4 text-center font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* SNReady Row - Highlighted */}
              <tr className="bg-green-50 border-l-4 border-green-500">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-700">SNReady</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">You are here</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center font-semibold text-gray-900">1,350+</td>
                <td className="px-6 py-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center text-gray-700">$9/cert</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </td>
              </tr>
              
              {/* Competitor Rows */}
              {competitorComparisons.map((competitor) => (
                <tr key={competitor.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/vs/${competitor.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {competitor.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {competitor.slug === "examtopics" ? (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                    ) : competitor.slug === "skillcertpro" ? (
                      <span className="text-yellow-600">?</span>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {competitor.slug === "examtopics" ? "1,000+" : 
                     competitor.slug === "udemy" ? "Varies" :
                     competitor.slug === "skillcertpro" ? "500-600" : "10-20"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {competitor.slug === "skillcertpro" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {competitor.pricing.cost.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i <= competitor.questionQuality.score 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-200"
                          }`} 
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual Comparison Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Detailed Comparisons
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {competitorComparisons.map((competitor) => (
            <Link 
              key={competitor.slug}
              href={`/vs/${competitor.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    SNReady vs {competitor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{competitor.fullName}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {competitor.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {competitor.seoKeywords.slice(0, 3).map((keyword) => (
                  <span 
                    key={keyword}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why SNReady Section */}
      <section className="bg-indigo-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why People Choose SNReady
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Shield className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">100% Ethical</h3>
              <p className="text-gray-600 text-sm">
                Original questions based on official content. No brain dumps. No risk to your certification.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Learn, Don't Memorize</h3>
              <p className="text-gray-600 text-sm">
                Detailed explanations teach you why answers are correct. Build real knowledge.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Timer className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Real Exam Simulation</h3>
              <p className="text-gray-600 text-sm">
                Timed mock exams match real conditions. Practice under pressure.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Target className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Domain Tracking</h3>
              <p className="text-gray-600 text-sm">
                Know exactly which exam domains need more study. Focus your effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Practicing?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Try SNReady free with 35+ questions per certification. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/practice-questions"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Try Free Questions
          </Link>
          <Link
            href="/pricing"
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is ExamTopics safe to use for ServiceNow certifications?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Using ExamTopics brain dumps violates the ServiceNow certification agreement. ServiceNow actively monitors for brain dump usage and can revoke your certification if detected. SNReady offers original practice questions that are 100% compliant."
                }
              },
              {
                "@type": "Question", 
                "name": "What's the best ServiceNow practice test platform?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The best platform depends on your needs. For ethical, comprehensive practice with domain tracking, SNReady is ideal. For learning concepts through video, Udemy complements practice tests well. Avoid brain dump sites like ExamTopics."
                }
              },
              {
                "@type": "Question",
                "name": "How does SNReady compare to ServiceNow Now Learning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Now Learning is ServiceNow's official training platform and is essential for learning the material. However, it only provides 10-20 practice questions per course. SNReady offers 1,350+ practice questions with full mock exams to complement your Now Learning studies."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
