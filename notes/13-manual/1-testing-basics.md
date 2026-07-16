# Manual Testing Interview Q&A — Agile + Telecom (Recharge Domain)

1. Fundamentals

## Q: What are the Testing Principles?

   There are seven widely accepted testing principles that guide how we approach testing in any project:

- Testing shows the presence of defects, not their absence. Testing can prove that bugs exist, but it can never prove the application is 100% bug-free — even after extensive testing, undiscovered defects can still be there.
- Exhaustive testing is impossible. We can't test every single input, combination, and path through the application — that's why we rely on techniques like equivalence partitioning and risk-based testing to test smart, not test everything.
- Early testing saves time and money. The earlier we catch a defect in the SDLC, the cheaper it is to fix — a requirement bug caught during grooming is far cheaper to fix than the same bug found in production.
- Defects cluster together. In practice, a small number of modules usually account for most of the defects — similar to the Pareto principle (80% of bugs come from 20% of the modules). In our project, payment and offer-calculation modules tend to be the ones that consistently produce the most defects.
- Pesticide paradox. If we keep running the exact same set of test cases repeatedly, they eventually stop finding new bugs — just like pests build resistance to the same pesticide. That's why test cases need to be reviewed and updated regularly, with new scenarios added.
- Testing is context-dependent. How we test a telecom recharge app is different from how we'd test, say, a medical device application — the depth, techniques, and risk tolerance all change based on the domain.
- Absence-of-errors fallacy. Even if we find and fix every bug we can, the application can still fail if it doesn't actually meet the user's needs — passing all test cases doesn't guarantee the product is usable or correct from a business standpoint.

## Q: What are the Testing Objectives?

The main objectives of testing are:

- Finding defects — identifying issues before the customer does.
- Preventing defects — for example, reviewing requirements early enough to catch ambiguity before it turns into a coded bug.
- Building confidence — giving the business and stakeholders confidence that the application meets the requirements and is ready to release.
- Providing information for decision-making — giving the Product Owner and business enough data (bug counts, severity, coverage) to make a go/no-go release decision.
  Reducing the risk of failure in production — making sure critical flows like payment and recharge don't break for real customers.

Telecom example: before releasing a new ₹199 recharge offer, testing isn't just about finding bugs — it's also about giving the Product Owner enough confidence and data (test coverage, no critical opens) to make the call to release.

## Q: What are Testing Levels and Testing Types?

Testing levels refer to the different stages at which testing happens as the software moves through development, based on scope:

- Unit Testing — testing an individual component or module in isolation, usually done by the developer. Telecom example: testing just the function that calculates the recharge validity extension in isolation, without touching payment or the rest of the app.
- Integration Testing — testing how two or more modules or services interact with each other. Telecom example: checking that the Payment service correctly talks to the Recharge service and the Wallet service after a successful transaction.
- System Testing — testing the entire, fully integrated application end-to-end, as one complete system. Telecom example: testing the full recharge journey — login, select plan, make payment, balance updates, confirmation SMS — as one complete flow.
- Acceptance Testing (UAT) — testing done to confirm the system meets business requirements and is acceptable to the end user or business, usually the final level before release. Telecom example: the business team runs a final round of testing on the new recharge offer in a UAT environment before it's approved to go live.

Testing types, on the other hand, refer to what aspect of the application we're testing — this is the Functional vs Non-Functional split covered next, along with things like regression, smoke, and sanity, which are covered elsewhere in these notes. Levels answer "at what stage," types answer "what kind of testing."

## 1. Fundamentals

### Q: What is SDLC and STLC?

SDLC is the complete software development process followed to build an application, from requirement gathering all the way to deployment and maintenance. The typical phases are Requirement, Design, Development, Testing, Deployment, and Maintenance.

STLC is the Software Testing Life Cycle — it's the structured testing process the QA team follows to make sure the software is good quality, starting from requirement analysis and going all the way to test closure. The STLC phases are Requirement Analysis, Test Planning, Test Case Design, Test Environment Setup, Test Execution, and Test Closure.

R-P-D-E-E-C - or R-P-D-Esquare-C

### Q: How does STLC fit into Agile testing?

In Agile, we don't run STLC as one long sequential cycle — we run a mini version of it inside every sprint. Each ceremony in the sprint maps to a QA activity:

- **Sprint Grooming** — this is where requirement analysis happens. QA reviews the upcoming stories, checks if the acceptance criteria are clear, and raises questions or edge cases early.
- **Sprint Planning** — QA estimates the testing effort for each story and commits to what can realistically be tested in the sprint, alongside test planning and identifying test data needs.
- **Daily Scrum** — QA reports execution progress, blockers (like environment issues or pending test data), and any critical defects found.
- **Sprint Execution** — this covers test case design, environment setup, and actual test execution for the in-sprint stories.
- **Sprint Demo** — QA validates that the scenarios being demoed to stakeholders actually work, since we've already tested them.
- **Sprint Retrospective** — this lines up with test closure — QA shares what went well, what testing challenges came up, and process improvements for the next sprint.

So instead of one big STLC cycle, we're continuously running through Requirement Analysis → Test Planning → Design → Execution → Closure inside every sprint.

### Q: Verification vs Validation

Verification makes sure we're building the product correctly, as per the requirements. Validation makes sure we've built the correct product — one that actually satisfies the user's need.

Verification is static — it doesn't involve execution. It's reviews, walkthroughs, and checking requirement documents. Validation is dynamic — it involves actually executing the test cases on the real system.

Telecom example: Verification would be reviewing the recharge SRS document to confirm the offer amount is specified correctly. Validation would be actually doing a ₹199 recharge and checking that the balance updates correctly.

### Q: Functional vs Non-Functional Testing

Functional testing checks whether a feature works as per the business requirement. Non-functional testing checks how well the system performs under real conditions — things like speed, load, usability, security, compatibility, localization, and UI.

Telecom example: Functional testing would confirm that a ₹199 recharge adds the correct validity and balance. Non-functional testing would check that the recharge page still loads within 2 seconds even during an IPL-time traffic surge.

### Q: Smoke Testing vs Sanity Testing

Smoke testing confirms that a new build is stable enough to accept for detailed testing. It's broad but shallow — we touch every major area without going deep into any single flow, just to make sure the key functionalities and pages are working.

Sanity testing is the opposite — narrow but deep. After a bug fix or a small code change, we run through the complete flow of that specific area, plus anything it impacts, to confirm the fix works and nothing broke around it.

Telecom examples:

- Smoke: After a new build is deployed, check that login loads, the recharge page loads, the plan list loads, and the payment gateway opens — just a high-level check that nothing's broken.
- Sanity: After fixing a bug in "auto-renew recharge," run the complete auto-renew flow end-to-end, including the wallet/balance areas it touches — but skip unrelated modules like the profile page.

In Agile, smoke testing runs every time a new build is deployed to the QA environment, before sprint testing starts.

### Q: Regression Testing vs Retesting

Regression testing validates that new changes haven't broken any existing functionality. Once QA gets a new build, after smoke testing passes, regression execution kicks off the same day, covering the major critical flows of the application.

Retesting is much narrower — its only purpose is to confirm that a specific defect which was reported earlier is now actually fixed. We just re-run that exact failed test case again.

Telecom example: Retesting would be re-checking that the ₹199 recharge failure bug is now fixed. Regression would be running the major critical flows across the app — the key product flows and scenarios that historically tend to surface bugs.

---

## 2. STLC, SDLC & Documentation

### Q: Entry Criteria vs Exit Criteria

Entry criteria make sure we don't start testing until the pre-requisites are actually ready, so we don't waste effort. Exit criteria define when we can confidently say testing is complete and the build is good to release.

In Agile, once we get a build, we first make sure it's stable by running smoke testing. Our entry criteria — things like user stories being groomed, acceptance criteria being clear, and test data being available from the dev team (mobile numbers, SIM numbers, and so on) — are all covered during the grooming session itself.

Exit criteria fall under test closure activities: no critical bugs should be open, all in-sprint features should be tested with respective bugs logged if any, and metrics along with the daily execution status report must be shared by the end of the sprint.

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

### Q: Test Deliverables and Test Closure

Test deliverables document everything produced during testing so there's traceability and proof of what was actually tested. Test closure formally confirms that testing is done, all deliverables are complete, and the exit criteria are met before sign-off.

Deliverables typically include: the

- Test Plan with end-to-end scenarios for each product and test-cases,
- Test Cases in JIRA, a Traceability Matrix in JIRA linking test cases to user stories,
- Bug Reports,
- a daily Test Summary Report
- test cycle with tests executed passed + failed + blocked with evidences

Telecom example: Before releasing a new recharge offer, the QA lead shares the Test Summary Report and gives closure sign-off to the Product Owner.

In practice, we usually don't send a separate formal sign-off mail, since all risks are already called out in the daily status report. That said, test closure should only happen once all deliverables are complete and the sign-off communication has gone out.

### Q: Traceability Matrix (RTM) and Test Coverage

The RTM makes sure every requirement, progression feature, or in-sprint feature has at least one test case mapped to it, so nothing goes untested. Test coverage measures what percentage of requirements or code is actually covered by our tests.

In practice, we make sure every story we pick up has test cases (and bugs, if any) linked to it, aiming for roughly 100% test coverage for the sprint.

---

## 3. Defects / Bug Life Cycle

### Q: What is a defect? Explain the Bug Life Cycle.

A defect, or bug, is a mismatch between the expected behavior and the actual behavior of the application.

Whenever the application behaves differently from the business requirement or acceptance criteria, it's considered a bug. QA can catch bugs at different stages across both SDLC and STLC.

**Common types of bugs we see:**

- **Requirement Bug** — the requirements themselves are unclear, incomplete, or conflicting. Example: for the Plan Upgrade feature, the acceptance criteria doesn't specify whether prepaid customers are eligible for upgrade.
- **Functional Bug** — the application isn't working as expected. Example: a customer pays successfully for a 5G upgrade, but the plan isn't activated.
- **Regression Bug** — existing functionality breaks after a new change. Example: after implementing a new upgrade flow, invoice generation stops working.
- **Automation Bug** — an issue in the automation script or framework rather than the app itself. Example: the application works correctly, but a Playwright locator changed, so the automation test fails.
- **Production Bug** — an issue found after release to production. Example: customers are unable to complete payment due to a production configuration issue.

**Bug vs Defect:** In day-to-day conversation, we usually call it a "bug" when we spot an issue in the application. Once it's formally logged into JIRA or a test management tool, it becomes a "defect."

**The Defect Lifecycle** is the journey of a defect from identification to closure:

1. **Open** — QA identifies the issue and logs it in JIRA.
2. **Assigned** — the defect is assigned to the responsible developer.
3. **In Progress** — the developer analyzes and works on the fix.
4. **Ready for Retest** — the developer completes the fix and deploys it to the test environment.
5. **Closed** — QA retests the defect; if it now works as per requirements, it's closed.
6. **Reopened** — if the issue still exists or the fix is incomplete, QA reopens it, sending it back into the cycle.
7. **Deferred** — if the business decides not to fix it in the current release, it's moved to a future sprint or release.

In short: QA logs the defect → developer fixes it → QA retests it → defect is closed (or reopened if it's still broken).

### Q: Bug Severity vs Priority

**Severity** indicates how much impact the defect has on the application or business functionality. It's usually determined by QA.

- High severity example: the payment service is failing and the customer can't complete a purchase, or the customer profile API isn't returning data and the dashboard stays blank.
- Low severity example: a logo alignment issue or a typo.

**Priority** indicates how urgently the defect needs to be fixed. It's usually decided during defect triage, by the Product Owner and business stakeholders.

- High priority example: the wrong telecom offer is displayed on the homepage and business wants it corrected immediately, or incorrect pricing is shown during a promotional campaign.
- Low priority example: a minor alignment issue on an internal admin page.

Low priority defects mostly get moved into the JIRA backlog.

**High Severity, Low Priority example:** A customer profile page crashes, but only for legacy retired plans that just 0.5% of users are on. Severity is high because it's a crash, but priority is low because very few users are affected.

**Low Severity, High Priority example:** On the homepage banner, "Upgrade to 5G" is displayed as "Upgarde to 5G." Severity is low since it's cosmetic, but priority is high because it's a customer-facing production branding issue.

### Q: What information should every bug report contain?

When I log a defect in JIRA, I make sure it has enough detail for a developer to reproduce and fix it without needing to come back and ask me questions. That typically includes:

- **Defect ID** — auto-generated by JIRA, e.g., BUG-1456
- **Summary** — a short description, e.g., "Customer dashboard not updated after successful plan upgrade"
- **Feature / User Story** — the related epic or story, e.g., MYAPP-1247
- **Environment** — where it occurred, e.g., SIT or UAT
- **Severity** — impact of the issue (e.g., payment failure is high severity, a logo issue is low)
- **Priority** — business urgency; QA may suggest an initial priority, but the final call usually comes out of triage
- **Steps to Reproduce** — for APIs: endpoint, request payload, headers, authentication, and response received; for UI: the exact navigation steps (e.g., login → navigate to upgrade page → select plan → complete payment)
- **Expected Result** — derived from requirements and acceptance criteria
- **Actual Result** — what actually happened
- **Screenshots / Videos** — screenshots in most cases, videos when the issue needs a flow demonstration
- **Logs** — network logs, API logs, Kibana logs, tracking/correlation IDs
- **Build / Release Information** — build version and release version

### Q: What is Defect Triage?

Defect triage is a meeting where the team reviews open defects and decides whether they're valid or invalid, confirms severity and priority, agrees on a fix timeline, and decides whether they go into the current sprint or the backlog. It usually involves QA, the Dev Lead, the Product Owner, a BA, and sometimes the Scrum Master.

Telecom example: if multiple defects come up during 5G upgrade testing, triage helps decide what's urgent versus what can wait — a critical payment issue gets fixed immediately, while a UI alignment issue gets pushed to a later sprint.

### Q: What if the developer rejects a defect?

This happens fairly often in Agile projects. Whenever a developer rejects a defect.

I don't just drop it — I first re-verify it against the user story, acceptance criteria, requirements, and business rules. Then I discuss it with the developer and back my point with evidence: screenshots, API responses, network logs, Kibana logs with tracking IDs, and the reproduction steps.

For example, if a developer says "the dashboard update delay is expected behavior," I'd go back to the acceptance criteria. If it clearly states the dashboard should reflect the upgraded plan immediately, I share that requirement along with my evidence.

If we still can't agree, I bring in the BA or Product Owner for a final call.

**Interview line:** Whenever a defect is rejected, I validate it against the requirements and discuss it with the developer using evidence. If it's still inconclusive, I involve the BA or Product Owner for clarification.

### Q: What is a Deferred Defect?

A deferred defect is one that's planned to be fixed in a future release, due to lower business priority or a dependency that can't be resolved right now.

Telecom example: after a plan upgrade, there's a PDF invoice alignment issue. The business impact is low, so the PO decides to fix it in the next release — so it gets marked as Deferred.

### Q: What if a bug isn't reproducible?

This comes up a lot, especially with integrations, environment issues, or intermittent failures. If I can't reproduce a bug, I don't close it right away. My approach is:

1. **Re-verify the steps** — run through the same steps multiple times, and double-check the test data, environment, browser, user account, and preconditions. Sometimes a small missed step is the actual cause.
2. **Collect more evidence** — screenshots, videos, API responses, network logs, Kibana logs, correlation/tracking IDs, and the exact timestamp of occurrence.
3. **Check the environment and dependencies** — a lot of non-reproducible issues trace back to environment instability, a database refresh, service downtime, or a third-party API issue.
4. **Discuss it with the dev team** — share the evidence and go through the logs together. For microservices, every API request has a tracking ID in Kibana, so we can pull up all the details even if the issue doesn't reproduce again.
5. **Monitor for recurrence** — if there's enough evidence but it's still not consistently reproducible, I keep it open under a status like "Open," "Need More Information," or "Investigation," depending on the team's process.

Telecom example: while testing Plan Upgrade, a customer's payment failed once with a 500 error, but it worked fine on retry. Instead of closing it, I collected the API response, tracking ID, Kibana logs, and request payload. The dev team later found a temporary timeout issue in the Billing service.

**Interview line:** If a bug isn't reproducible, I don't close it immediately. I gather logs and evidence, validate the test data and environment, work with developers to investigate, and monitor for recurrence before making a decision.

Suppose this is happening in case of API services, there we have tracking id, we try to accumulate logs from that from kibana and share it with dev team.

### Q: What if a production defect occurs?

My first priority is impact assessment. My approach:

1. **Severity analysis** — how many users are affected?
2. **Reproduce** — try to validate it in a lower environment if possible.
3. **Support the dev team** — provide logs, the impacted scenario, and API data.
4. **Hotfix validation** — once the dev team pushes a fix, run smoke and regression on it.

Telecom example: customers are charged money, but their plan isn't upgraded. This gets treated as a high-severity incident — an immediate triage call, a backend hotfix, QA sanity validation in a production-safe environment, and an RCA (root cause analysis) gets documented.

### Q: What if the developer says "it's working fine on my machine"?

This is a common scenario in Agile projects. I don't just drop the discussion — my goal is to figure out why the behavior is different between us. My approach:

- Confirm we're both testing against the same requirement and acceptance criteria.
- Compare environment, test data, user account, and configuration.
- Share screenshots, logs, API responses, tracking IDs, or videos.
- Reproduce the issue together in a quick debugging session.
- Check whether the issue is environment-specific or data-specific.
- If needed, bring in the BA or Product Owner to confirm the expected behavior.

Telecom example: while testing Plan Upgrade, I found the dashboard wasn't showing the upgraded plan, but the developer said it worked fine on his end. When we compared test data, he was using a brand-new customer account, while I was using an older, migrated customer account. Turns out the issue only occurred for migrated customers — so the defect was valid.

**Interview line:** If a developer says it works on their machine, I focus on comparing requirements, environment, test data, and logs. Most of the time, the difference comes down to data, configuration, or environment — not the defect being invalid.

---

## 4. Test Design Techniques

### Q: BVA vs Equivalence Partitioning vs Decision Table vs Error Guessing

In our telecom project, test design techniques help us build effective test scenarios with maximum coverage using the fewest possible test cases. Since we've got multiple customer-facing features — Plan Upgrade, Bill Payment, Customer Onboarding, Account Management, Support Requests — it's just not practical to test every possible combination. So we lean on different design techniques depending on the situation:

1. **Equivalence Partitioning (EP)** — used when input values can be split into valid and invalid groups, so instead of testing every possible value, we test one representative value from each group.

   - Example: a telecom plan requires the customer to be between 18–60 years old. Valid partition: 18–60. Invalid partitions: below 18, above 60.
2. **Boundary Value Analysis (BVA)** — used because defects tend to cluster right at the boundaries of a range.

   - Example: plan upgrade is allowed for customers with a monthly spend between ₹500 and ₹5000. We'd test 499, 500, 501, and 4999, 5000, 5001.
3. **Decision Table Testing** — used when a business rule depends on multiple conditions combined together.

   - Example: a customer can upgrade their plan only if the account is active, there's no outstanding bill, and the eligibility check has passed. Different combinations of these three conditions produce different outcomes, and a decision table lays all of that out clearly.
4. **Error Guessing** — based purely on tester experience and intuition, rather than the written requirements.

   - Example: double-clicking the Upgrade button, refreshing the page mid-payment, or hitting the browser back button during a transaction. These scenarios are rarely called out in the requirements, but they frequently reveal real defects.

### Q: What is Risk-Based Testing?

In a normal Agile sprint, we follow our planned testing strategy — progression testing for the current sprint's stories, impact testing for affected existing flows, and regression testing for existing business functionality.

But sometimes the situation doesn't allow for that full planned coverage, and that's where risk-based testing comes in — we prioritize testing the highest-risk, highest-impact areas first instead of trying to cover everything.

We typically switch to risk-based testing when:

- The build arrives very late in the sprint
- There's an urgent production bug fix or emergency hotfix
- The business requests a last-minute feature addition
- The release timeline gets shortened
- Testing resources are limited
- Environment instability has eaten into the testing window
- A large number of defects are consuming most of the available testing time

### Q: Exploratory Testing vs Ad-hoc Testing

Both are unscripted — there's no formal test case written beforehand — but they differ in how structured the approach is.

**Exploratory testing** is simultaneous learning, test design, and test execution. I explore the application with a general charter or objective in mind (e.g., "explore the recharge flow for edge cases around expired offers"), and I use what I learn while testing to guide what I test next. It's still purposeful and somewhat structured, even without predefined test cases.

**Ad-hoc testing** is more random and unstructured — there's no charter, no plan, just testing based on intuition or a hunch, often to try and break the application quickly.

On a large system-level application, I'd lean toward exploratory testing over pure ad-hoc, because a full system is too large to test randomly without any direction — exploratory at least gives me a charter or area of focus to explore deeply, even if I don't have scripted test cases for it. Pure ad-hoc testing tends to work better for smaller, well-understood modules where I already have a strong intuition for where bugs typically hide.

**Interview line:** Exploratory testing is structured, charter-based simultaneous learning and testing; ad-hoc testing is unstructured and based purely on intuition. For a large system, I'd prefer exploratory testing since it still gives direction, whereas ad-hoc testing works better on smaller, familiar modules.
