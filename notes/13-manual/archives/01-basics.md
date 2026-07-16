
# STLC / Project Process — Interview Q&A (Speakable Notes)

---

### Q1. Explain your current project and responsibilities

- Part of a **TCoE (Test Center of Excellence)** team — build in-house automation tools/frameworks for client teams and enable it for them.
- Two hats:
  1. **Support role** — resolve JIRA issues from teams using the framework, give POCs, help write first few scripts, do framework trainings (Confluence + AI agents help now).
  2. **Lead role** — head the E2E automation team; ensure regression is developed & executed early, daily smoke runs to confirm system health.
- 🧠 **Trick:** Say it as **"Enable + Lead"** → *I enable other teams' automation AND lead my own E2E automation team.*

---

### Q2. What is STLC?

- **Software Testing Life Cycle** — structured process for testing a product/swe from requirement analysis to test closure, ensuring quality.
- **6 Phases:** Requirement Analysis → Test Planning → Test Case Design → Test Environment Setup → Test Execution → Test Closure.
- **Purpose:** systematic testing, early defect detection, good coverage, stable release.
- 🧠 **Trick (mnemonic):** *"Really Prepared Developers Execute Everything Carefully"* → **R-P-D-E-E-C**.
- ⚠️ If asked "phases only" → just list the 6. If asked "why STLC matters" → focus on purpose bullets.

---

### Q3. Explain your project's testing methodology / STLC / your contribution

- Follow **Agile Scrum** — release every ~3 months, 2-week sprints.
- STLC is blended into agile ceremonies:
  - **Requirement Analysis** → Sprint Planning + Grooming (clear doubts, dependencies).
  - **Test Design** → done during sprint from user stories; last sprint's automation also wrapped here.
  - **Test Execution** → once code hits lower env, API + UI + feature testing.
  - **Test Closure** → at sprint retro.
- Next sprint's grooming happens **in parallel** with current sprint.
- 🧠 **Trick:** Map STLC phases directly to **Sprint Ceremonies** (Grooming = Requirement, Sprint work = Design+Execution, Retro = Closure) — shows agile-STLC integration, interviewers love this mapping.

---

### Q4. How many test environments? What is a hotfix?

- Lower environments: **E2E1, E2E2**.
- **Hotfix** = urgent, unplanned fix pushed to production outside the normal release cycle.
- 🧠 **Trick:** Hotfix = **"Unplanned + Urgent + Production"** — say all three keywords, that's the full definition.

---

### Q5. Build vs Release; how do you track release info?

- **Build** = a deployable code package for testing in an environment.
- **Release** = a planned set of sprints (e.g., 10 sprints) going live to production together.
- Tracked via a **release calendar** (6 months ahead) showing sprint start/end and go-live dates.
- 🧠 **Trick:** Build = "what testers get", Release = "what customers get".

---

### Q6. What is Code Freeze?

- Date after which **dev stops making changes** to the code in that environment.
- Before freeze: testing happens, bugs raised & fixed.
- After freeze: any change needs **stakeholder approval** (only for critical/urgent fixes).
- 🧠 **Trick:** Freeze = **"Line drawn — no code moves without sign-off."**

---

### Q7. Explain Risk-Based Testing

- Used when time/resources are limited due to: late build, urgent bug fix, hotfix, last-minute feature, shortened timeline, environment instability, high defect volume.
- Instead of full regression → test **high-impact areas only** (e.g., in telecom: upgrade journey, payment flow, subscription activation, billing, dashboard update).
- Always get **stakeholder approval** before reducing scope.
- 🧠 **Trick:** Remember **"Time-Risk-Approval"** → less time → assess risk → get approval → test only critical flows.

---

### Q8. Test Closure process / Test Deliverables

- Follows **Exit Criteria**:
  - All planned test cases executed.
  - No open critical defects.
  - Low-priority/deferred defects called out in **sign-off mail**.
  - Any risks documented in sign-off mail.
- **Deliverables:** Test summary report, defect report, sign-off mail, test cases/execution status.
- 🧠 **Trick:** Closure = **"Execute → Zero Critical → Document Rest → Sign-off."**

---

### Q9. How do you handle unclear requirements?

- Review JIRA story + acceptance criteria **before** grooming.
- Raise doubts during PO walkthrough; unanswered ones get documented for follow-up.
- Check: **is the feature testable?** Cover edge cases, avoid assumptions.
- 🧠 **Trick:** 3-step flow — **Prepare → Clarify → Document (if unresolved).**

---

### Q10. How do you estimate sprint testing effort?

- Classify story as **Simple / Medium / Complex** based on business logic, integrations, scope.
- Estimate across: Requirement Analysis, Test Design, Testing, Retesting, Regression Impact.
- **Simple** (UI only, no API/dependency) → e.g., ~6 hrs total.
- **Medium** (UI+API+validations) → e.g., ~16 hrs total.
- 🧠 **Trick:** Give the **formula** first (Simple/Medium/Complex + 5 estimation buckets), then one quick example — interviewers want the framework, not just a number.

---

### Q11. How do you check if a build is testable?

- Run a **Smoke Test suite** (15–20 min) covering major flows.
- Pass → build accepted, start detailed testing. Fail → reject build, send back to dev.
- 🧠 **Trick:** Smoke test = **"Quick health check before full treatment."**

---

### Q12. What is Exhaustive Testing? Have you done it?

- **Exhaustive testing** = testing **all possible inputs, paths, and combinations** of a system — theoretically complete, practically impossible (infinite combinations, time/cost prohibitive).
- Real projects use **risk-based / boundary / equivalence partitioning** instead to get maximum coverage in limited time.
- Answer style: *"No, it's not practically feasible — I instead rely on risk-based testing and boundary value analysis to get near-complete coverage."*
- 🧠 **Trick:** Exhaustive = **"Testing every possible combination — sounds ideal, impossible in reality."**

---

### Q13. Verification vs Validation

| Aspect   | Verification                                  | Validation                                    |
| -------- | --------------------------------------------- | --------------------------------------------- |
| Question | "Are we building the product**right**?" | "Are we building the**right** product?" |
| Focus    | Process/document review (specs, design, code) | Actual product testing against user needs     |
| Method   | Reviews, walkthroughs, inspections (static)   | Execution of the software (dynamic)           |
| When     | Throughout SDLC                               | After a build/feature is ready                |

- 🧠 **Trick:** **V for Verification = Vision on paper (static). V for Validation = Verify by running it (dynamic).**
  Quick line: *"Verification is done without executing code, Validation is done by executing it."*

---

### Q14. Traceability Matrix — what & why, how handled in Agile

- **Requirement Traceability Matrix (RTM)** = a document mapping **requirements → test cases → defects**, ensuring every requirement is covered by at least one test case.
- **Why:** ensures full coverage, easy impact analysis when requirements change, helps in audits/sign-off.
- **In Agile:** instead of a heavy formal RTM doc, traceability is maintained via **JIRA linking** — user story ↔ linked test cases ↔ linked defects; tools like Zephyr/Xray auto-generate coverage reports.
- 🧠 **Trick:** RTM = **"Requirement → Test → Defect — 3-way link, no requirement left untested."**
  In Agile, just say: *"We don't maintain a separate matrix, JIRA + test management tool (Zephyr/Xray) linking gives us live traceability."*

---

## 🎯 Overall Speaking Tips

- Whenever asked **"explain your process"** → always structure as **STLC phases mapped to Agile ceremonies**.
- Whenever asked **"how do you handle less time/urgent situations"** → answer with **Risk-Based Testing**.
- Whenever asked **"how do you ensure quality/sign-off"** → answer with **Exit Criteria + Sign-off mail**.

