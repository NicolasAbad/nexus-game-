---
name: static_review_after_stage
description: After completing each stage, always do a static code review before moving on
type: feedback
---

After finishing each stage, always perform a static code review before committing or moving to the next stage.

**Why:** User wants to catch bugs early without having to run the game manually each time.

**How to apply:** After completing a stage, review all modified files for:
- Broken imports or references to removed properties
- Missing i18n keys in es.js / en.js
- Logic bugs, off-by-one errors, missing null checks
- Inconsistencies between data files and the systems that consume them
