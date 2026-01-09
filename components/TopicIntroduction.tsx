import type { Topic } from "@/types";

interface TopicIntroductionProps {
  topic: Topic;
}

export default function TopicIntroduction({ topic }: TopicIntroductionProps) {
  if (!topic.introduction) return null;

  const { overview, whyItMatters, keyConcepts, examTips } = topic.introduction;

  return (
    <section className="mb-12 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        About {topic.name}
      </h2>

      <div className="mt-6 space-y-6">
        {/* Overview */}
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">{overview}</p>
        </div>

        {/* Why It Matters */}
        <div>
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Why This Matters for Your Exam
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">{whyItMatters}</p>
        </div>

        {/* Key Concepts */}
        <div>
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Key Concepts to Master
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">{keyConcepts}</p>
        </div>

        {/* Exam Tips */}
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
          <h3 className="mb-2 font-semibold text-emerald-800 dark:text-emerald-200">
            Exam Tips
          </h3>
          <p className="text-emerald-700 dark:text-emerald-300">{examTips}</p>
        </div>
      </div>
    </section>
  );
}
