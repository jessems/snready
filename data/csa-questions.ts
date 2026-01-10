import { Question } from "@/types/quiz";

export const csaQuestions: Question[] = [
  {
    id: 1,
    text: "What scripting language is used in ServiceNow?",
    options: ["Java", "AngularJS", "JavaScript", "Jelly"],
    correctAnswers: [2],
    multiSelect: false,
    explanation:
      "ServiceNow uses JavaScript as its primary scripting language for server-side and client-side scripts, including Business Rules, Script Includes, and Client Scripts.",
  },
  {
    id: 2,
    text: "A single field is used to match records between an import set and an existing ServiceNow table. What is this scenario called?",
    options: [
      "Single-field coalesce",
      "Show Activity Stream",
      "Application Scoping",
      "Workflow",
    ],
    correctAnswers: [0],
    multiSelect: false,
    explanation:
      "Single-field coalesce is used when matching import set data to existing records using one field. Coalescing helps prevent duplicate records during data imports.",
  },
  {
    id: 3,
    text: "What tools are used to customize SLA states in ServiceNow?",
    options: [
      "Task",
      "SLA Conditions and Script Include",
      "Knowledge Instant Publish",
      "Application Scoping",
    ],
    correctAnswers: [1],
    multiSelect: false,
    explanation:
      "SLA Conditions and Script Includes are used to customize SLA behavior, including defining when SLAs pause, stop, or breach.",
  },
  {
    id: 4,
    text: "What does data classification support in ServiceNow? (Select 2)",
    options: [
      "Help with privacy laws, security and compliance",
      "Visualize the current sensitivity of data",
      "Track creation/update/deletion of records",
      "Protect sensitive info by scrambling data",
    ],
    correctAnswers: [0, 1],
    multiSelect: true,
    explanation:
      "Data classification in ServiceNow helps organizations comply with privacy laws and security requirements, and provides visibility into how sensitive data is classified across the platform.",
  },
  {
    id: 5,
    text: "Which module shows tasks assigned to a group that a user belongs to?",
    options: [
      "My Groups Work",
      "My Teams Work",
      "My Groups Tasks",
      "My Teams Tasks",
    ],
    correctAnswers: [0],
    multiSelect: false,
    explanation:
      "The 'My Groups Work' module displays all tasks assigned to groups that the logged-in user is a member of.",
  },
  {
    id: 6,
    text: "Which application is available to all users by default in ServiceNow?",
    options: ["Change", "Incident", "Facilities", "Self Service"],
    correctAnswers: [3],
    multiSelect: false,
    explanation:
      "Self Service is the default application available to all users, allowing them to submit requests, view knowledge articles, and track their tickets.",
  },
  {
    id: 7,
    text: "What actions can be performed from the user menu in ServiceNow? (Choose 3)",
    options: [
      "Send Notifications",
      "Log Out ServiceNow",
      "Elevate Roles",
      "Impersonate Users",
      "Order from Service Catalog",
      "Approve Records",
    ],
    correctAnswers: [1, 2, 3],
    multiSelect: true,
    explanation:
      "The user menu allows users to log out, elevate their roles (if permitted), and impersonate other users (for admins). Sending notifications, ordering from catalog, and approving records are done elsewhere.",
  },
  {
    id: 8,
    text: "Where would you create a notification template for network outages?",
    options: [
      "User Preferences > Email > Notifications",
      "System Properties > Email > Settings",
      "Administration > Notification Overview",
      "Click Gear > Notifications > New",
      "System Notification > Email > Notifications",
    ],
    correctAnswers: [4],
    multiSelect: false,
    explanation:
      "Notification records are created in System Notification > Email > Notifications. This is where you define email templates, conditions, and recipients for system notifications.",
  },
  {
    id: 9,
    text: "What defines the different element types that can be added to a service catalog item?",
    options: [
      "Order Guides",
      "Request Types",
      "Variable Types",
      "Related Lists",
    ],
    correctAnswers: [2],
    multiSelect: false,
    explanation:
      "Variable Types define the different form elements (text fields, checkboxes, dropdowns, etc.) that can be added to catalog items and record producers.",
  },
  {
    id: 10,
    text: "What do Transform Maps do in ServiceNow?",
    options: [
      "Store history of incident records",
      "Add data to encrypted fields",
      "Trigger Business Rules before outbound Web Service",
      "Determine relationships between fields in an Import Set to fields in an existing table",
    ],
    correctAnswers: [3],
    multiSelect: false,
    explanation:
      "Transform Maps define the field mappings between an Import Set table and a target table, determining how imported data is mapped to existing fields during the transformation process.",
  },
];
