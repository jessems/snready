#!/usr/bin/env python3
"""Expand CSA questions from ~106 to ~155 across all 8 domains."""
import json
import os

BASE = "data/questions/csa"

new_questions = {
    "ui-navigation": [
        {
            "id": "csa-ui-016",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "What is the purpose of dot-walking in ServiceNow?",
            "options": [
                {"id": "a", "text": "To navigate between application menus"},
                {"id": "b", "text": "To access fields from related tables through reference fields"},
                {"id": "c", "text": "To create new database tables"},
                {"id": "d", "text": "To configure user roles and permissions"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Dot-walking collects data from related tables via reference fields. It allows you to access fields on referenced records, commonly used in form builder, form layout, list views, platform analytics, and Workflow Studio.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Dot-walking is about accessing data across related tables, not navigating menus."},
                    {"choiceId": "c", "explanation": "Table creation is done through System Definition > Tables, not dot-walking."},
                    {"choiceId": "d", "explanation": "Role configuration is done through User Administration, not dot-walking."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Lists and filters"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Dot-walking"], "tags": ["dot-walking", "reference fields", "related tables"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-017",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What happens when a system administrator configures a list view that a user has already personalized?",
            "options": [
                {"id": "a", "text": "The user's personalized view is automatically updated with the new changes"},
                {"id": "b", "text": "The user will NOT see the new default changes until they choose 'Reset to column defaults'"},
                {"id": "c", "text": "The personalized view is deleted and replaced with the new configuration"},
                {"id": "d", "text": "Both views are merged automatically"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Any global changes at the system level will not be reflected in a personalized list. The user must choose 'Reset to column defaults' to see newly added default changes.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Personalized views are independent of system-level changes and are not automatically updated."},
                    {"choiceId": "c", "explanation": "Personalized views persist until the user explicitly resets them."},
                    {"choiceId": "d", "explanation": "There is no automatic merging of personalized and system views."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Lists and filters"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Personalized lists"], "tags": ["personalize list", "column defaults", "list configuration"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-018",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "knowledge",
            "type": "multiple_select",
            "question": "Which of the following are ways to modify a form in ServiceNow? (Choose 3)",
            "options": [
                {"id": "a", "text": "Form Builder"},
                {"id": "b", "text": "Form Design"},
                {"id": "c", "text": "Form Layout"},
                {"id": "d", "text": "Form Schema"}
            ],
            "correctAnswers": ["a", "b", "c"],
            "explanation": {
                "correct": "There are three ways to modify a form in ServiceNow: Form Builder, Form Design, and Form Layout. Form Schema is not a valid form modification tool.",
                "wrongAnswers": [
                    {"choiceId": "d", "explanation": "Form Schema is not a form modification method. Schema Map is used for viewing table relationships, not form editing."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Form configuration"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Form modification methods"], "tags": ["form builder", "form design", "form layout"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-019",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "A user wants to hide certain fields on a form without affecting other users. Which feature should they use?",
            "options": [
                {"id": "a", "text": "Form Builder"},
                {"id": "b", "text": "Form Layout"},
                {"id": "c", "text": "Personalize Form"},
                {"id": "d", "text": "UI Policy"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "Personalize Form allows individual users to hide fields on a form without affecting other users. The personalized form remains each time the user logs in. Mandatory fields cannot be hidden.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Form Builder modifies the form for all users, not just the individual."},
                    {"choiceId": "b", "explanation": "Form Layout changes affect all users viewing that form."},
                    {"choiceId": "d", "explanation": "UI Policies can hide fields but affect all users matching the conditions, not just individual personalization."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Form configuration"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Personalize form"], "tags": ["personalize form", "hide fields", "individual customization"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-020",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What are the three parts of a filter condition in ServiceNow?",
            "options": [
                {"id": "a", "text": "Table, Record, and Value"},
                {"id": "b", "text": "Field, Operator, and Value"},
                {"id": "c", "text": "Column, Function, and Result"},
                {"id": "d", "text": "Source, Condition, and Target"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "A filter condition has three parts: Field (chosen based on user access, can include related tables), Operator (varies by field type, like 'greater than' for numbers), and Value (text entry or choice list based on field).",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "While tables and records are ServiceNow concepts, filter conditions are built from Field, Operator, and Value."},
                    {"choiceId": "c", "explanation": "These are not the components of a ServiceNow filter condition."},
                    {"choiceId": "d", "explanation": "These are not the components of a ServiceNow filter condition."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Lists and filters"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Filter conditions"], "tags": ["filters", "field", "operator", "value"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-021",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "Which statement about the List Editor is correct?",
            "options": [
                {"id": "a", "text": "It allows editing only one record at a time"},
                {"id": "b", "text": "It is the quickest method to update a field on multiple records"},
                {"id": "c", "text": "It overrides all security constraints"},
                {"id": "d", "text": "It is enabled for all tables by default"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The List Editor is the quickest method to update a field on multiple records, supporting both contiguous and noncontiguous editing. If a row cannot be edited due to security constraints, a message is displayed.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The List Editor supports editing multiple records simultaneously."},
                    {"choiceId": "c", "explanation": "Security constraints still apply — if a row can't be edited, a message indicates the field cannot be edited."},
                    {"choiceId": "d", "explanation": "By default, list editing is disabled or restricted for some tables."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Lists and filters"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["List editing"], "tags": ["list editor", "bulk editing", "multiple records"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ui-022",
            "certification": "csa",
            "topic": "ui-navigation",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "In Form Builder, how do you add a dot-walked field from a related table to a form?",
            "options": [
                {"id": "a", "text": "Right-click the form and select 'Add Related Field'"},
                {"id": "b", "text": "Select 'Add a Related Field' under the desired field, then drag it to the form"},
                {"id": "c", "text": "Navigate to System Definition > Tables and add the field there"},
                {"id": "d", "text": "Use the Schema Map to drag fields between tables"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "In Form Builder, to dot walk, select 'Add a Related Field' under the desired field, then drag it to the form. In the Dot Walk window, select a field from the table or navigate to a related table, then click Add to View.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "There is no right-click option for adding related fields in Form Builder."},
                    {"choiceId": "c", "explanation": "System Definition > Tables is for table management, not for adding dot-walked fields to forms."},
                    {"choiceId": "d", "explanation": "Schema Map is for visualizing relationships, not for adding fields to forms."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Form configuration"}},
            "labels": {"certification": "csa", "domain": "User Interface & Navigation", "domainSlug": "ui-navigation", "domainPercentage": 15, "subtopics": ["Form Builder dot-walking"], "tags": ["form builder", "dot-walk", "related field"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "user-administration": [
        {
            "id": "csa-ua-016",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the recommended method for assigning roles to users in ServiceNow?",
            "options": [
                {"id": "a", "text": "Assign roles directly to individual user records"},
                {"id": "b", "text": "Add users to groups and assign roles to the groups"},
                {"id": "c", "text": "Use update sets to assign roles"},
                {"id": "d", "text": "Configure roles through the CMDB"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Rather than adding roles to individual users, the recommended approach is to add the user to a group and assign the role to the group. This makes maintenance easier when people transfer to different roles in the organization.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "While possible, assigning roles directly to users makes maintenance difficult when organizational changes occur."},
                    {"choiceId": "c", "explanation": "Update sets are for migrating configuration changes between instances, not for role assignment."},
                    {"choiceId": "d", "explanation": "The CMDB tracks configuration items, not user roles."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "User access and personas"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["Role assignment best practices"], "tags": ["roles", "groups", "best practices"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-017",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What indicates that elevated privileges are activated for an administrator's session?",
            "options": [
                {"id": "a", "text": "A lock icon appears in the navigation menu"},
                {"id": "b", "text": "An upward arrow appears next to the user's avatar"},
                {"id": "c", "text": "The background color of the instance changes"},
                {"id": "d", "text": "A notification email is sent to the security team"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "An upward arrow next to your avatar indicates activated elevated privileges. These roles last only for your session and end with logout, session timeout, or user impersonation.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "There is no lock icon for elevated privileges; the indicator is an upward arrow by the avatar."},
                    {"choiceId": "c", "explanation": "The background color does not change for elevated privileges."},
                    {"choiceId": "d", "explanation": "No email notification is sent when elevating privileges."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Application and access control"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["Elevated privileges"], "tags": ["elevated privileges", "security", "admin role"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-018",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "In which order does ServiceNow evaluate access control rules?",
            "options": [
                {"id": "a", "text": "Allow rules first, then deny rules"},
                {"id": "b", "text": "Field rules first, then table rules"},
                {"id": "c", "text": "Deny rules first, then allow rules if deny conditions are met"},
                {"id": "d", "text": "All rules are evaluated simultaneously"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "The system checks deny rules first. If any deny rule conditions are unmet, access is blocked. Allow rules are evaluated only when no deny rules apply or if all deny rule criteria are satisfied.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Deny rules are checked before allow rules, not the other way around."},
                    {"choiceId": "b", "explanation": "Access controls check table access first, then field access — but deny/allow ordering is the key evaluation sequence."},
                    {"choiceId": "d", "explanation": "Rules are evaluated in a specific order: deny rules first, then allow rules."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Application and access control"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["ACL evaluation order"], "tags": ["ACL", "deny rules", "allow rules", "access control"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-019",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_select",
            "question": "Which actions can users WITHOUT any assigned roles perform in ServiceNow? (Choose 2)",
            "options": [
                {"id": "a", "text": "View a dashboard"},
                {"id": "b", "text": "Create business rules"},
                {"id": "c", "text": "Access the service catalog"},
                {"id": "d", "text": "Manage access control lists"}
            ],
            "correctAnswers": ["a", "c"],
            "explanation": {
                "correct": "Users without any assigned roles can still log in and access common actions such as viewing a dashboard, accessing the service catalog, viewing knowledge articles, and taking surveys. These are often referred to as self-service users.",
                "wrongAnswers": [
                    {"choiceId": "b", "explanation": "Creating business rules requires administrative roles."},
                    {"choiceId": "d", "explanation": "Managing ACLs requires the security_admin role."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "User access and personas"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["Self-service users"], "tags": ["self-service", "no roles", "user access"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-020",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "Which statement about user impersonation is TRUE?",
            "options": [
                {"id": "a", "text": "Any user can impersonate another user"},
                {"id": "b", "text": "Impersonation allows access to security incidents even if you don't have those roles"},
                {"id": "c", "text": "Only users with the admin or impersonator role can impersonate other users"},
                {"id": "d", "text": "Impersonation persists across multiple login sessions"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "Only admins and users with the impersonator role can impersonate other users to test their access. When impersonating a user with a specific admin role, you cannot access certain features like security incidents unless you already have those roles.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Only users with the admin or impersonator role can impersonate others."},
                    {"choiceId": "b", "explanation": "When impersonating, you cannot access features like security incidents unless you already have those specific roles."},
                    {"choiceId": "d", "explanation": "Impersonation does not persist across login sessions."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "User access and personas"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["User impersonation"], "tags": ["impersonation", "admin role", "testing access"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-021",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "A user has the catalog_admin role. What access does this provide?",
            "options": [
                {"id": "a", "text": "Only access to the Service Catalog application"},
                {"id": "b", "text": "Only access to user criteria modules"},
                {"id": "c", "text": "Access to all Service Catalog and user criteria modules, plus additional catalog_admin permissions"},
                {"id": "d", "text": "Full admin access to all platform features"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "The catalog_admin role includes permissions from both user_criteria_admin and catalog roles, providing access to all applications and modules of both roles plus any permissions specific to catalog_admin.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "catalog_admin includes more than just the catalog role — it also contains user_criteria_admin permissions."},
                    {"choiceId": "b", "explanation": "catalog_admin includes user criteria access but also catalog and additional permissions."},
                    {"choiceId": "d", "explanation": "catalog_admin provides access to catalog-related features, not full admin access."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "User access and personas"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["Role inheritance"], "tags": ["catalog_admin", "role inheritance", "permissions"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ua-022",
            "certification": "csa",
            "topic": "user-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is the purpose of the ServiceNow Security Center?",
            "options": [
                {"id": "a", "text": "To manage user passwords and authentication only"},
                {"id": "b", "text": "To monitor security compliance, manage hardening settings, and run security scans"},
                {"id": "c", "text": "To configure firewalls and network security"},
                {"id": "d", "text": "To create and manage encryption keys"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "ServiceNow Security Center is a built-in tool that helps system administrators manage and improve instance security. It includes hardening checks, security scanning, customer actions, notifications, and compliance scoring.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Security Center covers much more than passwords — it includes hardening, scanning, compliance, and metrics."},
                    {"choiceId": "c", "explanation": "Security Center focuses on instance security settings, not network infrastructure."},
                    {"choiceId": "d", "explanation": "Encryption key management is not the primary purpose of Security Center."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "ServiceNow Security Center"}},
            "labels": {"certification": "csa", "domain": "User Administration & Security", "domainSlug": "user-administration", "domainPercentage": 15, "subtopics": ["Security Center"], "tags": ["security center", "hardening", "compliance"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "database-administration": [
        {
            "id": "csa-db-013",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is the unique identifier for every record in ServiceNow?",
            "options": [
                {"id": "a", "text": "A record number (e.g., INC0010001)"},
                {"id": "b", "text": "A 32-character sys_id"},
                {"id": "c", "text": "A combination of table name and row number"},
                {"id": "d", "text": "An auto-generated UUID"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Every record in ServiceNow has a unique 32-character ID called a sys_id. Record numbers can auto-increment and their format can be changed, but the sys_id is the true unique identifier.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Record numbers like INC0010001 are display values that can be reformatted; the sys_id is the true unique identifier."},
                    {"choiceId": "c", "explanation": "ServiceNow uses a 32-character sys_id, not a table name/row number combination."},
                    {"choiceId": "d", "explanation": "While similar in concept, ServiceNow specifically uses a 32-character sys_id, not a standard UUID format."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Manage data"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["sys_id"], "tags": ["sys_id", "unique identifier", "records"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-db-014",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the difference between a base table and a core table in ServiceNow?",
            "options": [
                {"id": "a", "text": "A base table is always a core table, but a core table is not always a base table"},
                {"id": "b", "text": "A base table serves as a foundation for extensions and is not itself an extension, while a core table comes with ServiceNow from the start"},
                {"id": "c", "text": "Base tables cannot have child tables, while core tables can"},
                {"id": "d", "text": "There is no difference; the terms are interchangeable"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "A core table comes with ServiceNow (existing from the start) and can be a parent, child, or base table. A base table serves as a foundation for other tables but isn't itself an extension. A table can be both core and base.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "A base table is not always a core table — custom tables can also be base tables."},
                    {"choiceId": "c", "explanation": "Base tables can and often do have child tables — that's their primary purpose."},
                    {"choiceId": "d", "explanation": "The terms have distinct meanings: core refers to origin (built-in), base refers to hierarchy (foundation)."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Manage data"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["Table types"], "tags": ["base table", "core table", "table hierarchy"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-db-015",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_select",
            "question": "Which of the following are types of field relationships in ServiceNow? (Choose 2)",
            "options": [
                {"id": "a", "text": "One-to-many (Reference field)"},
                {"id": "b", "text": "Many-to-many"},
                {"id": "c", "text": "One-to-one-to-many"},
                {"id": "d", "text": "Circular reference"}
            ],
            "correctAnswers": ["a", "b"],
            "explanation": {
                "correct": "ServiceNow supports one-to-many relationships (using reference fields like Caller on Incident linking to User) and many-to-many relationships (connecting two or more tables so related records are visible in both, like students and classes).",
                "wrongAnswers": [
                    {"choiceId": "c", "explanation": "One-to-one-to-many is not a standard relationship type in ServiceNow."},
                    {"choiceId": "d", "explanation": "Circular reference is not a defined relationship type in ServiceNow's data model."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Manage data"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["Table relationships"], "tags": ["one-to-many", "many-to-many", "reference field"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-db-016",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "What is the purpose of coalescing during a data import in ServiceNow?",
            "options": [
                {"id": "a", "text": "To merge multiple import set tables into one"},
                {"id": "b", "text": "To prevent duplicate records by using fields as unique keys"},
                {"id": "c", "text": "To convert data types during transformation"},
                {"id": "d", "text": "To automatically map fields between source and target tables"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Coalesce prevents duplicate records during data import. It makes a field act as a unique key — if a match is found, the existing record is updated; if unmatched, a new record is created. Without coalescing, all imported rows are treated as new records.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Coalescing is about preventing duplicates in the target table, not merging import set tables."},
                    {"choiceId": "c", "explanation": "Data type conversion is handled by the transform map, not coalescing."},
                    {"choiceId": "d", "explanation": "Automatic field mapping is done by the mapping utility, not coalescing."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Import data"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["Import sets and coalescing"], "tags": ["coalesce", "import sets", "data import", "duplicates"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-db-017",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What do update sets capture in ServiceNow?",
            "options": [
                {"id": "a", "text": "Both configuration changes and data records like incidents"},
                {"id": "b", "text": "Only data records created during the update set period"},
                {"id": "c", "text": "Configuration and customization changes, but NOT data records"},
                {"id": "d", "text": "Only changes made by administrators with elevated privileges"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "Update sets capture customization or configuration changes like report definitions, but not actual data records. New incidents or change records are not included. To move data records, use the Export XML function.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Update sets do NOT capture data records like incidents or change requests — only configuration changes."},
                    {"choiceId": "b", "explanation": "Update sets capture configuration changes, not data records."},
                    {"choiceId": "d", "explanation": "Update sets capture all configuration changes regardless of whether elevated privileges were used."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Migration and integration"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["Update sets"], "tags": ["update sets", "configuration", "migration"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-db-018",
            "certification": "csa",
            "topic": "database-administration",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the difference between global scope and application scope in ServiceNow?",
            "options": [
                {"id": "a", "text": "Global scope is for production only; application scope is for development"},
                {"id": "b", "text": "Global scope has access to all parts of the system; scoped apps are sandboxed with restricted API access"},
                {"id": "c", "text": "Application scope provides more permissions than global scope"},
                {"id": "d", "text": "There is no functional difference between the two"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Scoped apps are sandboxed from the system at large and use a restricted API to minimize damage outside their scope. Global apps are the default scope and have access to all parts of the system, which means they can potentially cause impact beyond their intent.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Both scopes can be used in any instance type, not limited to production or development."},
                    {"choiceId": "c", "explanation": "Global scope has broader access; application scope is intentionally restricted."},
                    {"choiceId": "d", "explanation": "There is a significant functional difference in access and security between the two."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Manage data"}},
            "labels": {"certification": "csa", "domain": "Database Administration", "domainSlug": "database-administration", "domainPercentage": 12, "subtopics": ["Application scoping"], "tags": ["global scope", "application scope", "sandboxing"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "self-service-automation": [
        {
            "id": "csa-ss-016",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is a Record Producer in ServiceNow?",
            "options": [
                {"id": "a", "text": "A tool for generating reports from service catalog data"},
                {"id": "b", "text": "A catalog item that creates task-based records like incidents through a simplified interface"},
                {"id": "c", "text": "A script that automatically generates records on a schedule"},
                {"id": "d", "text": "A dashboard widget for monitoring record creation rates"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "A Record Producer is a catalog item that lets users create task-based records (like incidents) more easily than using a standard form. It appears similar to other catalog items but generates task records instead.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Record Producers create records, not reports."},
                    {"choiceId": "c", "explanation": "Record Producers are user-facing catalog items, not automated scripts."},
                    {"choiceId": "d", "explanation": "Record Producers are not dashboard widgets."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Service Catalog"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Record producers"], "tags": ["record producer", "service catalog", "task records"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-017",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the purpose of a Variable Set in the Service Catalog?",
            "options": [
                {"id": "a", "text": "To define the pricing structure for catalog items"},
                {"id": "b", "text": "To group variables so they can be shared across multiple catalog items"},
                {"id": "c", "text": "To set environment variables for server-side scripts"},
                {"id": "d", "text": "To configure variable-width columns in list views"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Variable Sets group variables together so they can be reused across multiple catalog items, saving time and reducing errors. Updates to a Variable Set automatically apply to all associated items.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Variable Sets group form questions/options, not pricing structures."},
                    {"choiceId": "c", "explanation": "Variable Sets are for catalog item form variables, not server-side environment variables."},
                    {"choiceId": "d", "explanation": "Variable Sets are a Service Catalog concept, not related to list view columns."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Service Catalog"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Variable sets"], "tags": ["variable set", "service catalog", "reusable variables"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-018",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "What determines the display order of variables on a catalog item form?",
            "options": [
                {"id": "a", "text": "The alphabetical order of variable names"},
                {"id": "b", "text": "The order field value — lower numbers show first"},
                {"id": "c", "text": "The date each variable was created"},
                {"id": "d", "text": "The variable type determines the order"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The order field sets the display sequence for variables on a catalog item form. Lower numbers show first.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Variables are ordered by the Order field value, not alphabetically."},
                    {"choiceId": "c", "explanation": "Creation date does not determine display order."},
                    {"choiceId": "d", "explanation": "Variable type does not determine the order; the Order field does."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Service Catalog"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Catalog variables"], "tags": ["variable order", "catalog item", "display sequence"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-019",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is the function of a trigger in Workflow Studio?",
            "options": [
                {"id": "a", "text": "It defines the output format of a workflow"},
                {"id": "b", "text": "It is an activity that initiates the flow, such as a record creation or scheduled job"},
                {"id": "c", "text": "It specifies which users can run the workflow"},
                {"id": "d", "text": "It controls the error handling behavior of a flow"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "A trigger is an activity that initiates a flow. Triggers can be based on records (e.g., record created in a specified table), dates, or applications. A spoke contains specific triggers and actions for an application.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Triggers initiate flows, they don't define output formats."},
                    {"choiceId": "c", "explanation": "User access to workflows is managed through roles, not triggers."},
                    {"choiceId": "d", "explanation": "Error handling is managed through flow error paths, not triggers."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Workflow automation"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Workflow Studio triggers"], "tags": ["trigger", "workflow studio", "flow"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-020",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "comprehension",
            "type": "multiple_select",
            "question": "Which are core actions available in Workflow Studio? (Choose 2)",
            "options": [
                {"id": "a", "text": "Ask For Approval"},
                {"id": "b", "text": "Send SMS"},
                {"id": "c", "text": "Create Record"},
                {"id": "d", "text": "Generate PDF"}
            ],
            "correctAnswers": ["a", "c"],
            "explanation": {
                "correct": "Core actions in Workflow Studio include Ask For Approval, Create Record, Delete Record, Lookup Record, and Wait for Condition. Additional application-specific actions are available through spokes.",
                "wrongAnswers": [
                    {"choiceId": "b", "explanation": "Send SMS is not listed as a core action in Workflow Studio."},
                    {"choiceId": "d", "explanation": "Generate PDF is not a core Workflow Studio action."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Workflow automation"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Workflow Studio actions"], "tags": ["core actions", "workflow studio", "ask for approval", "create record"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-021",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What does the 'match all' checkbox control on a knowledge base's user criteria?",
            "options": [
                {"id": "a", "text": "Whether all articles in the knowledge base require approval"},
                {"id": "b", "text": "Whether all criteria must match (checked) or any criteria grants access (unchecked)"},
                {"id": "c", "text": "Whether all users can contribute to the knowledge base"},
                {"id": "d", "text": "Whether all knowledge bases share the same user criteria"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The 'match all' checkbox determines access: when checked, all criteria must match for access; when unchecked, matching any criteria grants access. By default, it is unchecked.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The 'match all' checkbox controls user criteria matching, not article approval."},
                    {"choiceId": "c", "explanation": "Contribution access is controlled by 'can contribute' user criteria, not the 'match all' checkbox."},
                    {"choiceId": "d", "explanation": "Each knowledge base has its own user criteria settings."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configure Self Service"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Knowledge management user criteria"], "tags": ["knowledge base", "user criteria", "match all"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-ss-022",
            "certification": "csa",
            "topic": "self-service-automation",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What happens if no user criteria are set on a knowledge base's 'can read' related list?",
            "options": [
                {"id": "a", "text": "Only administrators can read the articles"},
                {"id": "b", "text": "The knowledge base becomes open to the public"},
                {"id": "c", "text": "Only users with the knowledge role can read articles"},
                {"id": "d", "text": "The knowledge base is hidden from all users"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "If there is no user criteria on the 'can read' related list, then the knowledge base becomes open to the public. To restrict access, administrators must add appropriate user criteria.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Without user criteria, access is not restricted to administrators — it's open to everyone."},
                    {"choiceId": "c", "explanation": "The knowledge role is not required when no user criteria are set."},
                    {"choiceId": "d", "explanation": "Without criteria, the knowledge base is visible to all, not hidden."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configure Self Service"}},
            "labels": {"certification": "csa", "domain": "Self-Service & Automation", "domainSlug": "self-service-automation", "domainPercentage": 15, "subtopics": ["Knowledge base access"], "tags": ["knowledge base", "can read", "public access"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "incident-management": [
        {
            "id": "csa-im-013",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "A system administrator wants to automatically set the category, priority, and assignment group for incoming incidents based on their short description. Which feature should they configure?",
            "options": [
                {"id": "a", "text": "Business Rules"},
                {"id": "b", "text": "Predictive Intelligence"},
                {"id": "c", "text": "Flow Designer"},
                {"id": "d", "text": "UI Policies"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Predictive Intelligence uses machine learning to automatically set the category, priority, and assignment for an incident from its short description, saving time and ensuring proper handling.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "While business rules can set field values, Predictive Intelligence specifically uses ML to intelligently categorize based on short description content."},
                    {"choiceId": "c", "explanation": "Flow Designer automates workflows but doesn't use ML for field prediction."},
                    {"choiceId": "d", "explanation": "UI Policies control form behavior (show/hide/mandatory), not automatic field population using ML."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Additional configurations"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["Predictive Intelligence"], "tags": ["predictive intelligence", "machine learning", "auto-categorization"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-im-014",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "Which ServiceNow feature allows agents to have real-time discussions about a specific incident record?",
            "options": [
                {"id": "a", "text": "Activity Stream comments"},
                {"id": "b", "text": "Sidebar discussions"},
                {"id": "c", "text": "Email notifications"},
                {"id": "d", "text": "Knowledge base articles"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Sidebar discussions help share information to solve issues quickly. When a sidebar discussion is created, a tile appears in the activity stream. Users with access to the task record can join the discussion.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Activity Stream comments are recorded entries, not real-time chat discussions."},
                    {"choiceId": "c", "explanation": "Email notifications alert users but don't provide real-time discussion capabilities."},
                    {"choiceId": "d", "explanation": "Knowledge articles are static reference materials, not discussion tools."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Additional configurations"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["Sidebar discussions"], "tags": ["sidebar", "discussions", "collaboration"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-im-015",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the primary purpose of the CMDB Dependency View in relation to incident management?",
            "options": [
                {"id": "a", "text": "To automatically create incidents for failing CIs"},
                {"id": "b", "text": "To visualize relationships between configuration items and understand impact of issues"},
                {"id": "c", "text": "To assign incidents to the correct support group"},
                {"id": "d", "text": "To generate SLA reports for incident resolution"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The Dependency View map helps visualize relationships between configuration items in your infrastructure, showing upstream and downstream dependencies. Icons indicate if a CI has active or pending issues, helping improve incident management processes.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The Dependency View visualizes relationships but doesn't automatically create incidents."},
                    {"choiceId": "c", "explanation": "Assignment is handled through assignment rules, not the Dependency View."},
                    {"choiceId": "d", "explanation": "SLA reports are generated through reporting tools, not the Dependency View."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configuration Management Database"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["CMDB and incident management"], "tags": ["CMDB", "dependency view", "impact analysis"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-im-016",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What information does the Now Assist Admin Console provide?",
            "options": [
                {"id": "a", "text": "Only incident management analytics"},
                {"id": "b", "text": "AI features management and configuration across the ServiceNow platform"},
                {"id": "c", "text": "User administration and role management"},
                {"id": "d", "text": "CMDB health monitoring only"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The Now Assist Admin Console lets administrators use and manage AI features across the ServiceNow platform, including capabilities like predictive intelligence for incident management.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Now Assist covers AI features across the platform, not just incident analytics."},
                    {"choiceId": "c", "explanation": "User administration is handled through User Administration modules, not Now Assist."},
                    {"choiceId": "d", "explanation": "CMDB health monitoring has its own dedicated tools separate from Now Assist."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Additional configurations"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["Now Assist"], "tags": ["now assist", "AI", "admin console"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-im-017",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "An administrator needs to notify the IT Product Owner whenever a Priority 1 incident is created. Which module should they use?",
            "options": [
                {"id": "a", "text": "System Properties > Email"},
                {"id": "b", "text": "System Notification > Email > Notifications"},
                {"id": "c", "text": "System Policy > Events"},
                {"id": "d", "text": "System Logs > Email Log"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "To create a new email notification, navigate to All > System Notification > Email > Notifications. From there, administrators can specify when to send the notification, who receives it, and what content is included.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "System Properties > Email is for configuring email settings, not creating notification rules."},
                    {"choiceId": "c", "explanation": "Events are triggers but the notification configuration itself is done through System Notification."},
                    {"choiceId": "d", "explanation": "Email Log is for viewing sent emails, not creating notifications."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Notifications"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["Email notifications"], "tags": ["notifications", "email", "P1 incidents"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-im-018",
            "certification": "csa",
            "topic": "incident-management",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "Which workspace facilitates IT service management workflows for managing tasks like incidents and requests?",
            "options": [
                {"id": "a", "text": "Employee Center Portal"},
                {"id": "b", "text": "Service Operations Workspace"},
                {"id": "c", "text": "CMDB Workspace"},
                {"id": "d", "text": "Customer Service Portal"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The Service Operations Workspace facilitates IT service management workflows by managing tasks like incidents and requests. Employee Center Portal is for employee self-service needs.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Employee Center Portal is a hub for employee needs across departments, not specifically for ITSM workflows."},
                    {"choiceId": "c", "explanation": "CMDB Workspace is focused on configuration management, not general ITSM task management."},
                    {"choiceId": "d", "explanation": "Customer Service Portal is for customer-facing support, not internal ITSM workflows."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Explore the modernized work experience"}},
            "labels": {"certification": "csa", "domain": "Incident Management", "domainSlug": "incident-management", "domainPercentage": 12, "subtopics": ["Service Operations Workspace"], "tags": ["workspace", "service operations", "ITSM"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "problem-management": [
        {
            "id": "csa-pm-009",
            "certification": "csa",
            "topic": "problem-management",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "How does the CMDB support problem management processes?",
            "options": [
                {"id": "a", "text": "By automatically resolving problems when CIs are updated"},
                {"id": "b", "text": "By providing insights for troubleshooting through CI relationships and dependencies"},
                {"id": "c", "text": "By creating problem records whenever a CI is added"},
                {"id": "d", "text": "By generating root cause analysis reports automatically"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The CMDB stores information about all components of an information system. Every service management process involves the CMDB. If there's an issue and you need to find the root cause, the CMDB provides valuable insights for troubleshooting through CI relationships.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The CMDB provides information for troubleshooting but doesn't automatically resolve problems."},
                    {"choiceId": "c", "explanation": "Adding a CI doesn't automatically create problem records."},
                    {"choiceId": "d", "explanation": "Root cause analysis requires human investigation; the CMDB provides data to support it."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configuration Management Database"}},
            "labels": {"certification": "csa", "domain": "Problem Management", "domainSlug": "problem-management", "domainPercentage": 8, "subtopics": ["CMDB in problem management"], "tags": ["CMDB", "problem management", "root cause", "troubleshooting"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-pm-010",
            "certification": "csa",
            "topic": "problem-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What does ServiceNow Service Mapping use to identify dependencies between applications and hosts?",
            "options": [
                {"id": "a", "text": "A bottom-up scanning approach starting from network devices"},
                {"id": "b", "text": "A top-down approach that maps interconnected applications and hosts delivering a service"},
                {"id": "c", "text": "Manual entry by administrators for each CI relationship"},
                {"id": "d", "text": "Import sets from external monitoring tools"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Service Mapping identifies and maps dependencies between interconnected applications and hosts that deliver a service using a top-down approach. This helps visualize the impact of issues within a service, enhancing CMDB awareness of service connections.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Discovery uses a horizontal method that inventories devices independently. Service Mapping uses a top-down approach."},
                    {"choiceId": "c", "explanation": "Service Mapping automatically discovers and maps dependencies rather than requiring manual entry."},
                    {"choiceId": "d", "explanation": "Service Mapping works within ServiceNow, not through imported data from external tools."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configuration Management Database"}},
            "labels": {"certification": "csa", "domain": "Problem Management", "domainSlug": "problem-management", "domainPercentage": 8, "subtopics": ["Service Mapping"], "tags": ["service mapping", "top-down", "dependencies"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-pm-011",
            "certification": "csa",
            "topic": "problem-management",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "A database server failure causes an HR requisition system to stop working. Which CMDB feature would best help identify all affected services?",
            "options": [
                {"id": "a", "text": "CI Class Manager"},
                {"id": "b", "text": "Schema Map"},
                {"id": "c", "text": "Dependency View map"},
                {"id": "d", "text": "Tables and Columns module"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "The Dependency View map shows upstream and downstream dependencies between configuration items. It would show that losing the database server affects the application, which in turn disrupts services like the HR requisition system.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "CI Class Manager shows the class hierarchy and metadata, not runtime dependencies."},
                    {"choiceId": "b", "explanation": "Schema Map shows table relationships in the database, not CI dependencies."},
                    {"choiceId": "d", "explanation": "Tables and Columns module shows database structure, not service dependencies."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configuration Management Database"}},
            "labels": {"certification": "csa", "domain": "Problem Management", "domainSlug": "problem-management", "domainPercentage": 8, "subtopics": ["Impact analysis"], "tags": ["dependency view", "impact analysis", "CMDB", "service dependencies"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-pm-012",
            "certification": "csa",
            "topic": "problem-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is the difference between Discovery and Service Mapping in ServiceNow?",
            "options": [
                {"id": "a", "text": "Discovery maps service dependencies; Service Mapping inventories devices"},
                {"id": "b", "text": "Discovery inventories devices independently (horizontal); Service Mapping maps service dependencies (top-down)"},
                {"id": "c", "text": "Discovery is for cloud resources; Service Mapping is for on-premise only"},
                {"id": "d", "text": "They are the same feature with different names"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Discovery employs a horizontal method that inventories devices as independent objects without detailing their interconnections. Service Mapping uses a top-down approach to identify and map dependencies between interconnected applications and hosts delivering a service.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "This reverses the descriptions — Discovery inventories devices, Service Mapping maps dependencies."},
                    {"choiceId": "c", "explanation": "Both Discovery and Service Mapping work with cloud and on-premise resources."},
                    {"choiceId": "d", "explanation": "They serve different purposes: Discovery for device inventory, Service Mapping for dependency visualization."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configuration Management Database"}},
            "labels": {"certification": "csa", "domain": "Problem Management", "domainSlug": "problem-management", "domainPercentage": 8, "subtopics": ["Discovery vs Service Mapping"], "tags": ["discovery", "service mapping", "horizontal", "top-down"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "change-management": [
        {
            "id": "csa-cm-011",
            "certification": "csa",
            "topic": "change-management",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "An update set has been marked as 'Complete' but additional changes are needed. What is the recommended approach?",
            "options": [
                {"id": "a", "text": "Revert the update set back to 'In Progress' and make the changes"},
                {"id": "b", "text": "Create a new update set and commit them in the order they were created"},
                {"id": "c", "text": "Delete the completed update set and start over"},
                {"id": "d", "text": "Merge the changes directly into the default update set"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Once an update set is marked as complete, don't revert it back to in-progress. Instead, start a new update set and commit them in the order they were created. Use naming conventions like 'Performance Enhancements' and 'Performance Enhancements 2' to keep them organized.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Best practice is to NOT revert a completed update set back to in-progress."},
                    {"choiceId": "c", "explanation": "Deleting a completed update set loses the captured changes. Create a new one instead."},
                    {"choiceId": "d", "explanation": "The default update set should not be used for moving customizations between instances."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Migration and integration"}},
            "labels": {"certification": "csa", "domain": "Change Management", "domainSlug": "change-management", "domainPercentage": 10, "subtopics": ["Update set best practices"], "tags": ["update sets", "complete", "best practices"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-cm-012",
            "certification": "csa",
            "topic": "change-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "How many instances does a ServiceNow customer receive at minimum?",
            "options": [
                {"id": "a", "text": "One (production only)"},
                {"id": "b", "text": "Two (production and non-production)"},
                {"id": "c", "text": "Three (production, staging, and development)"},
                {"id": "d", "text": "Four (production, test, development, and QA)"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Customers receive at least two instances: production and non-production. They can add more for tasks like testing, development, or quality assurance.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Customers receive at least two instances, not one."},
                    {"choiceId": "c", "explanation": "The minimum is two instances. Additional instances can be added but are not included by default."},
                    {"choiceId": "d", "explanation": "Four instances are not the minimum; the minimum is two."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Explore the power of the ServiceNow Platform"}},
            "labels": {"certification": "csa", "domain": "Change Management", "domainSlug": "change-management", "domainPercentage": 10, "subtopics": ["Instance architecture"], "tags": ["instances", "production", "non-production"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-cm-013",
            "certification": "csa",
            "topic": "change-management",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What architecture does ServiceNow use for its instances?",
            "options": [
                {"id": "a", "text": "Multi-instance multi-tenant"},
                {"id": "b", "text": "Single-instance multi-tenant"},
                {"id": "c", "text": "Multi-instance single-tenant"},
                {"id": "d", "text": "Single-instance single-tenant"}
            ],
            "correctAnswers": ["c"],
            "explanation": {
                "correct": "ServiceNow uses a multi-instance single-tenant architecture, meaning each instance has its own isolated database. Each instance is hosted at a ServiceNow data center with a unique URL.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "ServiceNow is single-tenant (each customer has isolated instances), not multi-tenant."},
                    {"choiceId": "b", "explanation": "ServiceNow provides multiple instances per customer (multi-instance) with single tenancy."},
                    {"choiceId": "d", "explanation": "Customers receive multiple instances (at least 2), so it is multi-instance."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Explore the power of the ServiceNow Platform"}},
            "labels": {"certification": "csa", "domain": "Change Management", "domainSlug": "change-management", "domainPercentage": 10, "subtopics": ["Platform architecture"], "tags": ["multi-instance", "single-tenant", "architecture"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-cm-014",
            "certification": "csa",
            "topic": "change-management",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the purpose of the Change Advisory Board (CAB) Workbench?",
            "options": [
                {"id": "a", "text": "To automatically approve all change requests"},
                {"id": "b", "text": "To help CAB managers schedule and manage meetings to review and authorize change requests"},
                {"id": "c", "text": "To create new change request templates"},
                {"id": "d", "text": "To generate reports on historical change success rates"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "The Change Advisory Board Workbench helps CAB managers schedule and manage meetings to review and authorize change requests.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The CAB Workbench facilitates review meetings; it doesn't automatically approve changes."},
                    {"choiceId": "c", "explanation": "Change templates are created through the change management module, not the CAB Workbench."},
                    {"choiceId": "d", "explanation": "While reporting is available, the primary purpose is managing CAB review meetings."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Configure Self Service"}},
            "labels": {"certification": "csa", "domain": "Change Management", "domainSlug": "change-management", "domainPercentage": 10, "subtopics": ["CAB Workbench"], "tags": ["CAB", "change advisory board", "change authorization"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-cm-015",
            "certification": "csa",
            "topic": "change-management",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "When merging multiple update sets, how does ServiceNow handle conflicts where the same object was modified?",
            "options": [
                {"id": "a", "text": "It rejects the merge entirely"},
                {"id": "b", "text": "It keeps the latest change to the object"},
                {"id": "c", "text": "It prompts the admin to choose which version to keep"},
                {"id": "d", "text": "It creates a new version combining both changes"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "When merging update sets, the latest change to an object is kept. This is why it's important to commit update sets in the order they were created.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The merge is not rejected; the system handles conflicts by keeping the latest change."},
                    {"choiceId": "c", "explanation": "The system automatically keeps the latest change rather than prompting for selection."},
                    {"choiceId": "d", "explanation": "ServiceNow doesn't merge the content of both changes; it keeps the latest one."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Migration and integration"}},
            "labels": {"certification": "csa", "domain": "Change Management", "domainSlug": "change-management", "domainPercentage": 10, "subtopics": ["Update set merging"], "tags": ["update sets", "merge", "conflicts"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ],
    "reporting-dashboards": [
        {
            "id": "csa-rd-014",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "Where can you access the collection of data visualizations in ServiceNow?",
            "options": [
                {"id": "a", "text": "All > System Definition > Visualizations"},
                {"id": "b", "text": "All > Platform Analytics > Library > Data Visualizations"},
                {"id": "c", "text": "All > Reports > Chart Builder"},
                {"id": "d", "text": "All > System UI > Visualizations"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Navigate to All > Platform Analytics > Library > Data Visualizations to access the collection of visualizations. You can use these to create custom visuals.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "System Definition is for tables and scripts, not visualizations."},
                    {"choiceId": "c", "explanation": "This is not the correct navigation path for data visualizations."},
                    {"choiceId": "d", "explanation": "System UI is for UI components, not analytics visualizations."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Data visualizations navigation"], "tags": ["platform analytics", "visualizations", "navigation"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-015",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What is the recommended best practice when creating a new visualization?",
            "options": [
                {"id": "a", "text": "Always start from scratch for maximum customization"},
                {"id": "b", "text": "Duplicate an existing visualization and edit the copy to fit your needs"},
                {"id": "c", "text": "Import visualization templates from the ServiceNow Store"},
                {"id": "d", "text": "Use only the default visualizations provided by ServiceNow"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "It's best practice to duplicate an existing visualization, then edit your copy to fit your needs. It's often easier to build charts starting from a filtered list or existing visualization where configuration options are pre-provided.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Starting from scratch is more time-consuming; duplicating an existing visualization is recommended."},
                    {"choiceId": "c", "explanation": "While templates exist, the recommended approach is to duplicate existing visualizations."},
                    {"choiceId": "d", "explanation": "Customization is encouraged; you're not limited to default visualizations."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Visualization best practices"], "tags": ["visualization", "best practices", "duplicate"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-016",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "knowledge",
            "type": "multiple_choice",
            "question": "What is the key difference between one-time reporting and Performance Analytics?",
            "options": [
                {"id": "a", "text": "One-time reporting is more accurate than Performance Analytics"},
                {"id": "b", "text": "One-time reporting shows current state; Performance Analytics reveals trends over time"},
                {"id": "c", "text": "Performance Analytics only works with incident data"},
                {"id": "d", "text": "One-time reporting requires a separate license"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "One-time reporting shows 'where are we today?' while Performance Analytics reveals trends over time. PA captures regular snapshots to show accurate historical trends, helping to review indicators, monitor metrics, and improve decisions.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "Both provide accurate data; the difference is point-in-time vs. trending over time."},
                    {"choiceId": "c", "explanation": "Performance Analytics works with any ServiceNow data, not just incidents."},
                    {"choiceId": "d", "explanation": "One-time reporting is included in the base platform."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Performance Analytics vs reporting"], "tags": ["performance analytics", "reporting", "trends"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-017",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "application",
            "type": "multiple_choice",
            "question": "How do you add a visualization to a dashboard in ServiceNow?",
            "options": [
                {"id": "a", "text": "Drag and drop from the visualization library only"},
                {"id": "b", "text": "Either create a dashboard first and add visualizations, or save a visualization and select 'Add to Dashboard'"},
                {"id": "c", "text": "Visualizations are automatically added to the default dashboard"},
                {"id": "d", "text": "Export the visualization and import it into the dashboard"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "You can either create a dashboard first and add the visualization as an element, or save the visualization and select 'Add to Dashboard' for a new or existing dashboard.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "While drag and drop is available, you can also use 'Add to Dashboard' from a saved visualization."},
                    {"choiceId": "c", "explanation": "Visualizations are not automatically added to any dashboard."},
                    {"choiceId": "d", "explanation": "There is no export/import process needed — you can add directly."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Dashboard management"], "tags": ["dashboard", "add visualization", "analytics"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-018",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "knowledge",
            "type": "multiple_select",
            "question": "Which configuration options are available in the Visualization Designer? (Choose 2)",
            "options": [
                {"id": "a", "text": "Data source selection (predefined or ServiceNow table)"},
                {"id": "b", "text": "Automatic email scheduling of visualizations"},
                {"id": "c", "text": "Chart type selection (over 20 types available)"},
                {"id": "d", "text": "Integration with external BI tools"}
            ],
            "correctAnswers": ["a", "c"],
            "explanation": {
                "correct": "In the Visualization Designer, you can choose where your data comes from (predefined data source or ServiceNow table) and pick from over 20 chart types. Other options include Group By/Sorting and Presentation customization.",
                "wrongAnswers": [
                    {"choiceId": "b", "explanation": "Email scheduling is configured separately, not directly in the Visualization Designer."},
                    {"choiceId": "d", "explanation": "The Visualization Designer works within ServiceNow, not with external BI tools."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Visualization Designer options"], "tags": ["visualization designer", "data source", "chart types"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-019",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "knowledge",
            "type": "multiple_select",
            "question": "Which visualization types are available in ServiceNow? (Choose 3)",
            "options": [
                {"id": "a", "text": "Speedometer"},
                {"id": "b", "text": "Bubble chart"},
                {"id": "c", "text": "Gantt chart"},
                {"id": "d", "text": "Semi-donut"},
                {"id": "e", "text": "Waterfall chart"}
            ],
            "correctAnswers": ["a", "b", "d"],
            "explanation": {
                "correct": "ServiceNow offers various visualization types including speedometer, dial, single score, pie, semi-donut, bubble, and text analytics, among others.",
                "wrongAnswers": [
                    {"choiceId": "c", "explanation": "Gantt charts are not listed among the standard ServiceNow visualization types."},
                    {"choiceId": "e", "explanation": "Waterfall charts are not listed among the standard ServiceNow visualization types."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Visualization types"], "tags": ["visualization types", "speedometer", "bubble", "semi-donut"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        },
        {
            "id": "csa-rd-020",
            "certification": "csa",
            "topic": "reporting-dashboards",
            "cognitiveLevel": "comprehension",
            "type": "multiple_choice",
            "question": "What are the two types of dashboards in ServiceNow?",
            "options": [
                {"id": "a", "text": "Static and dynamic"},
                {"id": "b", "text": "Responsive and non-responsive"},
                {"id": "c", "text": "Personal and shared"},
                {"id": "d", "text": "Basic and advanced"}
            ],
            "correctAnswers": ["b"],
            "explanation": {
                "correct": "Dashboards can be responsive or non-responsive. Non-responsive dashboards have limits on who can create, view, and edit them.",
                "wrongAnswers": [
                    {"choiceId": "a", "explanation": "The classification is responsive vs non-responsive, not static vs dynamic."},
                    {"choiceId": "c", "explanation": "While dashboards can be shared, the types are responsive and non-responsive."},
                    {"choiceId": "d", "explanation": "The types are responsive and non-responsive, not basic and advanced."}
                ]
            },
            "isFree": False,
            "source": {"type": "course", "course": {"courseSlug": "servicenow-administration-fundamentals-xanadu", "lessonTitle": "Platform Analytics experience"}},
            "labels": {"certification": "csa", "domain": "Reporting & Dashboards", "domainSlug": "reporting-dashboards", "domainPercentage": 13, "subtopics": ["Dashboard types"], "tags": ["dashboard", "responsive", "non-responsive"]},
            "meta": {"generatedAt": "2026-03-16T02:00:00Z", "version": "1.1", "release": "Xanadu", "reviewed": False}
        }
    ]
}

# Now update each file
for domain, questions in new_questions.items():
    filepath = f"{BASE}/{domain}.json"
    data = json.load(open(filepath))
    existing = data.get('questions', data)
    existing.extend(questions)
    if 'questions' in data:
        data['questions'] = existing
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Updated {domain}: {len(existing)} questions (+{len(questions)})")

print("\nDone!")
PYEOF