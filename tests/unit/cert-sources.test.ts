import { describe, expect, it } from "vitest";
import {
  getCertSources,
  groupCertSources,
  matchPracticeDomain,
  parseCsv,
} from "@/lib/cert-sources";
import { getCertificationSlugs } from "@/lib/data";

describe("parseCsv", () => {
  it("handles quoted fields with commas, quotes and newlines", () => {
    const rows = parseCsv('a,b\n"x, y","say ""hi""\nthere"\n');
    expect(rows).toEqual([{ a: "x, y", b: 'say "hi"\nthere' }]);
  });
});

describe("groupCertSources", () => {
  const header =
    "cert,resource_type,name,weight,listed_in,url,format,duration,notes,source_url,checked_on";
  const csv = [
    header,
    "CIS-X,spec,Exam blueprint,,,https://x/kb?sysparm_article=KB0000001,,,KB0000001; blueprint says 'Updated May 2026',,2026-09-27",
    "CIS-X,domain,Setup,40%,,,,,A; B,,",
    'CIS-X,course,Core,,"blueprint: recommended; credential path: step 1 (Suggested pre-requisites)",,,,,,',
    "CIS-X,course,Optional,,credential path: step 5 (Complete optional recommended courses),,,,,,",
    "CIS-X,course,Extra,,blueprint: additional resources,,,,,,",
  ].join("\n");

  it("splits core and additional courses and parses blueprint metadata", () => {
    const s = groupCertSources(parseCsv(csv))["cis-x"];
    expect(s.blueprint).toMatchObject({ kb: "KB0000001", updated: "May 2026" });
    expect(s.domains).toEqual([{ name: "Setup", weight: 40, subtopics: ["A", "B"] }]);
    expect(s.coreCourses.map((c) => c.name)).toEqual(["Core"]);
    expect(s.additionalCourses.map((c) => c.name)).toEqual(["Optional", "Extra"]);
  });
});

describe("matchPracticeDomain", () => {
  const practice = [
    { name: "Workspace, Portals & Analytics", percentage: 20, slug: "ws" },
    { name: "Self-Service & Automation", percentage: 15, slug: "ssa" },
  ];

  it("matches renamed domains with the same weight", () => {
    const official = {
      name: "CSM Workspace, Portals, Service Catalog, Analytics, and Reporting",
      weight: 20,
      subtopics: [],
    };
    expect(matchPracticeDomain(official, practice)?.slug).toBe("ws");
  });

  it("does not match when the weight changed", () => {
    const official = { name: "Self Service & Automation", weight: 20, subtopics: [] };
    expect(matchPracticeDomain(official, practice)).toBeUndefined();
  });
});

describe("cert-sources.csv", () => {
  it.each(getCertificationSlugs())(
    "%s has a blueprint and domains summing to 100%%",
    (slug) => {
      const s = getCertSources(slug);
      expect(s?.blueprint.url).toMatch(/^https:\/\/learning\.servicenow\.com\//);
      const total = s!.domains.reduce((sum, d) => sum + d.weight, 0);
      expect(total).toBeCloseTo(100, 0);
    },
  );
});
