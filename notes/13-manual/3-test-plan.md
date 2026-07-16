### **Test Plan**

- **More detailed approach for testing** a specific **release/feature/product** — not the whole project
- **Updated every release** (mostly), unlike Test Strategy
- **Test Strategy** = set of standards (the "rules of the game" for the whole project)
- **Test Plan** = the actual team plan of "how we are going to test **this** release"

### **Key Components:**

S-T-O-R-E-A

S - Scope
T - Testing actual env where testing will one and testing types and levels
O - Objective
R - Roles and Responsibilites + Risks and assumptions
E - Entry/Exit Criteria
A - Automation Scope

1. **Objective** — What this release focuses on, stated simply (e.g., "Validate new SIM swap feature for Release 3.1")
2. **Scope** — Since E2E involves many apps, we don't test everything end-to-end every time. Scope is called out clearly — e.g., "for this E2E cycle, we focus only on UI-level validation from App A → App B; when App B introduces a new feature, we validate it's correctly reflected on our side, but we don't retest App B's API layer — that's owned by App B's team"
3. **Test Approach** —

   - Smoke test on build the day it's available
   - Regression testing starts from Day 1 of build availability
   - Progressive/new feature testing continues alongside as E2E flows stabilize
4. **Test Environment** — Test Strategy lists *all* available envs across the project; Test Plan **confirms which specific env** will be used for this release
5. **Test Schedule** — Number of sprints in this release, duration of each, key milestones/dates
6. **Roles & Responsibilities** — Who owns testing for which feature/product/app in this release
7. **Entry Criteria** —

   - Stable build deployed
   - Groomed stories with clear Acceptance Criteria (ACs); any doubts/missing details clarified with the team beforehand
   - Test data ready (mobile numbers, SIMs, test accounts, etc.)

   **Exit Criteria** —

   - Planned test cases executed with defined pass %
   - No open Critical/High defects (or agreed workarounds)
   - Evidence submitted — reports, metrics, automation scripts, screenshots/videos for passed scenarios
8. **Risks & Assumptions** — E.g., data migration/sync between apps has downstream dependencies that have broken before (based on past release history) — flagged as a known risk for this release
9. **Automation Scope** — How much of the regression suite is planned to be automated this release, based on current regression count and automation coverage targets

---

**Quick way to hold Entry vs Exit in memory:**

- **Entry** = build + data + clarity — "are we *ready to start*"
- **Exit** = execution + evidence + defects closed — "are we *ready to sign off*"

Good idea — mnemonics make recall much faster in interviews. Here you go:

If you just need a quick mental checklist to make sure you didn't forget a section during a meeting, you can rearrange the 9 components to spell  **TART STORE** .

* **T** – **T**est Approach *(Smoke, regression, progressive)*
* **A** – **A**utomation Scope *(How much regression is automated)*
* **R** – **R**oles & Responsibilities *(Who owns what for this release)*
* **T** – **T**est Environment *(The specific env chosen for this plan)*
* **S** – **S**cope *(What's in and out for this specific cycle)*
* **T** – **T**est Schedule *(Sprints, dates, milestones)*
* **O** – **O**bjective *(The simple goal of the release)*
* **R** – **R**isks & Assumptions *(Known blockers and dependencies)*
* **E** – **E**ntry/Exit Criteria *(Stable builds to start, evidence to finish)*

## Agile Testing — Entry & Exit Criteria (Story/Sprint level)

Since Agile doesn't have one big project-level entry/exit like Waterfall, this applies **per story/sprint**, tied to **DoR** (Definition of Ready) and **DoD** (Definition of Done).

**Entry Criteria (Definition of Ready — before testing starts):**

- Story groomed with clear, testable **Acceptance Criteria**
- All doubts/dependencies clarified with Dev/BA before sprint starts
- Test data available (SIMs, mobile numbers, test accounts, etc.)
- Build deployed to test env & **smoke test passed**
- Story estimated and pulled into sprint backlog
- Environment stable and accessible

**Exit Criteria (Definition of Done — before story/sprint closes):**

- All planned test cases (functional + regression) executed
- Acceptance Criteria met and validated
- Automation scripts added for the story (as per "automate as you go")
- No open Critical/High defects (or deferred with team agreement)
- Code reviewed & merged
- Evidence attached — execution report, screenshots/videos for passed scenarios
- Demo-ready for Sprint Review
- all metrics/reports shared with stakeholders

**One-liner for interviews:**
"In Agile, Entry and Exit criteria aren't defined once at project level like in Test Plan — they're applied per story/sprint through Definition of Ready and Definition of Done, ensuring quality gates happen continuously rather than only at the end."
