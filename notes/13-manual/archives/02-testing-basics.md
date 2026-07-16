
# Manual Testing Interview Q&A — Agile + Telecom (Recharge Domain)

---

## 1. Fundamentals

**Q: Verification vs Validation**

- Verification → "Are we building it right?" — static, no code execution (reviews, walkthroughs, doc checks)
- Validation → "Are we building the right thing?" — dynamic, actual execution
- Telecom eg: Verification = reviewing recharge SRS for correct offer amount; Validation = actually recharging ₹199 and checking balance updates
- Mnemonic: **V&V = Verify Verbally, Validate by Vetting (running)**

**Q: Functional vs Non-Functional Testing**

- Functional → what system does — features, business logic (recharge success, correct balance credit)
- Non-Functional → how system performs — performance, security, usability, load
- Telecom eg: Functional = ₹199 recharge adds correct validity; Non-Functional = recharge page loads in <2 sec during IPL-time traffic surge
- Mnemonic: **Functional = Feature, Non-Functional = "-ility" (usability, reliability, scalability)**

**Q: Smoke Testing vs Sanity Testing**

- Smoke → broad, shallow check on new build for overall stability (build acceptance test)
- Sanity → narrow, deep check on specific feature/bugfix after minor change
- Telecom eg: Smoke = login + recharge page + payment gateway opens on new build; Sanity = only checking "auto-renew recharge" after a fix
- Agile tie-in: Smoke run every sprint build deploy before sprint testing starts
- Mnemonic: **Smoke = Wide & Shallow, Sanity = Narrow & Deep**

**Q: Regression Testing vs Retesting**

- Retesting → re-run same failed test case after fix, to confirm defect closed
- Regression → run other/related test cases to confirm fix didn't break existing functionality
- Telecom eg: Retest = confirm ₹199 recharge bug is fixed; Regression = check ₹99, ₹499 recharges and wallet balance still work fine after that fix
- Mnemonic: **Retest = Same Test, Regression = Rest of the Tests**

---

## 2. STLC, SDLC & Documentation

**Q: Difference between STLC and SDLC + STLC phases in Agile**

- SDLC → entire software dev process (Requirement → Design → Build → Test → Deploy → Maintain)
- STLC → only testing sub-process, runs parallel with SDLC
- STLC Phases: Requirement Analysis → Test Planning → Test Case Design → Environment Setup → Test Execution → Test Closure
- In Agile: STLC compresses into each sprint (2 weeks) — testing starts from Day 1, not after full dev complete (shift-left)
- Telecom eg: In sprint for "new recharge plan," test analysis + case design happens alongside dev, testing done before sprint demo
- Mnemonic: **"Reema Plans To Enter Execution Closure"** (Req → Plan → TC design → Env → Exec → Closure)

**Q: Entry Criteria vs Exit Criteria**

- Entry Criteria → conditions to be met before testing starts (test cases ready, build deployed, test data available)
- Exit Criteria → conditions to end testing (no critical bugs open, X% test cases passed, coverage met)
- Telecom eg: Entry = recharge test env has live payment gateway sandbox ready; Exit = 95% test cases passed, no Sev1 bugs on recharge flow

**Q: Test Deliverables and Test Closure**

- Test Deliverables → artifacts produced during testing: Test Plan, Test Cases, Traceability Matrix, Bug Reports, Test Summary Report
- Test Closure → formal sign-off phase — verify all deliverables done, exit criteria met, lessons learned documented
- Telecom eg: Before releasing new recharge offer, QA lead shares Test Summary Report + closure sign-off to Product Owner

**Q: Traceability Matrix (RTM) and Test Coverage**

- RTM → maps requirements → test cases, ensures no requirement untested
- Test Coverage → % of requirements/code covered by test cases
- Telecom eg: RTM maps "Recharge should support UPI, Card, Wallet" requirement to 3 separate test cases for each payment mode
- Why it matters: catches missing coverage before release (e.g., forgot to test "Wallet payment" case)
- Mnemonic: **RTM = Requirement Tracker Matrix**

---

## 3. Planning

**Q: What is a Test Plan? Components vs Test Strategy**

- Test Plan → project-specific document — scope, approach, resources, schedule, deliverables for one release/sprint
- Test Strategy → organization-level, high-level document — overall testing approach, tools, types of testing followed across projects
- Components of Test Plan: Scope, Objectives, Test Approach, Entry/Exit Criteria, Resources, Schedule, Risks, Deliverables
- Telecom eg: Test Plan = plan for "Recharge Module Release 2.3"; Test Strategy = company-wide standard (e.g., "all payment modules need security testing")
- Mnemonic: **Plan = Project-specific, Strategy = Standard (company-wide)**

**Q: What is a Test Strategy**

- High-level document defining testing approach, types of testing (functional, security, performance), tools, and standards for entire org/project
- Usually static across projects, doesn't change often
- Telecom eg: Company strategy mandates security testing for all payment/recharge related modules

**Q: Test Scenario vs Test Case**

- Test Scenario → high-level "what to test" (one-liner, functionality-level)
- Test Case → detailed "how to test" with steps, input, expected result
- Telecom eg: Scenario = "Verify recharge with UPI"; Test Case = Step1: Select ₹199 plan, Step2: Choose UPI, Step3: Enter UPI ID, Step4: Confirm → Expected: balance credited, SMS confirmation sent
- Mnemonic: **Scenario = What, Case = How**

---

## 4. Defects / Bug Life Cycle

**Q: What is a defect? Explain Bug Life Cycle**

- Defect → deviation between expected and actual result found by QA
- Bug Life Cycle stages: New → Assigned → Open → Fixed → Retest → Verified → Closed (also Reopened / Deferred / Rejected/Duplicate as branches)
- Telecom eg: Recharge amount deducted but balance not updated → logged as New → Dev assigns → fixes → QA retests → Verified → Closed
- Mnemonic: **"New Assignments Open Fixed Retests, Verified & Closed"**

**Q: Bug Severity vs Priority**

- Severity → impact on system functionality (technical) — set by QA
- Priority → urgency of fixing (business) — set by PO/Dev lead
- Telecom eg: Recharge fails completely for all users = High Severity + High Priority
- Mnemonic: **Severity = How Bad, Priority = How Fast**

**Q: High Severity–Low Priority example**

- Bug that breaks major functionality but rarely occurs / not urgent right now
- Telecom eg: App crashes when user recharges for a very old/deprecated plan (rarely used) — crash is severe, but low usage means low priority to fix immediately

**Q: Low Severity–High Priority example**

- Minor issue but highly visible/urgent (branding, compliance, MD-visible demo)
- Telecom eg: Company logo missing/misaligned on recharge success page before a major marketing campaign launch — cosmetic bug but must fix urgently

**Q: What information should every bug report contain?**

- Bug ID, Title/Summary, Steps to Reproduce, Expected vs Actual Result, Severity/Priority, Environment (browser/device/OS), Screenshots/Logs, Build version, Status
- Telecom eg: "Recharge ₹199 – Balance not credited though amount deducted" with steps, screenshot of transaction, app version, device model
- Mnemonic: **STAR + E** — Steps, Title, Actual/Expected, Reproducibility + Environment

---

## 5. Test Design Techniques

**Q: BVA vs EP vs Decision Table vs Error Guessing**

- **BVA (Boundary Value Analysis)** → test at boundaries (min, min+1, max, max-1) since bugs cluster at edges
  - Telecom eg: Recharge amount field allows ₹10–₹9999 → test 9, 10, 11, 9998, 9999, 10000
- **EP (Equivalence Partitioning)** → divide input into valid/invalid groups, test one value per group (reduces test cases)
  - Telecom eg: Valid recharge amount 10–9999 (pick 500), Invalid below 10 (pick 5), Invalid above 9999 (pick 15000)
- **Decision Table** → for combinations of multiple conditions/business rules, maps condition combos to expected actions
  - Telecom eg: Rules like "If amount ≥199 AND payment=UPI AND user=prepaid → apply cashback"
- **Error Guessing** → based on experience/intuition, no formal technique — testing tricky/edge scenarios testers "guess" might break
  - Telecom eg: Guessing what happens if user double-clicks "Pay" button during recharge (possible duplicate deduction)
- Mnemonic: **BEDe** — Boundary, Equivalence, Decision table, Error guessing

**Q: What is Risk-Based Testing**

- Prioritize testing based on risk (impact × probability of failure) — test high-risk areas first/more deeply
- Telecom eg: Payment/recharge module tested more rigorously than "view recharge history" screen since payment failure = revenue + trust loss
- Common in Agile with limited sprint time — focus effort where it matters most

**Q: Exploratory Testing vs Ad-hoc Testing**

- Exploratory → simultaneous learning + test design + execution, structured with a charter/time-box, documented
- Ad-hoc → random, unplanned, unstructured, no documentation, done casually
- Telecom eg: Exploratory = tester given 1-hour charter to "explore recharge + wallet interactions" and note findings; Ad-hoc = randomly clicking around recharge screen without any plan
- Mnemonic: **Exploratory = Explore with a Plan, Ad-hoc = Aimless clicking**

---

## 6. Build & Release Process

**Q: How do you know a build is testable?**

- Build deploys successfully to test env, app/site launches without crash, critical smoke flows work (login, recharge, payment gateway opens)
- If smoke fails → build rejected, sent back to dev

**Q: Build vs Release**

- Build → internal version given to QA for testing (e.g., v2.3.1-build45)
- Release → final, approved build deployed to production for end users
- Telecom eg: Build 45 tested internally → once stable, released as "App v2.3 — New Recharge Offers" to app store

**Q: Code Freeze**

- Phase where no new code/features allowed, only critical bug fixes — stabilization period before release
- Telecom eg: 2 days before Diwali recharge-offer campaign launch, code freeze declared so only blocker fixes allowed, no new features

**Q: Hotfix**

- Urgent fix pushed directly to production outside normal release cycle for critical issue
- Telecom eg: Recharge payments failing in production for all users → hotfix deployed same day, bypassing regular sprint release

**Q: Smoke execution process**

- Deploy build → run predefined smoke test suite (critical flows) → pass = proceed to full testing, fail = reject build
- Telecom eg: Login → Recharge page load → Select plan → Payment gateway opens → basic checks only, not deep validation

**Q: Regression execution process**

- After any fix/change, re-run test suite covering related + unrelated impacted areas → ensure nothing broken
- Usually automated in Agile (CI pipeline) due to repeated frequent runs every sprint
- Telecom eg: After fixing UPI payment bug, regression suite also runs Card, Wallet, Net-banking recharge cases

**Q: What if Smoke fails?**

- Build rejected immediately, not accepted for further testing
- Reported to dev team on priority, new build requested
- Telecom eg: If recharge page itself doesn't load in smoke, whole build rejected — no point testing further

**Q: What if Build fails?**

- Report to Dev/DevOps immediately, check deployment logs, verify environment config
- Communicate blocker in daily standup, escalate if blocking sprint testing timeline
- Testing paused until stable build provided

**Q: Test data management**

- Maintain reusable, realistic test data (valid users, valid/invalid recharge amounts, multiple payment modes) — avoid using live/prod data
- Use masked/anonymized data for privacy compliance
- Telecom eg: Maintain test SIM numbers with different balance states (zero balance, expired validity, active) to test recharge scenarios properly
- In Agile: test data prepared during sprint planning/refinement itself so testing isn't blocked mid-sprint

---

## 7. Scenario-Based / Situational Questions

**Q: Requirement is missing. What do you do?**

- Don't assume — raise query with BA/PO immediately
- Check user story acceptance criteria, past similar features for reference
- Log as an open question in standup/JIRA, proceed with other testable items meanwhile
- Telecom eg: Acceptance criteria doesn't mention what happens if recharge fails mid-payment — ask PO before writing that test case

**Q: Requirement changes during testing (mid-sprint)**

- Reassess impact on already written test cases/executed tests
- Update test cases, re-prioritize regression scope
- Communicate impact on sprint timeline to Scrum team
- Telecom eg: Recharge cashback % changes from 5% to 10% mid-sprint — update test data & expected results, re-verify already-passed cases

**Q: Build is unstable**

- Run smoke test to confirm severity
- Reject build if critical flows broken, report immediately with logs
- Don't proceed with full test execution on unstable build (wastes effort)

**Q: You don't have enough time for regression**

- Apply Risk-Based Testing — prioritize high-risk/high-impact areas first
- Use Test Impact Analysis — only test areas affected by recent code changes
- Suggest automating repetitive regression cases for future sprints
- Telecom eg: Time-crunched before release — focus regression on payment/recharge core flow, skip low-risk UI cosmetic areas

**Q: Developer rejects your bug**

- Don't argue emotionally — provide clear evidence: steps, screenshots, logs, video
- Re-verify bug yourself first, check env/data consistency
- If still disagreement, discuss with lead/PO for a call, or reproduce together with dev
- Telecom eg: Dev says "works on my machine" — reproduce with same device/network to confirm build/env-specific mismatch

**Q: Same bug reappears**

- Indicates regression issue or fix wasn't merged properly / config not deployed correctly
- Reopen bug, notify dev with detail on when/where it reappeared, check build version consistency
- Add stronger regression test case for that area going forward
- Telecom eg: Recharge duplicate-deduction bug reappears after 2 sprints — check if old fix got overwritten by new code merge

**Q: Customer reports a production issue**

- Treat as high priority — reproduce issue in test/staging env first
- Check logs, recent deployments/changes correlating with issue timing
- Communicate with support/dev team, provide hotfix if critical
- Add missed scenario as new regression test case
- Telecom eg: Customer complains balance deducted but recharge not done — check payment gateway logs, reproduce with similar amount/plan

**Q: Stakeholder wants sign-off despite open defects**

- Don't block decision — provide clear risk assessment (severity/impact of open bugs)
- Document known issues explicitly in release notes / sign-off email for traceability
- Final call is business decision, QA responsibility is to inform risk clearly, not block release
- Telecom eg: PO wants to launch recharge offer despite a minor UI bug on rarely-used browser — QA documents risk, PO takes informed call

**Q: Production deployment failed. What is your role?**

- Support in identifying what broke — check smoke test results post-deployment
- Collaborate with DevOps/Dev on rollback decision if critical
- Re-verify once rollback/fix applied
- Document RCA (root cause) contribution from QA side, add test case to prevent recurrence
- Telecom eg: New recharge release deployment breaks payment gateway integration — QA runs quick smoke on prod, confirms scope of impact, supports rollback decision

---

## Quick Mnemonic Recap

| Concept                | Mnemonic                                              |
| ---------------------- | ----------------------------------------------------- |
| V&V                    | Verify Verbally, Validate by Vetting                  |
| Smoke vs Sanity        | Wide & Shallow vs Narrow & Deep                       |
| Retest vs Regression   | Same Test vs Rest of Tests                            |
| STLC phases            | Reema Plans To Enter Execution Closure                |
| RTM                    | Requirement Tracker Matrix                            |
| Bug Life Cycle         | New Assignments Open Fixed Retests, Verified & Closed |
| Severity vs Priority   | How Bad vs How Fast                                   |
| Bug report info        | STAR + E                                              |
| Test Design Techniques | BEDe (Boundary, Equivalence, Decision, Error-guess)   |
| Exploratory vs Ad-hoc  | Explore with a Plan vs Aimless Clicking               |
