# Git Branches

## What are Git Branches?

A **branch** in Git is an independent line of development. It allows developers to work on new features, bug fixes, or experiments without affecting the main codebase.

A branch is **not a separate copy of the project**. Instead, it points to a different commit in the same repository. Git stores branches very efficiently, so creating branches is fast and lightweight.

### Why do we use branches?

- Develop new features independently.
- Fix bugs without affecting production code.
- Experiment safely.
- Allow multiple developers to work in parallel.
- Review code before merging into the main branch.

---

# Best Practices

- ❌ Never develop directly on the `main` branch.
- ❌ Never push directly to the `main` branch.
- ✅ Create a separate feature branch for every task or user story.
- ✅ Raise a Pull Request (PR) for code review.
- ✅ Merge only after the code has been reviewed and approved.
- ✅ Delete feature branches after they are merged.

> In most organizations, direct pushes to the `main` branch are protected using **Branch Protection Rules** on GitHub, GitLab, or Bitbucket.

---

# Typical Branching Workflow

## Step 1 - Create a Feature Branch

Switch to the latest `main` branch.

```bash
git checkout main
git pull origin main
```

Create a new feature branch.

```bash
git checkout -b feature/login-page
```

---

## Step 2 - Develop Your Feature

Make your code changes.

Check modified files.

```bash
git status
```

Stage changes.

```bash
git add .
```

Commit the changes.

```bash
git commit -m "Implemented login page"
```

---

## Step 3 - Push the Branch

Push the new branch to GitHub.

```bash
git push -u origin feature/login-page
```

The first push creates the remote branch.

Future pushes require only:

```bash
git push
```

---

## Step 4 - Create a Pull Request (PR)

After pushing the branch:

1. Open the GitHub repository.
2. GitHub usually displays a banner saying:

```
feature/login-page had recent pushes
```

along with the button:

```
Compare & pull request
```

Click **Compare & pull request**.

---

## Step 5 - Fill Pull Request Details

Provide:

- Meaningful PR title
- Description of changes
- Testing performed
- Any notes for reviewers

Assign:

- Reviewers (Architect, Tech Lead, Team Members)
- Assignee (if required)

Then click:

```
Create Pull Request
```

---

## Step 6 - Code Review

Reviewers may:

- Approve the PR
- Request changes
- Add review comments

Update your code based on review comments.

Commit the changes.

Push again.

```bash
git add .
git commit -m "Addressed review comments"
git push
```

The existing PR updates automatically.

---

## Step 7 - Merge the Pull Request

Once:

- CI/CD checks pass
- Code review is approved
- No merge conflicts exist

Merge the PR.

Depending on repository settings, GitHub may offer:

- Merge Commit
- Squash and Merge
- Rebase and Merge

Many organizations prefer **Squash and Merge** for a cleaner commit history.

---

## Step 8 - Delete the Feature Branch

After successful merge:

Delete the feature branch from GitHub.

Optionally delete it locally.

```bash
git branch -d feature/login-page
```

---

# Scenario 1

## Main branch changed while I was working

Suppose:

- Developer A is working on `feature/login-page`.
- Meanwhile Developer B merges changes into `main`.
- Developer A's work is in completely different files.

Developer A:

- finishes development
- pushes the branch
- creates a PR

GitHub shows:

```
This branch has no conflicts with the base branch.
```

The PR merges successfully.

### Why no conflict?

Because both developers modified different files (or different lines).

Git can merge these changes automatically.

---

## Can there still be problems?

Yes.

Even though Git merged successfully, the newly merged code may:

- break application behavior
- fail tests
- introduce integration issues

A successful merge does **not** guarantee working software.

---

## Industry Best Practice

Before pushing your feature branch:

Update your local `main`.

```bash
git checkout main
git pull origin main
```

Switch back.

```bash
git checkout feature/login-page
```

Merge the latest `main`.

```bash
git merge main
```

Resolve conflicts (if any).

Run:

- Unit Tests
- Automation Tests
- Smoke Tests

Verify everything works.

Only then push your feature branch.

This helps detect issues before creating the Pull Request.

---

# Scenario 2

## Merge Conflict

Suppose:

Developer A and Developer B both modify the same file.

Developer A merges first.

Developer B then creates a PR.

GitHub displays:

```
Can't automatically merge
```

or

```
This branch has conflicts that must be resolved.
```

GitHub cannot determine which version should be kept.

---

## Ways to Resolve Conflicts

### Option 1 (Recommended)

Resolve conflicts locally.

### Option 2

Resolve conflicts using GitHub's web editor.

### Option 3

Resolve conflicts using an IDE like IntelliJ IDEA or Visual Studio Code.

---

# Recommended Conflict Resolution Workflow

Update local `main`.

```bash
git checkout main
git pull origin main
```

Switch back to your feature branch.

```bash
git checkout feature/login-page
```

Merge `main`.

```bash
git merge main
```

If conflicts exist, Git displays something like:

```
CONFLICT (content): Merge conflict in LoginPage.java
```

Open the conflicting file.

You'll see markers similar to:

```text
<<<<<<< HEAD
Your changes
=======
Changes from main
>>>>>>> main
```

Choose the correct code.

Remove the conflict markers.

Save the file.

Stage the resolved files.

```bash
git add .
```

Complete the merge.

```bash
git commit
```

Push the updated branch.

```bash
git push
```

Your Pull Request will automatically update.

---

# Using IntelliJ IDEA or Visual Studio Code

Modern IDEs make Git much easier.

They provide graphical interfaces to:

- Create branches
- Switch branches
- Pull latest changes
- Merge branches
- Resolve merge conflicts visually
- Compare file differences
- Commit changes
- Push changes
- Create Pull Requests (using extensions)

Instead of manually editing conflict markers, IDEs provide side-by-side comparison tools where you can choose:

- Accept Current Change
- Accept Incoming Change
- Accept Both Changes

This significantly simplifies conflict resolution.

---

# Common Interview Questions

### Q1. How do you resolve merge conflicts in your project?

**Answer:**

- Pull the latest `main` branch.
- Merge `main` into my feature branch locally.
- Resolve conflicts using IntelliJ IDEA or VS Code.
- Run tests.
- Commit the resolved changes.
- Push the updated feature branch.
- Continue with the existing Pull Request.

---

### Q2. When do merge conflicts occur?

Merge conflicts occur when:

- Two developers modify the same file.
- The same lines (or nearby lines) are changed differently.
- Git cannot determine which version should be kept automatically.

---

### Q3. What best practices do you follow to avoid merge conflicts?

- Create small, focused Pull Requests.
- Pull the latest `main` branch frequently.
- Merge `main` into the feature branch regularly.
- Push changes frequently.
- Communicate with teammates working on the same modules.
- Resolve conflicts locally before raising a Pull Request.
- Run tests before pushing changes.