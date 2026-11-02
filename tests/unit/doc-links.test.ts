import { describe, expect, it } from "vitest";
import { docLinkLabel, getQuestionReferences, splitTextWithUrls } from "@/lib/doc-links";
import type { Question } from "@/types";

describe("doc links", () => {
  it("splits prose into text and link segments, dropping trailing punctuation", () => {
    expect(splitTextWithUrls("Lists show records. See: https://docs.servicenow.com/a/b.html.")).toEqual([
      { type: "text", text: "Lists show records. See: " },
      { type: "link", href: "https://docs.servicenow.com/a/b.html" },
      { type: "text", text: "." },
    ]);
    expect(splitTextWithUrls("No links here")).toEqual([{ type: "text", text: "No links here" }]);
  });

  it("labels ServiceNow documentation hosts", () => {
    expect(docLinkLabel("https://www.servicenow.com/docs/bundle/x/page.html")).toBe("ServiceNow product documentation");
    expect(docLinkLabel("https://developer.servicenow.com/dev.do")).toBe("ServiceNow Developer documentation");
    expect(docLinkLabel("https://learning.servicenow.com/lxp/en/pages/x")).toBe("ServiceNow University course");
    expect(docLinkLabel("https://example.org/x")).toBe("example.org");
  });

  it("collects unique reference URLs not already linked inline", () => {
    const inline = "https://docs.servicenow.com/inline";
    const question = {
      explanation: {
        correct: `Because. See ${inline}`,
        wrongAnswers: [
          { choiceId: "a", explanation: "No.", reference: inline },
          { choiceId: "c", explanation: "No.", reference: "https://docs.servicenow.com/other" },
        ],
      },
      references: [
        "ServiceNow List Documentation",
        "https://docs.servicenow.com/other",
        { title: "Lists and Filters", type: "course", url: "https://nowlearning.servicenow.com" },
        { title: "Untitled reference without a URL" },
      ],
      source: { type: "documentation", path: "x", excerpt: "x", documentation: { docSlug: "d", section: "s", url: "https://docs.servicenow.com/doc" } },
    } as unknown as Question;
    expect(getQuestionReferences(question)).toEqual({
      links: [
        { href: "https://docs.servicenow.com/other" },
        { href: "https://nowlearning.servicenow.com", title: "Lists and Filters" },
        { href: "https://docs.servicenow.com/doc" },
      ],
      notes: ["ServiceNow List Documentation", "Untitled reference without a URL"],
    });
  });
});
