# Copilot Instructions

This document provides concise Copilot prompts and guidelines for using Copilot with this repository.

Principles:
- Multi-tenant aware: always consider tenant isolation and data boundaries.
- KYC & audit-first: prefer explicit audit logs and privacy-safe defaults.
- Workflows oriented: suggest steps, not only code snippets.

Example prompt:
"You are an experienced developer working on a multi-tenant Node/React app. Suggest implementation steps to add an audited KYC flow that stores minimal PII and emits audit events. Include schema changes, API endpoints, and tests."

Add this file to the docs and link from README as needed.