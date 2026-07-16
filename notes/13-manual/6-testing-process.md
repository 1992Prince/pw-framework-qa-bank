
# QA Lead Sprint Workflow (End-to-End)

## 1. Backlog Grooming / Refinement

### Objective

Understand upcoming user stories before they enter the sprint.

### Activities

- Product Owner (PO) gives a walkthrough of the user stories.
- Developers discuss the technical implementation and dependencies.
- QA reviews the stories from a testing perspective.

### QA Responsibilities

- Verify Acceptance Criteria (AC) are clear.
- Check if any business requirement is missing.
- Ensure the feature is testable.
- Identify dependent APIs/services.
- Identify external integrations.
- Raise edge cases.
- Discuss test data requirements.
- Clarify non-functional requirements if applicable.

---

# 2. Sprint Planning

### Objective

Select user stories for the upcoming sprint.

### QA Responsibilities

- Estimate testing effort.
- Estimate automation effort.
- Identify regression impact.
- Identify testing dependencies.
- Plan test data requirements.
- Highlight testing risks.
- Confirm build availability expectations.

---

# 3. Sprint Starts

## Test Design Phase

Once development starts, QA begins preparing for testing.

### Activities

- Create Test Scenarios.
- Write Test Cases.
- Prepare Test Data.
- Identify Automation Candidates.
- Review test cases within the QA team.

QA does not wait for development to complete before starting work.

---

# 4. Daily Scrum

Daily stand-up with the Scrum Team.

### QA Status Updates

- Build availability status.
- Previous sprint defect status.
- Current sprint testing progress.
- Test Design progress.
- Test Execution status.
- Automation development status.
- Environment issues.
- Blocking issues.
- Risks impacting sprint completion.

---

# 5. Test Execution

Testing begins once a stable build is available.

### Activities

- Smoke Testing.
- Functional Testing.
- Integration Testing.
- Regression Testing.
- API Testing.
- Automation Execution.
- Defect Reporting.
- Defect Retesting.
- Regression after bug fixes.

---

# 6. Daily Testing Status Report

A testing status report is shared with stakeholders every day.

### Typical Contents

- Test Cases Planned
- Test Cases Executed
- Test Cases Passed
- Test Cases Failed
- Blocked Test Cases
- Open Defects
- Critical Defects
- Environment Issues
- Risks
- Automation Execution Status

---

# 7. Test Management (JIRA)

### User Stories

- Every Test Case is linked to its respective User Story.

### Defects

- Every Bug is linked to the failed Test Case.

### Test Cycle

A separate Test Cycle is created for every release.

The Test Cycle contains:

- Smoke Test Cases
- Functional Test Cases
- Regression Test Cases
- Automation Test Cases

Execution status is updated directly in JIRA.

---

# 8. Sprint Demo

Usually conducted on the last day of the sprint.

### Development Team

Demonstrates the completed functionality.

### QA/Test Lead

Explains:

- Features tested.
- Test coverage.
- Defects found.
- Regression status.
- Overall quality of delivered stories.

---

# 9. Sprint Retrospective

Discuss what went well and what can be improved.

Topics usually include:

- Testing challenges.
- Environment issues.
- Automation improvements.
- Requirement clarity.
- Defect leakage.
- Process improvements.

> In many teams, Sprint Demo and Retrospective are conducted together.

---

# 10. End of Sprint Automation Report

Automation execution summary is prepared.

### Automation Metrics

- Scripts Planned
- Scripts Executed
- Passed
- Failed
- Blocked
- Pending
- Automation Coverage %
- Automation Pass Rate

---

# 11. End of Sprint Manual Testing Report

### Manual Metrics

- Planned Test Cases
- Executed
- Passed
- Failed
- Blocked
- Pending

---

# Important QA Metrics

## Execution Metrics

- Test Case Execution %
- Test Pass %
- Test Fail %
- Blocked Test %
- Pending Test %

---

## Defect Metrics

- Total Defects
- Critical Defects
- High Defects
- Medium Defects
- Low Defects
- Defect Density
- Defect Leakage
- Defect Reopen Rate
- Defect Rejection Rate

---

## Automation Metrics

- Automation Coverage %
- Automation Pass Rate
- Automation Failure Rate
- Scripts Added Per Sprint
- Scripts Pending Automation
- Automation Execution Time
- Manual Effort Saved

---

## Productivity Metrics

- Manual Test Cases Executed
- Automated Test Cases Executed
- Testing Effort (Planned vs Actual)
- Sprint Completion %
- Regression Completion %

---

# Release Process

> Example: 10 Sprints = 1 Release

QA does **not** provide sign-off after every sprint.

QA provides a Release Sign-off only before production deployment.

---

# Release Sign-off Template

## 1. Testing Objective

Purpose of the release.

Example:

Validate Release 5.2 before Production Deployment.

---

## 2. Scope

Features covered in the release.

Example:

- User Registration
- Login
- Payment
- Order Tracking
- Notifications

---

## 3. Testing Status

- Smoke Testing ✅
- Functional Testing ✅
- Regression Testing ✅
- API Testing ✅
- Automation Regression ✅

Execution Summary

- Planned Test Cases
- Executed
- Passed
- Failed
- Blocked

---

## 4. Defect Summary

Include:

- Critical Defects
- High Defects
- Medium Defects
- Low Defects
- Open Defects
- Closed Defects

Mention whether any Critical or High severity defects are still open.

---

## 5. Risks

Clearly explain risks in **business terms**, not technical terms.

Example:

- Credit Card payment is unavailable for approximately 5% of customers.
- Existing users are not impacted.
- A workaround is available using UPI or Net Banking.

Avoid technical statements like:

❌ Payment API timeout.

Prefer:

✅ Customers using Credit Card payments may not be able to complete transactions.

---

## 6. QA Recommendation

Examples:

- Recommended for Release.
- Recommended with Known Risks.
- Not Recommended due to Critical Open Defects.

QA provides an objective quality assessment.

The final release decision is made by the business after understanding the associated risks.
