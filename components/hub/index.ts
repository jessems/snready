// Certification hubs that have a long-form, sourced deep dive. For these,
// app/[slug]/page.tsx swaps the templated domain/tips/prerequisite sections
// for the deep dive and uses the sourced intro below in the hero.

import type { ComponentType } from "react";
import { CadDeepDive } from "./CadDeepDive";
import { CisDfDeepDive } from "./CisDfDeepDive";
import { CpoaDeepDive } from "./CpoaDeepDive";
import { CsaDeepDive } from "./CsaDeepDive";

export interface HubDeepDive {
  Component: ComponentType;
  /** Hero intro; no exam facts, so it needs no source. */
  intro: string;
  /** Show the question-count/duration stats only where a fetched source states them. */
  formatSourced: boolean;
}

export const HUB_DEEP_DIVES: Record<string, HubDeepDive> = {
  csa: {
    Component: CsaDeepDive,
    intro: "What the Certified System Administrator exam really tests, how the platform layers fit together, worked scenarios, and sourced 2026 exam logistics. Every CSA practice question here is free.",
    formatSourced: true,
  },
  cad: {
    Component: CadDeepDive,
    intro: "How a scoped ServiceNow application fits together, what each Certified Application Developer blueprint domain asks, worked industry scenarios, and sourced 2026 exam logistics.",
    formatSourced: false,
  },
  "cis-df": {
    Component: CisDfDeepDive,
    intro: "How CMDB data is ingested, reconciled, governed and modelled with CSDM, mapped to the CIS-Data Foundations blueprint, with worked scenarios and sourced 2026 exam logistics.",
    formatSourced: true,
  },
  cpoa: {
    Component: CpoaDeepDive,
    intro: "The platform owner's operating model across strategy, people, process, technology, data and governance, mapped to the CPOA blueprint, with worked scenarios and sourced 2026 exam logistics.",
    formatSourced: false,
  },
};
