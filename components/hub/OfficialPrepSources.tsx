// Official prep sources for a cert hub: the blueprint domains and objectives,
// the courses the blueprint recommends, and the product docs for the main exam
// areas. Everything here comes from data/coverage/certification-sources.json
// (fetched from the official blueprint, exam page and credential path). This
// content used to live on /{cert}/prepare, which now 301s to the hub.

import certificationSources from "@/data/coverage/certification-sources.json";
import type { Certification } from "@/types";

interface OfficialCertSources {
  slug: string;
  blueprint: {
    kb: string;
    url: string;
    version: string;
    updated: string;
  };
  examRegistrationUrl: string;
  credentialPathUrl: string;
  domains: Array<{ name: string; weight: number; subtopics: string[] }>;
  courses: {
    recommended: string[];
    additionalRecommended: string[];
  };
  courseNotes?: Record<string, string>;
  docs: Array<{ area: string; url: string }>;
}

type PrepCourse = { name: string; url: string; note: string | null; viaCredentialPath: boolean };

const officialSourcesBySlug = new Map(
  Object.values(
    certificationSources.certifications as unknown as Record<string, OfficialCertSources>
  ).map((c) => [c.slug, c])
);
const courseUrls = certificationSources.courseUrls as Record<string, string>;
const courseCompletionPolicy = certificationSources.courseCompletionPolicy;

/** Official blueprint domain names, highest weight first (empty when no source data). */
export function getOfficialDomainNames(certSlug: string): string[] {
  const official = officialSourcesBySlug.get(certSlug);
  return [...(official?.domains ?? [])].sort((a, b) => b.weight - a.weight).map((d) => d.name);
}

function buildPrepData(certification: Certification) {
  const official = officialSourcesBySlug.get(certification.slug);
  const fallbackUrl = certification.blueprintUrl ?? "https://learning.servicenow.com/";
  const toCourse = (name: string): PrepCourse => ({
    name,
    url: courseUrls[name] ?? official?.credentialPathUrl ?? fallbackUrl,
    note: official?.courseNotes?.[name] ?? null,
    viaCredentialPath: !courseUrls[name],
  });
  return {
    examPage: official?.examRegistrationUrl ?? fallbackUrl,
    blueprintUrl: official?.blueprint.url ?? fallbackUrl,
    studyGuideUrl: certification.deltaExam?.studyGuideUrl || null,
    blueprintSource: official
      ? `Official blueprint ${official.blueprint.kb} v${official.blueprint.version}, updated ${official.blueprint.updated}`
      : "ServiceNow Official Exam Blueprint",
    domains: [...(official?.domains ?? [])].sort((a, b) => b.weight - a.weight),
    recommendedCourses: (official?.courses.recommended ?? []).map(toCourse),
    additionalCourses: (official?.courses.additionalRecommended ?? []).map(toCourse),
    docs: official?.docs ?? [],
  };
}

export function OfficialPrepSources({
  certification,
  showBlueprint,
}: {
  certification: Certification;
  /** Show the blueprint objectives table (hubs with a deep dive already cover the blueprint). */
  showBlueprint: boolean;
}) {
  const prep = buildPrepData(certification);

  return (
    <section id="official-prep" className="py-16 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Official {certification.name} blueprint, courses and docs
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={prep.examPage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Official exam page ↗
          </a>
          <a
            href={prep.blueprintUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {prep.blueprintSource} ↗
          </a>
          {prep.studyGuideUrl && (
            <a
              href={prep.studyGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Official study guide ↗
            </a>
          )}
        </div>

        {showBlueprint && prep.domains.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Exam blueprint: domains and objectives
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Domain</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {prep.domains.map((domain) => (
                    <tr key={domain.name} className="bg-white dark:bg-zinc-900">
                      <td className="px-4 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{domain.name}</div>
                        <ul className="mt-2 space-y-1">
                          {domain.subtopics.map((objective, i) => (
                            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                              • {objective}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4 text-right align-top">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {domain.weight}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {prep.recommendedCourses.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recommended courses
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Courses the official blueprint recommends. ServiceNow: &ldquo;{courseCompletionPolicy}&rdquo;
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {prep.recommendedCourses.map((course) => (
                <a
                  key={course.name}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-emerald-200 bg-emerald-50 p-4 transition-colors hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:border-emerald-600"
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {course.name} <span className="text-emerald-600">↗</span>
                  </div>
                  {course.viaCredentialPath && (
                    <div className="mt-1 text-xs text-zinc-500">via credential path</div>
                  )}
                  {course.note && (
                    <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">{course.note}</div>
                  )}
                </a>
              ))}
            </div>
            {prep.additionalCourses.length > 0 && (
              <>
                <h4 className="mt-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Optional extra courses listed in the blueprint
                </h4>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {prep.additionalCourses.map((course) => (
                    <li key={course.name}>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-700 underline-offset-2 hover:text-emerald-600 hover:underline dark:text-zinc-300"
                      >
                        {course.name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {prep.docs.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Official documentation
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              ServiceNow product documentation (Australia release) for the main exam areas.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {prep.docs.map((doc) => (
                <a
                  key={doc.area}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{doc.area}</span>
                  <span className="text-zinc-400">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
