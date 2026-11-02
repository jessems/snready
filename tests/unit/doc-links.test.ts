import { describe, expect, it } from "vitest";
import {
  docLinkLabel,
  getExplanationWithSources,
  isHttpUrl,
  isListedSource,
  splitTextWithUrls,
  stripTrailingReferences,
  withExplanationSources,
} from "@/lib/doc-links";
import { getAllDeltaSlugs, getCertificationSlugs, getFreeQuestionsForCertification, getPublicDeltaQuestions } from "@/lib/data";
import type { Question } from "@/types";

describe("splitTextWithUrls", () => {
  it("splits prose into text and link segments, dropping trailing punctuation", () => {
    expect(splitTextWithUrls("Lists show records. See: https://docs.servicenow.com/a/b.html.")).toEqual([
      { type: "text", text: "Lists show records. See: " },
      { type: "link", href: "https://docs.servicenow.com/a/b.html" },
      { type: "text", text: "." },
    ]);
    expect(splitTextWithUrls("No links here")).toEqual([{ type: "text", text: "No links here" }]);
  });

  it("leaves malformed URLs as plain text", () => {
    const text = "The URL format is https://<MID Server IP>:<port>/api/mid/sa/metrics.";
    expect(splitTextWithUrls(text)).toEqual([{ type: "text", text }]);
  });

  it("keeps a closing parenthesis that belongs to the URL", () => {
    expect(splitTextWithUrls("(see https://en.wikipedia.org/wiki/Foo_(bar))")[1]).toEqual({
      type: "link",
      href: "https://en.wikipedia.org/wiki/Foo_(bar)",
    });
  });
});

describe("isHttpUrl", () => {
  it("accepts only http(s) URLs with a real host", () => {
    expect(isHttpUrl("https://www.servicenow.com/docs/x.html")).toBe(true);
    expect(isHttpUrl("http://example.org")).toBe(true);
    expect(isHttpUrl("ftp://example.org/file")).toBe(false);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("https://")).toBe(false);
    expect(isHttpUrl("https://localhost/x")).toBe(false);
    expect(isHttpUrl("ServiceNow Docs - Update Sets")).toBe(false);
    expect(isHttpUrl(undefined)).toBe(false);
  });
});

describe("stripTrailingReferences", () => {
  it.each([
    ["Lists show records. See https://docs.servicenow.com/a.html", "Lists show records."],
    ["Lists show records. See: https://docs.servicenow.com/a.html.", "Lists show records."],
    ["Lists show records. Source: https://docs.servicenow.com/a.html", "Lists show records."],
    ["Lists show records. Reference: https://docs.servicenow.com/a.html", "Lists show records."],
    ["Lists show records (see https://docs.servicenow.com/a.html).", "Lists show records"],
  ])("strips %j", (text, body) => {
    expect(stripTrailingReferences(text)).toEqual({ body, urls: ["https://docs.servicenow.com/a.html"] });
  });

  it("strips several trailing URLs joined by 'and' or commas", () => {
    expect(
      stripTrailingReferences("Both apply. See https://a.example.com/x.html and https://b.example.com/y.html")
    ).toEqual({ body: "Both apply.", urls: ["https://a.example.com/x.html", "https://b.example.com/y.html"] });
    expect(
      stripTrailingReferences("Both apply. Sources: https://a.example.com/x, https://b.example.com/y.")
    ).toEqual({ body: "Both apply.", urls: ["https://a.example.com/x", "https://b.example.com/y"] });
  });

  it("strips stacked trailing references", () => {
    expect(
      stripTrailingReferences("Done. See https://a.example.com/x. Reference: https://b.example.com/y")
    ).toEqual({ body: "Done.", urls: ["https://a.example.com/x", "https://b.example.com/y"] });
  });

  it("leaves text alone when there is no trailing labelled reference", () => {
    expect(stripTrailingReferences("No links here.")).toEqual({ body: "No links here.", urls: [] });
    const mid = "Open https://example.com/x to configure it, then save.";
    expect(stripTrailingReferences(mid)).toEqual({ body: mid, urls: [] });
    const bare = "Configured at https://example.com/x";
    expect(stripTrailingReferences(bare)).toEqual({ body: bare, urls: [] });
  });

  it("keeps a malformed example URL in the body while stripping the real reference", () => {
    const text =
      "The full URL format is https://<MID Server IP address>:<port number>/api/mid/sa/metrics. Reference: https://docs.servicenow.com/x.html";
    expect(stripTrailingReferences(text)).toEqual({
      body: "The full URL format is https://<MID Server IP address>:<port number>/api/mid/sa/metrics.",
      urls: ["https://docs.servicenow.com/x.html"],
    });
  });
});

describe("docLinkLabel", () => {
  it("titles ServiceNow docs pages from the URL slug", () => {
    expect(docLinkLabel("https://www.servicenow.com/docs/r/it-service-management/change-management/change-types.html")).toBe(
      "ServiceNow Docs: Change Types"
    );
    expect(
      docLinkLabel("https://www.servicenow.com/docs/r/platform-administration/table-administration-and-data-management/t_GenerateASchemaMap.html")
    ).toBe("ServiceNow Docs: Generate a Schema Map");
    expect(
      docLinkLabel("https://docs.servicenow.com/bundle/yokohama-platform-security/page/administer/contextual-security/concept/access-control-rules.html")
    ).toBe("ServiceNow Docs: Access Control Rules");
    expect(docLinkLabel("https://www.servicenow.com/docs/r/platform-security/c_ElevatedPrivilege.html")).toBe(
      "ServiceNow Docs: Elevated Privilege"
    );
    expect(docLinkLabel("https://www.servicenow.com/docs/r/x/cmdb-ci-class-models-nutanix.html")).toBe(
      "ServiceNow Docs: CMDB CI Class Models Nutanix"
    );
  });

  it("labels other ServiceNow sites", () => {
    expect(docLinkLabel("https://developer.servicenow.com/dev.do#!/share")).toBe("ServiceNow Developer: Share");
    expect(docLinkLabel("https://developer.servicenow.com/dev.do")).toBe("ServiceNow Developer");
    expect(docLinkLabel("https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0832200")).toBe(
      "ServiceNow Support: KB0832200"
    );
    expect(docLinkLabel("https://learning.servicenow.com/lxp/en/pages/learning-course?id=learning_course&course_id=62eb")).toBe(
      "ServiceNow University course"
    );
    expect(
      docLinkLabel("https://www.servicenow.com/community/developer-forum/cad-voucher/m-p/3536175")
    ).toBe("ServiceNow Community: CAD Voucher");
  });

  it("falls back to domain + cleaned path for other sites", () => {
    expect(docLinkLabel("https://example.org/guides/my%20page.html?x=1")).toBe("example.org/guides/my page");
    expect(docLinkLabel("https://www.example.org/")).toBe("example.org");
  });
});

describe("getExplanationWithSources", () => {
  it("merges the trailing reference with references/source fields, deduped, URLs only", () => {
    const question = {
      explanation: {
        correct: "Because. See https://docs.servicenow.com/a/change-types.html",
        wrongAnswers: [
          { choiceId: "a", explanation: "No.", reference: "https://docs.servicenow.com/a/change-types.html" },
          { choiceId: "c", explanation: "No.", reference: "ServiceNow Docs - Change" },
          { choiceId: "d", explanation: "No.", reference: "https://docs.servicenow.com/other.html" },
        ],
      },
      references: [
        "ServiceNow List Documentation",
        "https://www.docs.servicenow.com/a/change-types.html/",
        "https://docs.servicenow.com/other.html",
        "ftp://example.org/file",
        { title: "Lists and Filters", url: "https://nowlearning.servicenow.com/lists" },
      ],
      source: {
        type: "documentation",
        documentation: { docSlug: "d", section: "s", url: "https://docs.servicenow.com/doc/c_Lists.html" },
        course: { url: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=abc" },
      },
    } as unknown as Question;
    expect(getExplanationWithSources(question)).toEqual({
      body: "Because.",
      sources: [
        { href: "https://docs.servicenow.com/a/change-types.html", label: "ServiceNow Docs: Change Types" },
        { href: "https://docs.servicenow.com/other.html", label: "ServiceNow Docs: Other" },
        { href: "https://nowlearning.servicenow.com/lists", label: "Lists and Filters" },
        { href: "https://docs.servicenow.com/doc/c_Lists.html", label: "ServiceNow Docs: Lists" },
        { href: "https://learning.servicenow.com/lxp?id=learning_course_prev&course_id=abc", label: "ServiceNow University course" },
      ],
    });
  });

  it("handles a singular reference, a plain-string source and a string explanation", () => {
    expect(
      getExplanationWithSources({
        explanation: "Plain. Source: https://example.org/a",
        reference: "https://example.org/b",
        source: "https://example.org/a",
      })
    ).toEqual({
      body: "Plain.",
      sources: [
        { href: "https://example.org/a", label: "example.org/a" },
        { href: "https://example.org/b", label: "example.org/b" },
      ],
    });
  });

  it("does not repeat URLs that stay linked inline, and numbers repeated labels", () => {
    const result = getExplanationWithSources({
      explanation: { correct: "Open https://example.org/x to configure it, then save." },
      references: [
        "https://example.org/x",
        "https://learning.servicenow.com/lxp?course_id=1",
        "https://learning.servicenow.com/lxp?course_id=2",
      ],
    });
    expect(result.body).toBe("Open https://example.org/x to configure it, then save.");
    expect(result.sources.map((source) => source.label)).toEqual([
      "ServiceNow University course",
      "ServiceNow University course (2)",
    ]);
  });

  it("returns no sources when there are no URLs", () => {
    expect(getExplanationWithSources({ explanation: { correct: "Just text." }, references: ["Docs - Lists"] })).toEqual({
      body: "Just text.",
      sources: [],
    });
    expect(getExplanationWithSources({})).toEqual({ body: "", sources: [] });
  });
});

describe("withExplanationSources", () => {
  const question = {
    id: "q1",
    explanation: {
      correct: "Lists show records. See https://www.servicenow.com/docs/r/lists.html",
      wrongAnswers: [{ choiceId: "a", explanation: "Forms show one record.", reference: "https://www.servicenow.com/docs/r/forms.html" }],
    },
    references: ["https://docs.servicenow.com/other.html"],
  };

  it("strips the trailing reference from the explanation and carries the sources separately", () => {
    const prepared = withExplanationSources(question);
    expect(prepared.explanation.correct).toBe("Lists show records.");
    expect(prepared.explanation.wrongAnswers).toEqual(question.explanation.wrongAnswers);
    expect(prepared.sources).toEqual(getExplanationWithSources(question).sources);
    expect(prepared.sources.map((source) => source.href)).toEqual([
      "https://www.servicenow.com/docs/r/lists.html",
      "https://docs.servicenow.com/other.html",
      "https://www.servicenow.com/docs/r/forms.html",
    ]);
    expect(JSON.stringify(prepared)).not.toMatch(/See https?:\/\//);
    expect(question.explanation.correct).toContain("See https://"); // input not mutated
  });

  it("gives the same body and sources when rendered again on the client", () => {
    expect(getExplanationWithSources(withExplanationSources(question))).toEqual(getExplanationWithSources(question));
    const numbered = {
      explanation: "Courses. See https://learning.servicenow.com/lxp?course_id=1",
      references: ["https://learning.servicenow.com/lxp?course_id=2"],
    };
    expect(getExplanationWithSources(withExplanationSources(numbered))).toEqual(getExplanationWithSources(numbered));
  });

  it("strips a plain-string explanation", () => {
    expect(withExplanationSources({ explanation: "Plain. Source: https://example.org/a" })).toEqual({
      explanation: "Plain.",
      sources: [{ href: "https://example.org/a", label: "example.org/a" }],
    });
  });

  it("leaves no \"See https://\" in any free or delta question sent to the client", async () => {
    const questions = [
      ...(await Promise.all(getCertificationSlugs().map((slug) => getFreeQuestionsForCertification(slug)))).flat(),
      ...(await Promise.all(getAllDeltaSlugs().map(({ certification, release }) => getPublicDeltaQuestions(certification, release)))).flat(),
    ];
    expect(questions.some((q) => JSON.stringify(q).includes("See https://"))).toBe(true);
    for (const q of questions) {
      const prepared = withExplanationSources(q);
      expect(JSON.stringify(prepared), q.id).not.toMatch(/See:? https?:\/\//i);
      expect(getExplanationWithSources(prepared), q.id).toEqual(getExplanationWithSources(q));
    }
  });
});

describe("isListedSource", () => {
  const sources = [{ href: "https://www.servicenow.com/docs/r/lists.html", label: "ServiceNow Docs: Lists" }];

  it("matches the same page regardless of host case, www. and trailing slash", () => {
    expect(isListedSource("https://www.servicenow.com/docs/r/lists.html", sources)).toBe(true);
    expect(isListedSource("https://WWW.ServiceNow.com/docs/r/lists.html/", sources)).toBe(true);
    expect(isListedSource("https://servicenow.com/docs/r/lists.html", sources)).toBe(true);
  });

  it("does not match other pages or non-URL references", () => {
    expect(isListedSource("https://www.servicenow.com/docs/r/forms.html", sources)).toBe(false);
    expect(isListedSource("https://www.servicenow.com/docs/r/LISTS.html", sources)).toBe(false);
    expect(isListedSource("ServiceNow Docs - Lists", sources)).toBe(false);
    expect(isListedSource("https://www.servicenow.com/docs/r/lists.html", [])).toBe(false);
  });
});
