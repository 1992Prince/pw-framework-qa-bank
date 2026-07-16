# Manual Testing Interview Q&A — Agile + Telecom (Recharge Domain)

---

## 1. Fundamentals

pending items are
-> Testing principles
-> Tessting objectives
-> Testing types and TEsting levels
Experience in Exploratory/Ad-Hoc testing on System-level : Exploratory testing we avoid
bcoz complete system we can't test . does Embeede testers does Adhoc testing?

-> STLC and SDLC def and phases
SDLC is the complete software development process followed to build an application from requirement gathering till deployment and maintenance. 
Typical phases are:
 Requirement → Design → Development → Testing → Deployment → Maintenance.
 STLC stands for Software Testing Life Cycle.
It is a structured testing process followed by QA team to ensure software quality from requirement analysis till test closure.
STLC Phases
Requirement Analysis
Test Planning
Test Case Design
Test Environment Setup
Test Execution
Test Closure

-> How STLC testing phases fits in AGile testing
We have sprint gromming 
sprint planning
daily scrum call
sprint demo
sprint retrospective
and QA role is in each is?

**Q: Verification vs Validation**
- **Purpose:** Are we building the product right
Verification makes sure we are building the product correctly as per requirements; 
Validation makes sure we built the correct product that actually satisfies the user's need.
- Verification → static, no execution — reviews, walkthroughs, checking requirement docs
- Validation → dynamic, actual execution — running test cases on the real system
- Telecom eg: Verification = reviewing the recharge SRS doc to confirm the offer amount is correctly specified; Validation = actually doing a ₹199 recharge and checking balance updates correctly


**Q: Functional vs Non-Functional Testing**
- **Purpose:** Functional testing's purpose is to check whether the feature works as per business requirement; 
Non-Functional testing's purpose is to check how well the system performs under real conditions — speed, load, usability, security, Compatibility, Localization/Internalization, Usability, UI, and others.
- Telecom eg: Functional = ₹199 recharge adds correct validity and balance; Non-Functional = recharge page still loads under 2 seconds during IPL-time traffic surge


**Q: Smoke Testing vs Sanity Testing**
- **Purpose (Smoke):** basically to confirm the build is stable enough to accept for detailed testing. It's broad but shallow — we don't go deep into any one flow, we just touch every major area.
Purpose of smoke testing is to make sure the major functionalities of the build are working and all key pages are loading properly 

- **Purpose (Sanity):** Purpose of sanity testing is — after a bug fix or a small code change — to run through the entire flow of that specific area and its impacted areas only, to make sure the fix works and nothing around it broke. It's narrow but deep — we go deep into one flow instead of touching everything.
- Telecom eg: Smoke = after new build deploy, check login loads, recharge page loads, plan list loads, payment gateway opens — just confirm nothing is broken at a high level
- Telecom eg: Sanity = after fixing a bug in "auto-renew recharge," run the complete auto-renew flow end-to-end plus wallet/balance areas it touches since balance should be also updated — skip unrelated modules like profile page, etc.
- Agile tie-in: Smoke runs every time a new build is deployed to QA env, before sprint testing starts


**Q: Regression Testing vs Retesting**
- **Purpose (Regression):** Here purpose is to validate build new changes have not broken existing application changes. So when QA team gets new build or code in lower envs, after smoke testing, regression exection triggers same day.

- **Purpose (Retesting):** Purpose of retesting is only to confirm that the specific defect which was reported earlier is now actually fixed — we re-run that exact failed test case again.

- Telecom eg: Retest = re-check that the ₹199 recharge failure bug is now fixed; 
Regression = majore cirtical flows of app, all major flows or products flows and scenraios that gives major bugs


---

## 2. STLC, SDLC & Documentation



**Q: Entry Criteria vs Exit Criteria**
- **Purpose:** Entry criteria's purpose is to make sure we don't start testing until the pre-requisites are actually ready, so we don't waste effort; 
Exit criteria's purpose is to define when we can confidently say testing is complete and the build is good to release.

In Agile testing, once we get build, we make sure our build is stable by running smoke and 
in agile aall our entry criteria like user stroies are groomed, ACS are clear etc are covered in gromming session and test data is available by dev team like mobile numbers or sim nos etc.

Exist Critera comes under test closure activites and no critical bugs should open, all insprint features should be tested and respective bugs should be creted if any , metrics must be shared by sprint end and daily exeution stats report.

**Q: Test Deliverables and Test Closure**
- **Purpose:** Purpose of test deliverables is to document everything produced during testing so there's traceability and proof of what was tested; 
purpose of test closure is to formally confirm testing is done, all deliverables are complete, and exit criteria are met before sign-off.

- Deliverables:  Test Plan(TEst scenarios) with e2e scenarios product wise, Test Cases in JIRA, Traceability Matrix in JIRA by linking tcs with usr stries and tcs cases, Bug Reports, daily Test Summary Report, sprint metircs report 
- Telecom eg: Before releasing a new recharge offer, QA lead shares the Test Summary Report and gives closure sign-off to the Product Owner

Signoff we usually don't send since we call out all risks etc i our daily status report.
But test clouse should only de done once all deliverable are completed and signoff mail is sent.

**Q: Traceability Matrix (RTM) and Test Coverage**
- **Purpose:** Purpose of RTM is to make sure every requirement/progression features/in-sprint features has at least one test case mapped to it, so nothing goes untested; 

Test Coverage's purpose is to measure what percentage of requirements or code is actually covered by our tests.

We make sure whatever stories we got must have test cases linked and bug also and must have Test coverabge of sprint 100% or approx

---

## 4. Defects / Bug Life Cycle

**Q: What is a defect? Explain Bug Life Cycle**

A defect or bug is a mismatch between the expected behavior and actual behavior of the application.
Whenever the application behaves differently from the business requirement or acceptance criteria, it is considered a bug.
QA can identify bugs at different stages of SDLC and STLC

Types of Bugs We Commonly See
Requirement Bug - Requirements are unclear, incomplete, or conflicting.
Example:
 For Plan Upgrade feature, acceptance criteria does not specify whether prepaid customers are eligible for upgrade.
Functional Bug - Application functionality is not working as expected.
Example: Customer successfully pays for 5G upgrade but plan is not activated.
Regression Bug - Existing functionality breaks after a new change.
Example - After implementing a new upgrade flow, invoice generation stops working.
Automation Bug - Issue in automation script or framework.
Example: Application is working correctly but Playwright locator changed and automation test fails.
Production Bug : Issue identified after release to production.
Example: Customers are unable to complete payment due to production configuration issues.
Defect vs Bug
In day-to-day discussions, we usually call it a Bug when we identify an issue in the application.
Once we formally log it into JIRA or any test management tool, it becomes a Defect.

Defect Lifecycle is the journey of a defect from identification until closure.
Step 1: Open - QA identifies the issue and logs it in JIRA. Status: Open
Step 2: Assigned Defect is assigned to the responsible developer. Status: Assigned
Step 3: In Progress Developer analyzes and works on the fix. Status: In Progress
Step 4: Ready for Retest Developer completes the fix and deploys it to the test environment.
Status: Ready for Retest
Step 5: Closed QA retests the defect. If it works according to requirements, defect is closed.
Status: Closed
Step 6: Reopened - If the issue still exists or fix is incomplete, QA reopens the defect.
Status: Reopened/Open
Step 7: Deferred If business decides not to fix the defect in the current release and moves it to a future sprint or release.
Status: Deferred
QA logs defect → Developer fixes → QA retests → Defect closed.
Flow:
New → Logged by QA
Assigned → Assigned to developer
Open/In Progress → Dev analyzed
Fixed → Code deployed in SIT
Retest → QA validated
Closed → Working fine
If issue still exists → Reopened




**Q: Bug Severity vs Priority**
Severity
Severity indicates how much impact the defect has on the application or business functionality.
Usually determined by QA.
Examples
High Severity - Payment service is failing and Customer cannot complete purchase.
High Severity - Customer profile API is not returning customer information.
Or Dashboard remains blank.
Low Severity - Logo alignment issue. Or Typographical mistake.

Priority
Priority indicates how urgently the defect should be fixed.
Usually discussed during defect triage with Product Owner and Business stakeholders. Stakeholders/PO decides the priority.
Examples
High Priority - Wrong telecom offer displayed on homepage or Business wants immediate correction.
High Priority - Incorrect pricing shown during promotional campaign.
Low Priority - Minor alignment issue on internal admin page.

Low Priority defects mostly are moved to JIRA backlogs

5. [IMP] High Severity Low Priority Example
A defect having major impact but less business urgency.
Telecom Example:
Customer profile page crashes only for legacy retired plans which only 0.5% users use.
Severity = High (application crash)
Priority = Low (very few users impacted)
6. [IMP] Low Severity High Priority Example
Minor issue but urgent from business perspective.
Telecom Example:
On homepage banner,
“Upgrade to 5G” displayed as “Upgarde to 5G”
Severity = Low
Priority = High
Because customer-facing production branding issue.


**Q: What information should every bug report contain?**
While creating a defect in JIRA, I provide enough information so that developers can easily reproduce and fix the issue.
Common Fields
Defect ID Automatically generated by JIRA. Example: BUG-1456
Summary Short description of issue.
Example:
"Customer dashboard not updated after successful plan upgrade"
Feature / User Story Related Epic or User Story.
Example: MYAPP-1247
Environment Where issue occurred. Example: SIT / UAT
Severity Impact of issue.
Example:
Payment failure → High Severity
Logo issue → Low Severity
Priority Business urgency.
Initially QA may suggest priority, but final priority is usually discussed during defect triage.
Steps to Reproduce
Detailed steps.
API Example
Endpoint
Request Payload
Headers
Authentication
Response Received
UI Example
Login
Navigate to Upgrade Page
Select Plan
Complete Payment
Expected Result Derived from requirements and acceptance criteria.
Actual Result What actually happened.
Screenshots / Videos
Screenshots are attached in most cases.
Videos are attached when issue requires flow demonstration.
Logs
Examples:
Network Logs
API Logs
Kibana Logs
Tracking IDs
Correlation IDs
Build / Release Information Build Version , Release Version.

What is Defect Triage?
Defect triage is a meeting where team discusses defects and decides:
If defects are Valid or invalid
If defects are Severity/Priority
Fix timeline for priority bugs
Sprint inclusion
Participants:
QA
Dev Lead
Product Owner
BA
Scrum Master (sometimes)
Real Example:
In our sprint, if multiple defects are raised during 5G upgrade testing, triage helps prioritize what goes in current sprint vs backlog.
Critical payment issue → immediate fix
UI alignment issue → later sprint
8. [IMP] What if Developer Rejects Defect?
This is a common situation in Agile projects.
Whenever a developer rejects a defect, I first verify it again against:
User Story
Acceptance Criteria
Requirements
Business Rules
Then I discuss it with the developer and provide supporting evidence.
Evidence Shared
Screenshots
API Responses
Network Logs
Kibana Logs , tracking ids for api and services
Reproduction Steps
Example
Developer says:
"Dashboard update delay is expected behavior."
I review acceptance criteria.
Requirement says:
Customer dashboard should reflect upgraded plan immediately.
I share requirement and evidence.
If discussion is still inconclusive, I involve:
Business Analyst
Product Owner
for clarification.
Interview Line
Whenever a defect is rejected, I validate requirements and discuss it with developers using evidence. If needed, I involve BA or Product Owner for final clarification.


9. [IMP] What is Deferred Defect?
Answer:
A defect planned to fix in future release due to lower business priority or dependency.
Example:
In telecom app, after plan upgrade, PDF invoice alignment issue exists.
Business impact is low.
PO decided:
Fix in next release.
So defect marked Deferred.

What if bug is not reproducible?
This situation happens quite often in real projects, especially when dealing with integrations, environments, network issues, or intermittent failures.
If a bug is not reproducible, I do not immediately close it.
My approach is:
1. Verify the Steps Again
First, I execute the same steps multiple times and validate:
Test data used
Environment
Browser
User account
Preconditions
Sometimes a small missed step causes the issue.
2. Collect More Evidence
I gather as much information as possible:
Screenshots
Videos
API responses
Network logs
Kibana logs
Correlation/Tracking IDs
Timestamp of occurrence
3. Check Environment and Dependencies
Many non-reproducible issues happen because of:
Environment instability
Database refresh
Service downtime
Third-party API issues
I verify if any such issue existed during execution.
4. Discuss with Development Team
I share all available evidence with developers and check logs together. Also for microservices api, for each api request, we have tracking id in Kibana. With that we can retrieve all details. We share those logs with dev team
Sometimes backend logs reveal the issue even if it cannot be reproduced again.
5. Monitor for Recurrence
If sufficient evidence exists but issue cannot be reproduced consistently, I may keep the defect in:
Open
Need More Information
Investigation
depending on team process.
Telecom Example
While testing Plan Upgrade, customer payment failed once with a 500 error.
When I retried, payment worked successfully.
Instead of closing the issue, I collected:
API response
Tracking ID
Kibana logs
Request payload
Development team later found a temporary timeout issue in the Billing service.
Interview Line
If a bug is not reproducible, I don't close it immediately. I gather logs, evidence, validate test data and environment, work with developers to investigate, and monitor for recurrence before making a decision.

16. [IMP] What if Production Defect Occurs?
The first priority is impact assessment.
My approach:
Step 1: Severity Analysis - How many users are affected?
Step 2: Reproduce - Validate in lower environment if possible.
Step 3: Support Dev Team - Provide logs, impacted scenario, API data.
Step 4: Hotfix Validation - Perform smoke/regression once dev team fix the issue.
Example:
Production issue:
Customers charged money but plan not upgraded.
Action:
High severity incident
Immediate triage call
Backend hotfix
QA sanity validation in production-safe environment
RCA documented

Suppose Developer Says "Feature is Working Fine on My Machine". What Will You Do?
This is a common scenario in Agile projects.
If a developer says the feature is working on their machine, I don't immediately close the discussion. My goal is to understand why the behavior is different.
My approach:
Verify that both of us are testing the same requirement and acceptance criteria.
Compare environment, test data, user account, and configuration.
Share screenshots, logs, API responses, tracking IDs, or videos.
Reproduce the issue together in a quick debugging session.
Check whether the issue is environment-specific or data-specific.
If needed, involve BA or Product Owner to validate expected behavior.
Telecom Example
While testing Plan Upgrade, I found that the dashboard was not showing the upgraded plan. The developer said it was working on his machine.
We compared test data and found that he was using a new customer account while I was using an older migrated customer account. The issue was only occurring for migrated customers, so the defect was valid.
Interview Line
If a developer says the feature works on their machine, I focus on comparing requirements, environment, test data, and logs. Most of the time the difference is caused by data, configuration, or environment-specific conditions rather than the defect itself. 🚀


---

## 5. Test Design Techniques

**Q: BVA vs EP vs Decision Table vs Error Guessing**

In our telecom project, Test Design Techniques help us create effective test scenarios with maximum coverage and minimum test cases. Since we have multiple customer-facing functionalities like Plan Upgrade, Bill Payment, Customer Onboarding, Account Management, and Support Requests, it is not practical to test every possible combination. Therefore, we use different test design techniques to identify the most valuable test cases.
Techniques commonly used in our project
1. Equivalence Partitioning (EP)
Used when input values can be divided into valid and invalid groups.
Example:
Customer age eligibility for a telecom plan is 18–60 years.
Valid Partition → 18–60
Invalid Partition → <18
Invalid Partition → >60
Instead of testing every age, we test representative values.

2. Boundary Value Analysis (BVA)
Used because defects commonly occur at boundaries.
Example:
Plan upgrade allowed for customers having monthly spend between ₹500 and ₹5000.
Test:
499
500
501
4999
5000
5001

3. Decision Table Testing
Used when business rules involve multiple conditions.
Example:
Customer can upgrade plan only if:
Account Active = Yes
Outstanding Bill = No
Eligibility Check = Passed
Different combinations create different outcomes.

5. Error Guessing
Based on tester experience.
Example:
While testing plan upgrade:
Double-click Upgrade button
Refresh page during payment
Browser back button during transaction
These scenarios are not always in requirements but frequently reveal defects.


**Q: What is Risk-Based Testing**
In normal Agile sprint, we usually follow our planned testing strategy.
We perform:
Progression Testing (current sprint stories)
Impact Testing (affected existing flows)
Regression Testing (existing business functionalities)
However, sometimes project situations don't allow full planned testing.
That's where Risk Based Testing comes into picture.
We typically perform Risk Based Testing when:
Build is received very late in sprint
Urgent production bug fix is planned
Emergency hotfix deployment
Business requests last-minute feature addition
Release timeline is shortened
Testing resources are limited
Environment instability delays testing
Large number of defects consume testing time


**Q: Exploratory Testing vs Ad-hoc Testing**

?



