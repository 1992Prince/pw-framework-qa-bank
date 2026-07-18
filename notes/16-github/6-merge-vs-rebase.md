

## 1. What is Git Merge?

- Git Merge is used to combine changes from one branch into another. 
- It preserves the original commit history of both branches. 
- If the target branch has also received new commits, Git creates a merge commit to combine the two histories. However, if the target branch hasn't changed, Git performs a fast-forward merge, where no merge commit is created.

## 2. What is Git Rebase?

- Git Rebase is also used to combine changes from one branch into another, but it works differently. 
- Instead of creating a merge commit, it moves the feature branch to the latest commit of the target branch and reapplies all the feature branch commits one by one. 
- This creates a clean and linear commit history. Since the commits are recreated, their commit hashes change, meaning Rebase rewrites commit history.

## Git Merge

````md
## What is Git Merge?

Git Merge is used to combine the changes from one branch into another branch.

It preserves the existing commit history. Instead of rewriting commits, Git combines the histories of both branches. Depending on the situation, Git performs either a **Fast-Forward Merge** or creates a **Merge Commit**.

---

# Scenario 1 - Fast-Forward Merge

### Situation

Suppose the `main` branch has the following commits:

```text
main
C1 → C2 → C3 → C4
```

You create a new feature branch from `C4` and make five commits.

```text
feature
C1 → C2 → C3 → C4 → F1 → F2 → F3 → F4 → F5
```

Meanwhile, **no one has added any new commits to `main`**.

To merge the feature branch:

```bash
git checkout main
git merge feature
```

### What happens?

Since the `main` branch has not moved forward after the feature branch was created, Git performs a **Fast-Forward Merge**.

Instead of creating a new merge commit, Git simply moves the `main` branch pointer from `C4` to `F5`.

```text
Before Merge

main
C1 → C2 → C3 → C4

feature
C1 → C2 → C3 → C4 → F1 → F2 → F3 → F4 → F5


After Merge

main
C1 → C2 → C3 → C4 → F1 → F2 → F3 → F4 → F5
```

### Result

- No new merge commit is created.
- `main` now contains **9 commits**:

```text
C1, C2, C3, C4, F1, F2, F3, F4, F5
```

This is called a **Fast-Forward Merge**.

---

# Scenario 2 - Merge Commit (Most Common in Real Projects)

### Situation

Suppose while you were working on your feature branch, another developer also pushed changes to the `main` branch.

The `main` branch now looks like:

```text
main
C1 → C2 → C3 → C4 → C5 → C6
```

Your feature branch still looks like:

```text
feature
C1 → C2 → C3 → C4 → F1 → F2 → F3 → F4 → F5
```

Now merge the feature branch:

```bash
git checkout main
git merge feature
```

### What happens?

Since both branches have progressed independently after `C4`, Git **cannot perform a Fast-Forward Merge**.

Instead, Git creates a new **Merge Commit** (`M`) that combines the histories of both branches.

```text
                 F1 → F2 → F3 → F4 → F5
                /                         \
C1 → C2 → C3 → C4 → C5 → C6 ------------- M
```

### Result

The commit history now contains:

```text
C1, C2, C3, C4, C5, C6, F1, F2, F3, F4, F5, M
```

Total commits:

- Main commits = 6
- Feature commits = 5
- Merge commit = 1

**Total = 12 commits**

This is called a **Three-Way Merge** (or simply a **Merge Commit**).

---

# Summary

| Scenario | What Happens? | Merge Commit Created? |
|----------|---------------|----------------------|
| `main` did not change after branching | Git performs a Fast-Forward Merge by moving the `main` pointer | ❌ No |
| `main` also received new commits | Git performs a Three-Way Merge and creates a Merge Commit | ✅ Yes |
````

Rebase

Bhai, here you go — clean notes format:

---

## Git Rebase — Complete Example Notes

### Initial Setup

```
main branch:     C1 → C2 → C3 → C4 → C5
```

- You create a new branch `feature` from `C5`
- You add 4 new commits on it

```
feature branch:  C1 → C2 → C3 → C4 → C5 → F1 → F2 → F3 → F4
```

### Meanwhile, on Remote

Someone else pushes 2 new commits directly to `main`:

```
main (remote):   C1 → C2 → C3 → C4 → C5 → C6 → C7
```

So now `main` and your `feature` branch have **diverged** from `C5`.

---

### Step 1: Update local `main`

```bash
git checkout main
git pull origin main
```

Local `main` is now: `C1 → C2 → C3 → C4 → C5 → C6 → C7`

### Step 2: Rebase `feature` onto latest `main`

```bash
git checkout feature
git rebase main
```

**What happens internally:**

- Git temporarily removes your commits `F1, F2, F3, F4`
- Moves the base of `feature` from `C5` to `C7`
- **Replays** `F1–F4` one by one on top of `C7`
- Since the base changed, each replayed commit gets a **new commit hash**

New `feature` branch:

```
C1 → C2 → C3 → C4 → C5 → C6 → C7 → F1′ → F2′ → F3′ → F4′
```

✅ Straight, linear history — no fork, no merge commit.

### Step 3: Push the rebased branch

```bash
git push --force-with-lease origin feature
```
