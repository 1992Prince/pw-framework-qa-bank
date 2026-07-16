### **Testing types vs Testing levels**

**Testing Levels** — *WHEN/WHERE in the SDLC testing happens* (structural, sequential stages)

1. **Unit Testing** — individual component/function, done by Dev
2. **Integration Testing** — interaction between modules/components
3. **System Testing** — complete, integrated system as a whole
4. **UAT (User Acceptance Testing)** — business/end-user validates against real-world scenarios

→ Levels are like **layers of testing** — each level builds on the previous one, moving from smallest unit to whole system to business validation.

### **Testing Types** — *WHAT aspect/characteristic of the application is being tested*

* **Functional Testing** — does the feature work as expected (login, provisioning, billing calc, etc.)
* **Non-Functional Testing** — performance, load, security, usability, reliability, scalability
* **Regression Testing** — did new changes break existing functionality
* **Smoke/Sanity Testing** — quick check that build is stable enough for further testing
* **Interoperability Testing** — works correctly with other systems/vendors
* **Compatibility Testing** — across browsers, devices, OS
* **Security Testing** — vulnerabilities, data protection
* 

### **Test Strategy Document**

- Defines the **approach of testing at project level**
- **Static**, not dynamic like a Test Plan — rarely changes, maybe when a new app/module gets onboarded into scope
- **Owned by:** Test Manager / QA Lead / Test Architect
- **Purpose:** Set up the testing process, tools, and standards so everyone on the project follows a consistent approach to achieve quality

**Key Components:**

**MASTER REDD** .

* **M** – **M**etrics *(Defect density, pass rates)*
* **A** – **A**utomation Strategy *(Playwright, Postman)*
* **S** – **S**cope *(What's in vs. out)*
* **T** – **T**est Levels/Types *(Unit, E2E, UAT)*
* **E** – **E**nvironments *(Dev, SIT, Pre-Prod)*
* **R** – **R**oles & Responsibilities *(Architects, Leads, QA)*
* **R** – **R**isk-Based Testing *(Prioritizing when crunched for time)*
* **E** – **E**ntry/Exit Criteria *(Evidence required to start/stop)*
* **D** – **D**efect Management *(JIRA, ALM logging)*
* **D** – **D**eliverables *(Reports, scripts, sign-offs)*

1. **Scope** — which apps/systems are covered vs not. E.g., in E2E testing there are many connected apps, but we don't test everything — 3rd party/external systems are usually excluded
2. **Test Levels/Types** — who owns what:
   - Unit & Integration Testing → Dev team
   - System & E2E Testing → QA team
   - Functional & Non-Functional Testing → QA + Performance teams
   - UAT → Business users
3. **Test Environments** — all envs where testing happens (Dev, SIT, UAT, Pre-Prod, etc.)
4. **Automation Strategy** — client-approved tools for UI + API, e.g., Playwright/Selenium (UI), Postman/Bruno (API), JMeter (performance)
5. **Defect Management** — tool used for defect logging/tracking (JIRA, ALM, etc.) and process around it
6. **Entry/Exit Criteria** — different for functional vs non-functional; needs proper evidence before wrapping up testing — daily test status reports, bug reports, metrics, scripts, and videos for passed scenarios
7. **Risk-Based Testing** — approach to prioritize testing if timelines get compressed due to delays/issues
8. **Roles & Responsibilities** — defines role of Test Architect, Leads, and QAs
9. **Test Deliverables** — the actual outputs tied to exit criteria (reports, scripts, metrics, evidence, sign-off docs)
10. **Test Metrics** — metrics required after every release/sprint by QA Leads (defect density, coverage %, automation %, pass rate, etc.)



