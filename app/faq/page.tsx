"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search, BookOpen, CreditCard, HelpCircle, Laptop, Award, Clock, CheckCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  keywords?: string[];
}

interface FAQCategory {
  name: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  {
    name: "About SNReady",
    icon: <BookOpen className="w-5 h-5" />,
    faqs: [
      {
        question: "What is SNReady?",
        answer: "SNReady is a practice test platform designed specifically for ServiceNow certification exams. We offer over 1,400 practice questions across 20+ certifications including CSA, CAD, CIS-ITSM, CIS-Discovery, and more. Our questions are crafted to match the style, difficulty, and format of official ServiceNow certification exams.",
        keywords: ["servicenow practice test", "snready"]
      },
      {
        question: "How is SNReady different from other practice test sites?",
        answer: "Unlike generic test platforms, SNReady is built by ServiceNow professionals who understand the exam format. Our questions cover real exam topics with accurate domain distribution matching official blueprints. We offer free questions to try before you buy, timed mock exams that simulate real test conditions, and detailed explanations for every answer.",
        keywords: ["servicenow practice test comparison"]
      },
      {
        question: "Are SNReady questions based on actual exam questions?",
        answer: "No, we do not use actual exam questions (that would violate ServiceNow's policies). Our questions are original content created based on official exam blueprints, ServiceNow documentation, and Now Learning course materials. They're designed to test the same knowledge areas and prepare you for the types of questions you'll encounter.",
        keywords: ["servicenow exam questions", "brain dumps"]
      },
      {
        question: "Which ServiceNow certifications do you cover?",
        answer: "We currently cover 20 certifications: CSA (System Administrator), CAD (Application Developer), CIS-ITSM, CIS-Discovery, CIS-DF (Data Foundations/CMDB), CIS-CSM, CIS-HR, CIS-HAM, CIS-SAM, CIS-PA, CIS-SM (Service Mapping), CIS-EM (Event Management), CIS-VR, CIS-SIR, CIS-FSM, CIS-SP (Service Provider), CIS-SPM, CIS-TPRM, CIS-RC (Risk & Compliance), and CPOA (Platform Owner Advisor).",
        keywords: ["servicenow certifications list"]
      },
      {
        question: "How often are questions updated?",
        answer: "We continuously add new questions and update existing ones when ServiceNow releases new platform versions (like Xanadu, Zurich). We also add delta exam questions when ServiceNow introduces version-specific certification updates. Our goal is to stay current with the latest exam objectives.",
        keywords: ["servicenow exam updates"]
      }
    ]
  },
  {
    name: "Exam Preparation",
    icon: <Award className="w-5 h-5" />,
    faqs: [
      {
        question: "How many practice questions should I complete before taking the real exam?",
        answer: "We recommend completing all available questions for your certification at least twice, aiming for 85%+ accuracy on your final attempts. For the CSA exam (100 questions available), this typically means 2-3 weeks of consistent practice. Use our Readiness Checker to assess if you're truly prepared.",
        keywords: ["servicenow exam preparation", "how many practice questions"]
      },
      {
        question: "What score should I aim for on practice tests?",
        answer: "Aim for consistently scoring 85% or higher on practice tests before scheduling your real exam. The official passing score is typically around 70%, but scoring higher on practice gives you a comfortable margin for exam-day nerves and unexpected question variations.",
        keywords: ["servicenow passing score", "practice test score"]
      },
      {
        question: "How long should I study for a ServiceNow certification?",
        answer: "Study time varies by certification and experience. CSA typically requires 40-60 hours for beginners, 20-30 hours with ServiceNow experience. Implementation certifications (CIS-*) usually need 30-50 hours. Use our Study Plan Generator for a personalized schedule based on your target date and available time.",
        keywords: ["servicenow study time", "how long to study"]
      },
      {
        question: "Should I take the official Now Learning courses before using SNReady?",
        answer: "Yes, we recommend completing the relevant Now Learning courses first. SNReady is designed to reinforce and test knowledge from official training, not replace it. The courses provide foundational understanding while our practice tests identify gaps and build exam confidence.",
        keywords: ["now learning courses", "servicenow training"]
      },
      {
        question: "What's the best study strategy for ServiceNow certifications?",
        answer: "1) Complete the official Now Learning course, 2) Review the exam blueprint to understand domain weights, 3) Practice questions domain by domain, focusing on weak areas, 4) Take full mock exams to build stamina and timing, 5) Review incorrect answers thoroughly, 6) Retake questions you got wrong until mastery.",
        keywords: ["servicenow study strategy", "certification tips"]
      },
      {
        question: "Do you offer timed mock exams?",
        answer: "Yes! Each certification has a Mock Exam mode that simulates real exam conditions — timed sessions, randomized questions, no mid-exam feedback, and a final score with domain breakdown. This helps you build the stamina and time management skills needed for the actual exam.",
        keywords: ["servicenow mock exam", "timed practice test"]
      }
    ]
  },
  {
    name: "Pricing & Access",
    icon: <CreditCard className="w-5 h-5" />,
    faqs: [
      {
        question: "How much does SNReady cost?",
        answer: "Full access to all practice questions for a single certification costs $9 (one-time payment, lifetime access). This includes all current questions plus any future updates for that certification. We also offer free questions for every certification so you can try before you buy.",
        keywords: ["snready price", "servicenow practice test cost"]
      },
      {
        question: "Do you offer a free trial?",
        answer: "Yes! Every certification has 15-35 free practice questions available without signup. Try them to experience the question quality and format before purchasing. No credit card required for free questions.",
        keywords: ["free servicenow practice test", "snready free"]
      },
      {
        question: "Is the access lifetime or subscription-based?",
        answer: "Lifetime access. Pay once for a certification and you keep access forever, including all future question updates for that certification. No recurring fees, no expiration.",
        keywords: ["snready lifetime access"]
      },
      {
        question: "Can I access my questions on mobile?",
        answer: "Yes, SNReady is fully responsive and works on phones, tablets, and desktops. Practice anywhere — during your commute, lunch break, or at home. Your progress syncs across all devices.",
        keywords: ["mobile practice test"]
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express) and popular payment methods through Stripe, including Apple Pay and Google Pay where available.",
        keywords: ["payment methods"]
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 7-day money-back guarantee. If you're not satisfied with the question quality, contact us within 7 days of purchase for a full refund. We're confident you'll find value, which is why we also offer free questions to try first.",
        keywords: ["refund policy"]
      }
    ]
  },
  {
    name: "Using the Platform",
    icon: <Laptop className="w-5 h-5" />,
    faqs: [
      {
        question: "How do I track my progress?",
        answer: "Your dashboard shows completion percentage, average scores by domain, questions answered correctly vs. incorrectly, and areas needing improvement. Use this data to focus your study time on weak domains.",
        keywords: ["track progress", "study dashboard"]
      },
      {
        question: "Can I review incorrect answers?",
        answer: "Absolutely. Every question includes a detailed explanation of the correct answer and why other options are wrong. After completing a practice session, you can review all questions or filter to see only the ones you got wrong.",
        keywords: ["review answers", "explanations"]
      },
      {
        question: "Do questions repeat?",
        answer: "In practice mode, questions may repeat to reinforce learning — research shows spaced repetition improves retention. In Mock Exam mode, questions are randomized from the full pool without repeats within that session.",
        keywords: ["question repetition"]
      },
      {
        question: "Can I practice specific exam domains?",
        answer: "Yes! Each certification is organized by exam domains matching the official blueprint. You can practice all questions or focus on specific domains like 'User Interface & Navigation' or 'Database Administration' depending on the cert.",
        keywords: ["practice by domain"]
      },
      {
        question: "Do I need to create an account?",
        answer: "Free questions don't require an account. To purchase and access premium questions, you'll create an account using your email. This lets us save your progress and provide lifetime access.",
        keywords: ["account required"]
      }
    ]
  },
  {
    name: "About ServiceNow Exams",
    icon: <HelpCircle className="w-5 h-5" />,
    faqs: [
      {
        question: "How much does a ServiceNow certification exam cost?",
        answer: "ServiceNow certification exams typically cost $150-300 USD depending on the certification level. Mainline certifications (CSA, CAD) are usually around $150, while implementation specialist (CIS-*) certifications are $200-250. Prices may vary by region.",
        keywords: ["servicenow exam cost", "certification price"]
      },
      {
        question: "What is the passing score for ServiceNow exams?",
        answer: "Most ServiceNow certification exams require around 70% to pass, though this can vary slightly by certification. The exact passing score is determined by ServiceNow and may be adjusted based on question difficulty.",
        keywords: ["servicenow passing score", "pass mark"]
      },
      {
        question: "How long are ServiceNow certification exams?",
        answer: "Exam duration varies: CSA is 90 minutes with 60 questions, most CIS exams are 90-120 minutes with 55-60 questions. Time is generally adequate if you've prepared properly — most candidates finish with 15-30 minutes to spare.",
        keywords: ["exam duration", "how long is servicenow exam"]
      },
      {
        question: "Can I retake a ServiceNow exam if I fail?",
        answer: "Yes, but there's a waiting period. First retake: 14-day wait. Second retake: 60-day wait. You'll need to pay the full exam fee each time. This is why thorough preparation with practice tests is so important — passing the first time saves money and frustration.",
        keywords: ["servicenow exam retake", "failed exam"]
      },
      {
        question: "Are ServiceNow exams open book?",
        answer: "No, ServiceNow certification exams are closed book. You cannot access documentation, notes, or the internet during the exam. This is why memorization of key concepts and practice with realistic questions is essential.",
        keywords: ["open book exam", "servicenow exam format"]
      },
      {
        question: "What question formats appear on ServiceNow exams?",
        answer: "ServiceNow exams use multiple choice (single answer), multiple response (select 2-3 correct answers), and true/false variations. Some questions present scenarios requiring you to identify the best solution. Our practice questions use all these formats.",
        keywords: ["exam question format", "multiple choice"]
      },
      {
        question: "Do certifications expire?",
        answer: "ServiceNow mainline certifications don't expire but become 'legacy' after 3 major releases. You can maintain current status by passing delta exams (shorter, focused on version changes) or retaking the full exam. We offer delta exam practice questions as well.",
        keywords: ["certification expiration", "delta exam"]
      }
    ]
  }
];

// Generate JSON-LD schema for all FAQs
function generateFAQSchema(categories: FAQCategory[]) {
  const allFaqs = categories.flatMap(cat => cat.faqs);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

function FAQCategory({ category, openQuestions, toggleQuestion }: { 
  category: FAQCategory; 
  openQuestions: Set<string>;
  toggleQuestion: (id: string) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-emerald-600 dark:text-emerald-400">{category.icon}</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {category.faqs.map((faq, index) => {
          const id = `${category.name}-${index}`;
          return (
            <FAQItem
              key={id}
              faq={faq}
              isOpen={openQuestions.has(id)}
              onToggle={() => toggleQuestion(id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter categories based on search
  const filteredCategories = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(cat => cat.faqs.length > 0)
    : faqCategories;

  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqCategories)) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-emerald-100 mb-8">
              Everything you need to know about SNReady and ServiceNow certification prep
            </p>
            
            {/* Search Box */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto px-4 -mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">1,400+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Practice Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">20</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">$9</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Per Certification</div>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No FAQs match your search. Try different keywords.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <FAQCategory
                key={category.name}
                category={category}
                openQuestions={openQuestions}
                toggleQuestion={toggleQuestion}
              />
            ))
          )}

          {/* Still Have Questions */}
          <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@snready.com"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Support
              </a>
              <Link
                href="/certifications"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium border border-gray-200 dark:border-gray-600 transition-colors"
              >
                Browse Certifications
              </Link>
            </div>
          </div>

          {/* Related Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/quiz"
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-emerald-600 mb-2">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Certification Quiz</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find which certification is right for you</p>
              </Link>
              <Link
                href="/study-plan"
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-emerald-600 mb-2">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Study Plan Generator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a personalized study schedule</p>
              </Link>
              <Link
                href="/certification-paths"
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-emerald-600 mb-2">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Certification Paths</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explore career roadmaps</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
