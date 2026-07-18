
# Working with Existing GitHub Repositories (Industry Workflow)

In most organizations, repositories are already created and contain existing source code.

It is **rare** to create a new repository unless you're starting a completely new project from scratch.

Instead, the typical workflow is:

---

## 1) Clone the Remote Repository

When you join a new project, the first step is to clone the existing remote repository to your local machine.

```bash
git clone https://github.com/username/project.git
```

This downloads the complete repository along with its commit history.

After cloning, you'll be on the default branch, which is usually:

```text
main
```

> **Note:** We do **not** start development directly on the `main` branch. It is considered a bad practice because the `main` branch should always remain stable and production-ready.

---

## 2) Create a New Branch for Development

Create a new branch locally.

```bash
git branch feature/branch-name
```

Example:

```bash
git branch feature/login-page
```

Now switch to the newly created branch.

```bash
git checkout feature/login-page
```

### Shortcut

You can create and switch to the new branch in a single command:

```bash
git checkout -b feature/login-page
```

This is the command most developers use.

---

## 3) Switch Between Existing Branches

To switch to another existing branch:

```bash
git checkout branch-name
```

Example:

```bash
git checkout main
```

or

```bash
git checkout feature/login-page
```

---

## 4) View All Local Branches

Run:

```bash
git branch
```

Example output:

```text
* feature/login-page
  main
  feature/payment
```

The branch marked with `*` is your **currently active branch**.

---

## 5) View Local and Remote Branches

### View Local Branches

```bash
git branch
```

### View Remote Branches

```bash
git branch -r
```

Example:

```text
origin/main
origin/develop
origin/release
```

### View Both Local and Remote Branches

```bash
git branch -a
```

Example:

```text
* feature/login-page
  main
  remotes/origin/main
  remotes/origin/develop
  remotes/origin/release
```

---

## 6) Start Development

Once you're on your feature branch, start implementing your changes.

After completing your work:

```bash
git status

git add .

git commit -m "Implemented login functionality"

git push -u origin feature/login-page i.e. git push -u origin <branch-name>

note -u option is short form of --set-upstream so full command is: git push --set-upstream origin <branch-name>

After setting the upstream, you don't need to specify the remote (`origin`) and branch name again for subsequent pushes and pulls.
```

For subsequent pushes on the same branch, you can simply use:

```bash
git push
```

---

# Topics Covered Later

The following important Git concepts will be covered separately:

- Branching Strategy
- Feature Branch Workflow
- Pull Request (PR) Process
- Code Review Process
- Merge vs Rebase
- Merge Conflict Resolution
- Squash Merge
- Cherry Pick
- Git Stash
- Git Reset
- Git Revert

```

```
