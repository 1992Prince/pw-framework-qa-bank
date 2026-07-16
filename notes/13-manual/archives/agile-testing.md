
# Agile Testing Interview Q&A — Telecom Recharge Feature

*Purpose-first, speakable answers. Only high-probability interview questions covered.*

---

## 1. Agile & Scrum Basics

**Q: What is Agile? Why preferred over Waterfall?**

- **Purpose:** Agile's purpose is to deliver working software in small, frequent increments so we get faster feedback and can adapt to changing requirements — instead of waiting till the end like Waterfall.
- Waterfall = fixed requirement, testing only at the end, changes are costly
- Agile = iterative sprints, testing happens continuously, changes are welcomed even late
- Telecom eg: If we're building "new recharge offer" feature, Agile lets us test and get feedback after every 2-week sprint, instead of waiting 6 months to see if the whole recharge module works

**Q: Explain Scrum methodology**

- **Purpose:** Scrum's purpose is to organize Agile work into fixed time-boxed sprints with clear roles and ceremonies, so the team stays focused and delivers predictably.
- Framework: Product Backlog → Sprint Backlog → Sprint (2-4 weeks) → Increment → repeat
- Telecom eg: Product Backlog has items like "add UPI to recharge," "add auto-renew" — team picks a few into Sprint Backlog and delivers a working increment every sprint

**Q: What are the Scrum ceremonies?**

- **Purpose:** Ceremonies exist to keep the team aligned, remove blockers early, and continuously improve — each ceremony has a specific purpose.
- Sprint Planning → decide what to build this sprint
- Daily Standup → sync on progress/blockers daily
- Sprint Review/Demo → show working increment to stakeholders
- Sprint Retrospective → reflect on what went well/what to improve
- Telecom eg: In sprint review, team demos the working "recharge with UPI" feature to Product Owner and stakeholders

**Q: Roles — Product Owner, Scrum Master, Development Team**

- **Purpose:** These roles exist to separate "what to build" (business) from "how it gets built" (execution) from "how the process runs smoothly" (facilitation).
- Product Owner → owns the backlog, decides priority, represents business/customer voice
- Scrum Master → removes blockers, facilitates ceremonies, protects team from distractions
- Dev Team (incl. QA) → builds and tests the increment
- Telecom eg: PO decides "UPI recharge" is higher priority than "wallet recharge" this sprint; Scrum Master helps unblock QA when payment gateway sandbox is down

**Q: What is a Sprint?**

- **Purpose:** A sprint's purpose is to time-box work into a short, fixed cycle so the team delivers a shippable increment regularly and gets feedback fast.
- Usually 2 weeks; fixed scope once started
- Telecom eg: Sprint 5 goal = "Enable UPI as a recharge payment option" — planned, built, tested, and demoed within those 2 weeks

**Q: What is Sprint Planning?**

- **Purpose:** Purpose is to decide what will be delivered in the upcoming sprint and how, so the whole team starts with clarity on scope and capacity.
- Team picks stories from backlog based on priority + capacity, breaks into tasks
- Telecom eg: Team commits to "UPI recharge" + "recharge history bug fixes" this sprint based on story points and team availability

**Q: What happens in Sprint Grooming / Backlog Refinement?**

- **Purpose:** Purpose is to keep the backlog ready and clear ahead of time — clarify requirements, estimate stories, split large ones — so sprint planning goes smoothly.
- Team reviews upcoming stories, asks questions, adds acceptance criteria, estimates
- Telecom eg: During grooming, QA asks PO "what happens if UPI payment times out mid-recharge?" — clarified before it enters a sprint

**Q: Definition of Ready (DoR) vs Definition of Done (DoD)**

- **Purpose:** DoR's purpose is to make sure a story is clear enough to start work on; DoD's purpose is to make sure a story is truly complete — coded, tested, and shippable — before calling it "done."
- DoR eg: User story has clear acceptance criteria, is estimated, dependencies identified
- DoD eg: Code done + unit tested + QA tested + no critical bugs + deployed to QA env
- Telecom eg: "Auto-renew recharge" story isn't Ready until we know which payment modes it supports; it isn't Done until QA has verified it end-to-end with no Sev-1 bugs open

**Q: What is Velocity? How is it useful?**

- **Purpose:** Velocity's purpose is to measure how much work (story points) a team completes per sprint on average, so future sprints can be planned realistically.
- Calculated from completed story points over past sprints
- Telecom eg: If team's average velocity is 30 points/sprint, PO won't overload the sprint with 50 points of recharge-related stories

---

## 2. Requirement Analysis

**Q: How do you analyze a user story before testing?**

- **Purpose:** Purpose is to fully understand the expected behavior before writing test cases, so we don't miss scenarios or test the wrong thing.
- Read acceptance criteria carefully, identify all conditions/rules, check for missing edge cases, clarify with PO if unclear
- Telecom eg: For "Recharge with UPI" story, check — what payment amounts are allowed, what happens on failure, is there a cashback rule, timeout handling

**Q: How do you identify edge cases from a user story?**

- **Purpose:** Purpose is to think beyond the "happy path" and cover boundary/negative scenarios that are more likely to break in production.
- Think about boundaries, invalid inputs, network failures, concurrent actions, third-party dependency failures
- Telecom eg: For recharge — what if user closes app mid-payment, what if amount is ₹0 or negative, what if UPI app isn't installed, what if two recharges happen simultaneously

---

## 3. Sprint Planning & Estimation

**Q: How do you estimate testing effort?**

- **Purpose:** Purpose is to give a realistic time estimate so testing isn't rushed and sprint commitments stay achievable.
- Consider: complexity of feature, number of test scenarios, regression impact, environment/data readiness, past experience with similar stories
- Telecom eg: "UPI recharge" story estimated higher than "UI text change" because it touches payment gateway integration and needs regression on other payment modes too

**Q: How do you classify stories as Simple, Medium, or Complex?**

- **Purpose:** Purpose is to quickly gauge testing effort and risk so the team can plan sprint capacity accurately.
- Simple → minor UI/text change, no business logic; Medium → single flow change with some logic; Complex → multiple integrations, payment/business-critical logic
- Telecom eg: Simple = updating recharge plan description text; Medium = adding a new recharge amount option; Complex = integrating a new payment gateway for recharge

---

## 4. Test Planning & Execution

**Q: What is your test strategy for a sprint?**

- **Purpose:** Purpose is to define upfront what will be tested, how, and in what order, so testing stays organized within the sprint's short timeline.
- Decide scope (new features + impacted regression areas), prioritize by risk, decide what's automatable, plan test data/env needs early
- Telecom eg: This sprint, prioritize testing "UPI recharge" happy path + failure scenarios first, then run regression on wallet/card recharge

**Q: How do you decide what to automate?**

- **Purpose:** Purpose is to save repetitive manual effort by automating stable, frequently-run, high-value test cases — not everything needs automation.
- Automate: stable features, repetitive regression cases, high business-risk flows
- Don't automate: one-time checks, UI still changing frequently, exploratory scenarios
- Telecom eg: Automate "recharge success flow across all payment modes" since it runs every sprint regression; don't automate a one-off UI text validation

---

## 5. Risk-Based Testing

**Q: What is Risk-Based Testing? When would you skip regression?**

- **Purpose:** Purpose is to focus limited testing time on high-risk, high-impact areas first, so critical functionality is protected even if some low-risk testing gets skipped.
- Risk = impact × probability of failure
- Skip/reduce regression only on low-risk, rarely-used, cosmetic areas when time is short — never skip on payment-critical flows
- Telecom eg: If release time is tight, fully regress recharge/payment flow but reduce depth on "recharge history filter" screen

**Q: Build received one day before release / testing time reduced by 50% — what do you test?**

- **Purpose:** Purpose is to protect the core business-critical flow first when time is compressed, using risk as the filter.
- Prioritize: smoke test, core recharge/payment flow, high-severity areas from past defects
- Skip/deprioritize: cosmetic UI, rarely-used features, non-critical edge cases
- Telecom eg: With half the time, focus fully on "recharge deduction + balance update + confirmation SMS," skip deep testing on "recharge history export" feature

---

## 6. Defect Management

**Q: What is the defect life cycle?** *(see full cycle in previous doc — quick recap)*

- **Purpose:** To track a bug from discovery to closure in a structured, auditable way.
- New → Assigned → Open → Fixed → Retest → Verified → Closed (branches: Reopened / Rejected / Deferred)
- Telecom eg: Recharge balance mismatch bug logged → dev fixes → QA retests → Verified → Closed

**Q: What if a developer rejects your bug?**

- **Purpose:** Purpose is to resolve the disagreement using evidence and process, not opinion.
- Re-verify with clear steps/screenshots/logs, check env & data consistency, involve lead/PO if still unresolved
- Telecom eg: Dev says "recharge works fine" — reproduce with the exact same test SIM, network, and payment mode to prove the mismatch

**Q: What if the Product Owner says your bug is not important?**

- **Purpose:** Purpose is for QA to clearly present the risk/impact, while respecting that prioritization is ultimately a business decision.
- Explain severity/impact with data (how many users affected, business impact), document disagreement, accept PO's final call if still deprioritized
- Telecom eg: A rare crash on an old recharge plan — QA flags it clearly, but if PO deprioritizes due to low usage, QA documents it and moves on

**Q: How do you prioritize defects?**

- **Purpose:** Purpose is to fix the bugs that matter most to the business and users first, given limited dev bandwidth.
- Based on: severity, business impact, number of users affected, release timeline
- Telecom eg: "Recharge fails for all UPI users" fixed before "wrong icon color on recharge history page"

---

## 7. Test Closure & Reporting

**Q: What are the exit criteria for a sprint?**

- **Purpose:** Purpose is to define objectively when testing can be considered complete for that sprint, so the team doesn't ship half-tested work.
- All planned test cases executed, no Sev-1/Sev-2 bugs open, regression passed, acceptance criteria met
- Telecom eg: Sprint can close only if UPI recharge feature has zero critical bugs and passed regression on other payment modes

**Q: What information do you include in the test summary report?**

- **Purpose:** Purpose is to give stakeholders a clear, concise picture of testing outcome so they can make an informed release decision.
- Scope tested, test cases executed/passed/failed, defects found (open/closed), risk areas, overall recommendation
- Telecom eg: "UPI recharge tested — 45/48 cases passed, 2 minor bugs open (non-blocking), recommend go-live"

**Q: Can testing be signed off if some defects are still open?**

- **Purpose:** Purpose is to allow release decisions to be risk-based rather than requiring zero bugs, which is often unrealistic.
- Yes, if open defects are low severity/priority and documented clearly with known-issues list
- Never sign off with open Sev-1/critical bugs on core flow
- Telecom eg: Sign off recharge release with a known minor UI bug on a rarely-used browser, but not with an open bug where balance isn't updating

---

## 8. Scenario-Based Questions

**Q: Production issue found immediately after release. What will you do?**

- **Purpose:** Purpose is to assess and contain impact fast, since real users are already affected.
- Reproduce in staging, check logs/recent deployment changes, coordinate hotfix or rollback with dev/DevOps, add missed scenario to regression suite
- Telecom eg: Recharge succeeds but confirmation SMS isn't sent post-release — check SMS gateway logs, coordinate hotfix, add SMS check to regression going forward

**Q: Build is unstable throughout the sprint. How do you handle testing?**

- **Purpose:** Purpose is to avoid wasting testing effort on a moving, broken target — push for stability first.
- Run smoke on every new build, report instability immediately, escalate to Scrum Master if it's eating into sprint testing time
- Telecom eg: If recharge page keeps crashing across multiple builds, escalate in standup — sprint testing timeline is at risk

**Q: Developers deliver code very late every sprint. What actions will you take?**

- **Purpose:** Purpose is to protect testing time and flag a recurring process problem, not just absorb it silently sprint after sprint.
- Raise in retrospective, request earlier code delivery or smaller story slices, propose shift-left testing where possible
- Telecom eg: If "recharge" stories always land on Day 8 of a 10-day sprint, propose splitting into smaller deliverables so QA gets earlier access

**Q: Business requests a new feature one day before release. How do you respond?**

- **Purpose:** Purpose is to protect release quality by clearly communicating risk of adding untested scope at the last minute.
- Assess impact/risk of adding it now, recommend deferring to next sprint unless business accepts the risk of reduced testing
- Telecom eg: Adding a "festival cashback" rule one day before release — flag that it can't get full regression, let PO decide risk vs. deferring

**Q: One tester is underperforming. How do you handle it?**

- **Purpose:** Purpose is to identify the root cause and support improvement, not just call it out.
- 1:1 conversation to understand blockers (skill gap, unclear requirements, personal issue), provide mentoring/pairing, monitor progress
- Telecom eg: If a tester keeps missing edge cases in recharge testing, pair them with a senior tester on test design for a sprint or two

**Q: Half the sprint is over but development hasn't completed any story.**

- **Purpose:** Purpose is to flag the risk early so scope or timeline can be adjusted, rather than discovering it too late to react.
- Raise immediately in standup, discuss re-prioritization or scope reduction with Scrum Master/PO, prepare shift-left/parallel testing plan for whatever comes late
- Telecom eg: If no recharge-related story is dev-complete by mid-sprint, flag now so PO can decide to descope something rather than rush low-quality delivery at the end

**Q: Developer says "Cannot Reproduce."**

- **Purpose:** Purpose is to close the gap between environments/data so the bug can be reliably reproduced and fixed.
- Share exact steps, environment, build version, test data, video/screen recording; reproduce together live if needed
- Telecom eg: Recharge failure only happens on a specific test SIM with zero balance — share that exact SIM/test data with dev to reproduce

**Q: Only 40% regression is complete before release. What do you do?**

- **Purpose:** Purpose is to make sure the most critical 40% gets covered, using risk-based prioritization, and clearly communicate the gap.
- Prioritize remaining time on high-risk core flows, clearly report incomplete coverage and risk to stakeholders before sign-off
- Telecom eg: Ensure the 40% completed covers full recharge + payment flow; explicitly flag that "recharge history" and "offers page" regression wasn't completed

**Q: Why wasn't this bug caught earlier? (Stakeholder question)**

- **Purpose:** Purpose is to give an honest, constructive answer — acknowledge the gap and explain the corrective action, not get defensive.
- Explain root cause (missed scenario, environment difference, new edge case), state the fix — added to regression/automation going forward
- Telecom eg: "This recharge issue only occurred with a specific telecom operator's UPI app, which wasn't part of our original test matrix — we've now added it to our regression scope"

---

## Quick Mnemonic Recap

| Concept               | Mnemonic                                     |
| --------------------- | -------------------------------------------- |
| Scrum Ceremonies      | Plan → Standup → Review → Retro (P-S-R-R) |
| DoR vs DoD            | Ready = Can we Start, Done = Can we Ship     |
| Velocity              | Points Per Sprint (past predicts future)     |
| Risk-Based Testing    | Impact × Probability = Risk                 |
| Defect Priority Logic | Users Affected + Business Impact = Priority  |
