// Controlled vocabulary for facts. Each factType has exactly one relation so that facts of
// the same type are interchangeable: one fact's value is a plausible distractor for another.
// Archetypes (data/exam-intel/artifacts) reference these factTypes.

export interface FactTypeSpec {
  factType: string;
  relation: string;
  valueKind: "text" | "list" | "ordered_list";
  subject: string; // what goes in `subject`
  value: string; // what goes in `value`
  example: { subject: string; value: string | string[]; context?: string };
}

export const FACT_TYPES: FactTypeSpec[] = [
  {
    factType: "entity_table_name",
    relation: "stored_in_table",
    valueKind: "text",
    subject: "a record type / entity, as users name it",
    value: "the exact table name",
    example: { subject: "Knowledge article", value: "kb_knowledge" },
  },
  {
    factType: "role_permission",
    relation: "requires_role",
    valueKind: "text",
    subject: "an action or capability a user performs",
    value: "the exact role name that grants it",
    example: { subject: "Create and manage knowledge bases", value: "knowledge_admin" },
  },
  {
    factType: "component_membership",
    relation: "has_members",
    valueKind: "list",
    subject: "a named set (types, components, states, fields, options)",
    value: "every member the source lists (at least 3)",
    example: { subject: "ACL decision types", value: ["Allow If", "Deny Unless"], context: "Access control" },
  },
  {
    factType: "ordered_process",
    relation: "has_steps_in_order",
    valueKind: "ordered_list",
    subject: "a process or lifecycle",
    value: "its steps or states, in order (at least 3)",
    example: { subject: "Knowledge article publishing workflow states", value: ["Draft", "Review", "Published", "Retired"] },
  },
  {
    factType: "navigation_path",
    relation: "navigate_to",
    valueKind: "text",
    subject: "a screen, list or module the user wants to reach",
    value: "the navigation path, using ' > ' between steps",
    example: { subject: "Update set list", value: "System Update Sets > Local Update Sets" },
  },
  {
    factType: "scenario_tool_fit",
    relation: "best_handled_by",
    valueKind: "text",
    subject: "a requirement or scenario, phrased as a need",
    value: "the ServiceNow feature or tool that the source says addresses it",
    example: { subject: "Make a field mandatory on a form without scripting", value: "UI policy" },
  },
  {
    factType: "concept_definition",
    relation: "is_defined_as",
    valueKind: "text",
    subject: "a ServiceNow concept or feature name",
    value: "a one-line definition (max ~15 words) that identifies it",
    example: { subject: "Import set", value: "A staging table that holds imported data before it is transformed" },
  },
  {
    factType: "relationship",
    relation: "relates_to",
    valueKind: "text",
    subject: "a concept, record or CI type",
    value: "what it relates to and how, as a short phrase",
    example: { subject: "Transform map", value: "Maps import set table fields to target table fields" },
  },
  {
    factType: "default_value",
    relation: "defaults_to",
    valueKind: "text",
    subject: "a setting, property, field or behavior",
    value: "its out-of-box default",
    example: { subject: "Knowledge article valid to date", value: "2100-01-01", context: "Knowledge Management" },
  },
  {
    factType: "business_outcome",
    relation: "delivers_outcome",
    valueKind: "text",
    subject: "a feature or capability",
    value: "the business outcome or benefit the source states",
    example: { subject: "Service Catalog", value: "Lets users request goods and services through self-service" },
  },
  {
    factType: "property_behavior",
    relation: "controls_behavior",
    valueKind: "text",
    subject: "a system property or configuration option (exact name)",
    value: "the behavior it controls",
    example: { subject: "glide.ui.list.allow_extended_fields", value: "Allows dot-walking to extended table fields in list views" },
  },
];

export const FACT_TYPE_BY_NAME = new Map(FACT_TYPES.map((spec) => [spec.factType, spec]));
