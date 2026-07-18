
# GitHub CI Strategy for Playwright TypeScript Framework

## 1. Multiple Workflow Files

Instead of a single workflow, we maintain multiple workflow files based on the test suite.

* Regression
* Sanity
* BVT
* Smoke (if required)

This gives flexibility to trigger only the required suite.

---

# 2. Workflow Structure

Every GitHub Actions workflow has three main sections:

```yaml
name:
on:
jobs:
```

* **name** → Name displayed under the GitHub Actions tab.
* **on** → Defines **when** the workflow should trigger.
* **jobs** → Defines **what** should be executed.

---

# 3. Workflow Triggers (`on`)

We can trigger workflows in multiple ways.

### Push

Runs automatically whenever code is pushed to the specified branch.

```yaml
push:
  branches: [main, master]
```

### Pull Request

Runs whenever a PR is raised against the specified branch.

```yaml
pull_request:
  branches: [main, master]
```

### Schedule (Cron)

Used for scheduled executions like nightly regression.

```yaml
schedule:
  - cron: '30 0 * * *'
```

> **Note:** Cron only specifies **when** to run. By default, it runs from the repository's **default branch** (usually `main`).

### Workflow Dispatch (Most Used)

We mostly use **workflow_dispatch** because it allows manual execution from GitHub UI.

We can also pass runtime inputs like environment, browser, URL, etc.

```yaml
workflow_dispatch:
  inputs:
    environment:
      description: Environment to test against
      required: false
      default: staging
```

---

# 4. Jobs

After the workflow is triggered, GitHub executes the defined jobs.

Inside a job, we configure:

* Runner
* Container
* Environment Variables
* Steps

---

# 5. Runner

```yaml
runs-on: ubuntu-latest
```

GitHub creates an Ubuntu virtual machine and executes our workflow on it.

---

# 6. Container

```yaml
container:
  image: mcr.microsoft.com/playwright:v1.61.0-noble
```

Instead of installing browsers and Playwright every time, we use Microsoft's official Playwright Docker image which already contains:

* Node.js
* Playwright
* Chromium, Firefox & WebKit
* Required Linux dependencies

This makes execution faster and consistent.

---

# 7. Environment Variables

Framework-specific values are defined under `env`.

Example:

```yaml
env:
  ENV: E2E
  APP_URL: https://...
  API_URL: https://...
  BUILD_NO: ${{ github.run_number }}
```

Inside the framework we access them using:

```ts
process.env.ENV
```

Our framework is designed such that:

* If GitHub passes an environment variable, we use it.
* Otherwise, we fall back to the default value defined inside the framework.

This allows the same code to run both locally and in CI.

---

# 8. Secrets

Sensitive data like:

* Passwords
* API Keys
* Tokens

are stored in:

```
Settings
→ Secrets and Variables
→ Actions
```

and accessed using:

```yaml
${{ secrets.PASSWORD }}
```

Never hardcode secrets inside the YAML file.

---

# 9. Steps

Actual execution happens inside `steps`.

Typical steps are:

### Checkout Repository

```yaml
- uses: actions/checkout@v4
```

Downloads the latest source code.

---

### Install Dependencies

```yaml
npm install
```

Installs all project dependencies.

---

### Execute Playwright Tests

```yaml
npx playwright test
```

Runs the Playwright test suite.

We can also configure:

* retries
* workers
* projects
* tags

---

### Upload Artifacts

```yaml
- uses: actions/upload-artifact@v4
```

Uploads:

* HTML Report
* Screenshots
* Videos
* Traces
* Test Results

These remain available even after the GitHub runner is destroyed.

---

### Send Email

Finally, we use another GitHub Action to send:

* Execution Status
* HTML Report
* Report Link

to the required recipients.

---

# Complete Execution Flow (Interview Answer)

> Whenever the workflow is triggered—either manually using **workflow_dispatch**, automatically on **push/pull request**, or through a **cron schedule**—GitHub creates an Ubuntu runner. Inside that runner, we use the official Playwright Docker image, which already contains Playwright, browsers, and required dependencies. Next, environment variables and secrets are loaded, the latest code is checked out, dependencies are installed, and Playwright tests are executed. After execution, reports, screenshots, traces, and test results are uploaded as artifacts, and finally an email notification is sent with the execution status and report.

---

# Sample Playwright GitHub Workflow

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]

  pull_request:
    branches: [main, master]

  # Runs daily on the default branch (usually main)
  schedule:
    - cron: '30 0 * * *'

  # Manual trigger from GitHub UI with runtime inputs
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: false
        default: 'staging'

jobs:
  test:
    timeout-minutes: 60

    # GitHub hosted runner
    runs-on: ubuntu-latest

    # Official Playwright Docker image
    container:
      image: mcr.microsoft.com/playwright:v1.61.0-noble
      options: --user 1001

    # Framework environment variables
    # Framework first checks CI env variables,
    # otherwise falls back to default values.
    env:
      ENV: E2E
      APP_URL: https://eventhub.rahulshettyacademy.com/login
      APP_STG_URL: https://eventhub.rahulshettyacademy.com/login
      APP_E2E_URL: https://eventhub.rahulshettyacademy.com/login
      API_URL: https://api.staging.myapp.com
      SERVICE_USER: eventhubtestuser1@gmail.com

      # Sensitive values should come from GitHub Secrets
      SERVICE_PASSWORD: ${{ secrets.SERVICE_PASSWORD }}

      BUILD_NO: ${{ github.run_number }}

    steps:
      # Checkout latest source code
      - uses: actions/checkout@v4

      # Install project dependencies
      - name: Install dependencies
        run: npm install

      # Execute Playwright tests
      - name: Run Playwright Tests
        run: npx playwright test --retries=1 --workers=1

      # Upload Playwright HTML report
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      # Upload screenshots/videos/traces/results
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: test-results
          path: test-results/
          retention-days: 30

      - name: Send email report
        if: always()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: princepandey155@gmail.com
          password: ${{ secrets.GMAIL_APP_PASSWORD }}

          subject: Playwright Test Report - ${{ job.status }}

          to: princepandey155@gmail.com
          from: GitHub Actions CI <notifications@example.com>

          html_body: |
            <!DOCTYPE html>
            <html>
              <body>
                <h3>Playwright Execution Summary</h3>
                <!-- Framework can generate dynamic HTML -->
                <!-- from Playwright JSON report -->
              </body>
            </html>
```

#### Send execution summary email

    # DevOps usually provides:
      # - GitHub email action
      # - SMTP server & port
      # - Sender configuration
      # Password should always come from GitHub Secrets.
      # If Playwright generates JSON results, framework can
      # parse them and include Passed/Failed/Skipped counts
      # inside the HTML email body.
