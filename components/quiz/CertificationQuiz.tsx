"use client";

import { useState } from "react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

interface CertRecommendation {
  cert: string;
  name: string;
  slug: string;
  description: string;
  whyYou: string;
  nextSteps: string[];
  prerequisites: string[];
}

const certifications: Record<string, CertRecommendation> = {
  csa: {
    cert: "CSA",
    name: "Certified System Administrator",
    slug: "csa",
    description:
      "The foundation certification for all ServiceNow professionals. Covers platform basics, administration, and ITSM modules.",
    whyYou:
      "This is the perfect starting point based on your experience level and goals. CSA opens doors to all other certifications and is the most in-demand ServiceNow credential.",
    nextSteps: [
      "Study platform fundamentals (tables, forms, lists)",
      "Learn user administration and security",
      "Practice with ITSM modules (Incident, Problem, Change)",
      "Complete the CSA learning path on Now Learning",
    ],
    prerequisites: [],
  },
  cad: {
    cert: "CAD",
    name: "Certified Application Developer",
    slug: "cad",
    description:
      "For developers who want to build custom applications using JavaScript, GlideRecord, Business Rules, and REST APIs.",
    whyYou:
      "Your technical background and interest in development make CAD ideal. It's one of the highest-paying ServiceNow certifications and opens doors to custom app development.",
    nextSteps: [
      "Master JavaScript fundamentals",
      "Learn GlideRecord and server-side scripting",
      "Practice Client Scripts and UI Policies",
      "Build scoped applications",
    ],
    prerequisites: ["CSA"],
  },
  "cis-itsm": {
    cert: "CIS-ITSM",
    name: "CIS - IT Service Management",
    slug: "cis-itsm",
    description:
      "Deep expertise in Incident, Problem, Change, and Request management. The most popular implementation specialist certification.",
    whyYou:
      "Your ITSM focus aligns perfectly with CIS-ITSM. It's the most common ServiceNow implementation and gives you expertise in the core platform modules.",
    nextSteps: [
      "Deep-dive into Incident Management configuration",
      "Learn Change Management processes",
      "Master SLA configuration and reporting",
      "Study ITIL foundations",
    ],
    prerequisites: ["CSA"],
  },
  "cis-df": {
    cert: "CIS-DF",
    name: "CIS - Data Foundations (CMDB)",
    slug: "cis-df",
    description:
      "Expert-level CMDB configuration, data governance, and CSDM implementation. Critical for enterprise ServiceNow deployments.",
    whyYou:
      "Your interest in data and infrastructure makes CIS-DF an excellent choice. CMDB specialists are in high demand as companies struggle with data quality.",
    nextSteps: [
      "Learn CSDM (Common Service Data Model)",
      "Master CI relationships and class hierarchy",
      "Study Discovery and data governance",
      "Practice CMDB Health dashboards",
    ],
    prerequisites: ["CSA"],
  },
  "cis-csm": {
    cert: "CIS-CSM",
    name: "CIS - Customer Service Management",
    slug: "cis-csm",
    description:
      "Specialization in customer-facing service management, portals, and case management for B2B customer support.",
    whyYou:
      "Your interest in customer experience and external-facing systems makes CSM ideal. It's a growing area as companies digitize customer interactions.",
    nextSteps: [
      "Learn Case Management configuration",
      "Master Service Portal customization",
      "Study Account and Contact models",
      "Practice workflow automation for customers",
    ],
    prerequisites: ["CSA"],
  },
  "cis-hr": {
    cert: "CIS-HR",
    name: "CIS - Human Resources Service Delivery",
    slug: "cis-hr",
    description:
      "HR case management, employee portals, and HR service automation. Growing specialization as HR digitization accelerates.",
    whyYou:
      "Your interest in HR processes and employee experience makes this a perfect fit. HR Service Delivery is one of ServiceNow's fastest-growing products.",
    nextSteps: [
      "Learn HR Case Management",
      "Master Employee Center Portal",
      "Study lifecycle events and onboarding",
      "Practice HR knowledge management",
    ],
    prerequisites: ["CSA"],
  },
  "cis-discovery": {
    cert: "CIS-Discovery",
    name: "CIS - Discovery",
    slug: "cis-discovery",
    description:
      "Expert in automated infrastructure discovery, MID Servers, and pattern design for populating the CMDB.",
    whyYou:
      "Your technical and infrastructure focus makes Discovery ideal. Discovery specialists are essential for CMDB accuracy and highly valued.",
    nextSteps: [
      "Learn MID Server architecture",
      "Master horizontal and vertical patterns",
      "Study credential management",
      "Practice Discovery schedules and probes",
    ],
    prerequisites: ["CSA", "CIS-DF recommended"],
  },
  "cis-sm": {
    cert: "CIS-SM",
    name: "CIS - Service Mapping",
    slug: "cis-sm",
    description:
      "Automated application service mapping to visualize dependencies and support change impact analysis.",
    whyYou:
      "Your interest in infrastructure and application topology makes Service Mapping excellent. It's critical for modern AIOps and event management.",
    nextSteps: [
      "Learn service modeling concepts",
      "Master Traffic-Based Discovery",
      "Study pattern-based mapping",
      "Practice entry points and manual services",
    ],
    prerequisites: ["CSA", "CIS-Discovery recommended"],
  },
  "cis-sam": {
    cert: "CIS-SAM",
    name: "CIS - Software Asset Management",
    slug: "cis-sam",
    description:
      "Software license management, compliance, and cost optimization. Growing importance with cloud and SaaS sprawl.",
    whyYou:
      "Your interest in governance and cost management makes SAM valuable. Companies pay millions in license compliance, so SAM expertise is in demand.",
    nextSteps: [
      "Learn software models and entitlements",
      "Master license calculations",
      "Study publisher packs and normalization",
      "Practice compliance reporting",
    ],
    prerequisites: ["CSA"],
  },
  "cis-ham": {
    cert: "CIS-HAM",
    name: "CIS - Hardware Asset Management",
    slug: "cis-ham",
    description:
      "Physical asset lifecycle from procurement to disposal. Essential for IT asset management and financial tracking.",
    whyYou:
      "Your interest in asset management and operations makes HAM practical. Hardware tracking is fundamental to IT operations.",
    nextSteps: [
      "Learn asset lifecycle states",
      "Master procurement and stockrooms",
      "Study depreciation and financial management",
      "Practice contracts and refresh cycles",
    ],
    prerequisites: ["CSA"],
  },
};

const questions: QuizQuestion[] = [
  {
    id: "role",
    question: "What best describes your current role?",
    options: [
      {
        text: "IT Support / Help Desk",
        scores: { csa: 10, "cis-itsm": 5 },
      },
      {
        text: "Software Developer / Engineer",
        scores: { cad: 10, csa: 5 },
      },
      {
        text: "IT Consultant / Implementation Partner",
        scores: { csa: 5, "cis-itsm": 5, "cis-csm": 3, "cis-df": 3 },
      },
      {
        text: "System Administrator (non-ServiceNow)",
        scores: { csa: 10, "cis-df": 3, "cis-discovery": 3 },
      },
      {
        text: "HR / People Operations",
        scores: { csa: 5, "cis-hr": 10 },
      },
      {
        text: "New to IT / Career Changer",
        scores: { csa: 15 },
      },
    ],
  },
  {
    id: "experience",
    question: "How much ServiceNow experience do you have?",
    options: [
      {
        text: "None - I'm completely new to ServiceNow",
        scores: { csa: 15 },
      },
      {
        text: "I've used ServiceNow as an end user",
        scores: { csa: 10 },
      },
      {
        text: "1-2 years as an admin or developer",
        scores: { cad: 5, "cis-itsm": 5, "cis-df": 5, "cis-csm": 3 },
      },
      {
        text: "3+ years with ServiceNow",
        scores: {
          cad: 5,
          "cis-df": 8,
          "cis-discovery": 5,
          "cis-sm": 5,
          "cis-sam": 3,
        },
      },
      {
        text: "I have CSA already and want to specialize",
        scores: {
          cad: 8,
          "cis-itsm": 8,
          "cis-df": 8,
          "cis-csm": 5,
          "cis-hr": 5,
        },
      },
    ],
  },
  {
    id: "goal",
    question: "What's your primary career goal?",
    options: [
      {
        text: "Get my first ServiceNow job",
        scores: { csa: 15, "cis-itsm": 3 },
      },
      {
        text: "Increase my salary / get promoted",
        scores: { cad: 8, "cis-df": 8, "cis-discovery": 5, "cis-sm": 5 },
      },
      {
        text: "Become a ServiceNow consultant",
        scores: { csa: 5, cad: 5, "cis-itsm": 8, "cis-csm": 5, "cis-df": 5 },
      },
      {
        text: "Specialize in a niche area",
        scores: {
          "cis-df": 8,
          "cis-discovery": 8,
          "cis-sm": 8,
          "cis-hr": 5,
          "cis-sam": 5,
        },
      },
      {
        text: "Lead a ServiceNow practice / team",
        scores: { csa: 5, cad: 5, "cis-df": 5, "cis-itsm": 5 },
      },
    ],
  },
  {
    id: "interest",
    question: "Which area interests you most?",
    options: [
      {
        text: "IT Service Management (tickets, changes, incidents)",
        scores: { "cis-itsm": 15, csa: 5 },
      },
      {
        text: "Custom development and scripting",
        scores: { cad: 15, csa: 3 },
      },
      {
        text: "Data, CMDB, and infrastructure",
        scores: { "cis-df": 15, "cis-discovery": 8, "cis-sm": 5 },
      },
      {
        text: "Customer service and portals",
        scores: { "cis-csm": 15, csa: 3 },
      },
      {
        text: "HR and employee experience",
        scores: { "cis-hr": 15, csa: 3 },
      },
      {
        text: "Asset management and compliance",
        scores: { "cis-sam": 10, "cis-ham": 10, csa: 3 },
      },
      {
        text: "Security and risk management",
        scores: { csa: 5, "cis-df": 5 },
      },
    ],
  },
  {
    id: "style",
    question: "What's your preferred work style?",
    options: [
      {
        text: "Configuration and process design (low/no code)",
        scores: { csa: 8, "cis-itsm": 8, "cis-csm": 8, "cis-hr": 5 },
      },
      {
        text: "Writing code and building applications",
        scores: { cad: 15, "cis-discovery": 3 },
      },
      {
        text: "Data modeling and architecture",
        scores: { "cis-df": 15, "cis-sm": 5 },
      },
      {
        text: "Infrastructure and networking",
        scores: { "cis-discovery": 15, "cis-df": 5, "cis-sm": 5 },
      },
      {
        text: "Mix of technical and functional",
        scores: { csa: 5, cad: 5, "cis-itsm": 5, "cis-df": 5 },
      },
    ],
  },
  {
    id: "timeline",
    question: "How quickly do you want to get certified?",
    options: [
      {
        text: "ASAP - I have time to study intensively",
        scores: { csa: 10 },
      },
      {
        text: "Within 3 months",
        scores: { csa: 8, cad: 3, "cis-itsm": 3 },
      },
      {
        text: "Within 6 months",
        scores: {
          csa: 5,
          cad: 5,
          "cis-itsm": 5,
          "cis-df": 5,
          "cis-csm": 3,
          "cis-hr": 3,
        },
      },
      {
        text: "I'm planning a multi-certification path",
        scores: {
          csa: 5,
          cad: 8,
          "cis-df": 8,
          "cis-itsm": 5,
          "cis-discovery": 5,
        },
      },
    ],
  },
];

export default function CertificationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const option = questions[currentQuestion].options[selectedOption];
    const newScores = { ...scores };

    Object.entries(option.scores).forEach(([cert, score]) => {
      newScores[cert] = (newScores[cert] || 0) + score;
    });

    setScores(newScores);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScores({});
    setIsComplete(false);
    setSelectedOption(null);
  };

  const getTopCertifications = (): CertRecommendation[] => {
    const sortedCerts = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cert]) => certifications[cert])
      .filter(Boolean);

    return sortedCerts.length > 0 ? sortedCerts : [certifications.csa];
  };

  if (isComplete) {
    const recommendations = getTopCertifications();
    const primary = recommendations[0];
    const alternates = recommendations.slice(1);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Recommended Certification
          </h2>
          <p className="text-gray-600">
            Based on your answers, here&apos;s what we recommend:
          </p>
        </div>

        {/* Primary Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
              #1
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {primary.cert} — {primary.name}
              </h3>
              <p className="text-gray-700 mb-3">{primary.description}</p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Why this is right for you:
                </h4>
                <p className="text-gray-600">{primary.whyYou}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Your next steps:
                </h4>
                <ul className="space-y-1">
                  {primary.nextSteps.map((step, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500">→</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              {primary.prerequisites.length > 0 && (
                <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                  ⚠️ Prerequisites: {primary.prerequisites.join(", ")}
                </div>
              )}
              <div className="mt-4">
                <Link
                  href={`/${primary.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Practicing {primary.cert} Questions →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alternate Recommendations */}
        {alternates.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Also Consider:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {alternates.map((rec, i) => (
                <div
                  key={rec.cert}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {i + 2}
                    </span>
                    <h4 className="font-semibold text-gray-900">
                      {rec.cert} — {rec.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <Link
                    href={`/${rec.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Practice {rec.cert} →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
          <button
            onClick={handleRestart}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retake Quiz
          </button>
          <Link
            href="/certification-paths"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            View All Certification Paths
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="text-gray-900">{option.text}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className={`px-6 py-2 rounded-lg transition-colors ${
            currentQuestion === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            selectedOption === null
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {currentQuestion === questions.length - 1
            ? "Get My Results →"
            : "Next →"}
        </button>
      </div>
    </div>
  );
}
