# SDET Interview Prep — Corrected Answers

---

## 1. Test Scenario vs Test Case

**Test Scenario** captures **what** needs to be tested — a high-level, one-line description of a functionality or user journey.

**Test Case** captures **how** to test it — detailed steps, test data, preconditions, and expected results.

**Relationship:** One scenario maps to multiple test cases (happy path, negative, edge, boundary).

**Example (Telecom):**

- **Scenario:** Verify recharge is successful for a premium customer.
- **Test Cases derived from it:**
  1. Premium customer recharges with valid plan + valid payment → success (happy path)
  2. Premium customer recharges with insufficient wallet balance → proper error shown (negative)
  3. Premium customer recharges with an expired/inactive plan → blocked with correct message (negative)
  4. Premium customer recharge during a payment gateway timeout → transaction rolled back, no double deduction (edge)

**Interview one-liner:** "A scenario tells me *what* to verify; a test case tells me *exactly how* to verify it, step by step, with data and expected output. A single scenario usually expands into several test cases covering happy path, negative, and edge conditions."

---

## 2. Build & Release Process

**Q: How do you know a build is testable (smoke)?**

When a new build arrives, we run a **smoke suite** first — a small, fast set of checks confirming the build is stable enough for deeper testing.

- Covers: major pages load, login/logout works, core flow (e.g., recharge selection) is reachable, plus a handful of API sanity checks
- UI smoke: ~10–15 minutes | API smoke: ~3–5 minutes
- **If smoke fails → build is rejected immediately**, results shared with dev, new build requested. We don't invest full-cycle effort into an unstable build.

**Q: Build vs Release**

- **Build** = a deployable unit (WAR, JAR, Docker image, etc.) delivered to an environment for QA to test. Dev/CI deploys it. A build can be internal and doesn't reach customers.
- **Release** = a versioned, customer-facing delivery of specific features/fixes that goes live. Every release has a version/release number and is what the business tracks.

**One-liner:** "A build is what QA tests; a release is what the customer gets — a release is essentially a build that has passed all gates and been approved to go live."

**Q: Code Freeze**

Code freeze is the cutoff point after which **no further code changes** are allowed in the build for that release.

- All testing and defect-fixing must be completed *before* freeze.
- Any change requested *after* freeze needs explicit stakeholder approval, since it re-opens risk this late in the cycle.

**Q: Hotfix**

A hotfix is an **urgent, out-of-cycle fix** pushed directly to production to resolve a critical issue that cannot wait for the next planned release — usually a P1 bug impacting live customers.

**Q: Smoke execution process**

Purpose: quickly decide if a build is even worth full testing effort, before investing detailed time into it.

**Process:** Deploy build → run predefined smoke suite on critical flows → Pass = proceed to full testing cycle | Fail = reject build, notify dev

**Telecom example:** Login → Recharge page loads → Plan selection works → Payment gateway opens. This is a shallow check on the *path*, not deep validation of every field/edge case.

**Q: Regression execution process**

Purpose: confirm that recent code changes haven't broken existing functionality elsewhere in the application.

**Process:** Once smoke passes and the build is confirmed stable, we run the regression suite. In our setup, ~90% of regression is automated and ~10% covers legacy areas that are still manual (not yet automated, or low ROI to automate).

**Q: What happens if smoke fails?**

Build is rejected immediately → reported to dev with priority and evidence (logs/screenshots) → new build requested. We do not proceed to functional/regression testing on a failed smoke build, since results would be unreliable and wasteful.

---
