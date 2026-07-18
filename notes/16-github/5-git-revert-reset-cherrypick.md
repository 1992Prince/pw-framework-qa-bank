
Bhai, yeh notes mein kaafi galtiyan hain — especially **git reset** wale part mein (remote ka concept galat likha hai). Chalo sahi karta hoon.

---

## Git Revert

**Purpose:** Undo the changes made by a specific commit **without altering commit history**. It's a safe way to "undo" something because it doesn't delete anything — it adds new history instead.

**How it works:** `git revert` creates a **brand new commit** that applies the exact opposite changes of the target commit — effectively cancelling it out, while the original commit still remains visible in the log.

```bash
git revert <commit-id>
```

To revert multiple commits at once:

```bash
git revert <commit1> <commit2> <commit3>
```

### Example Walkthrough

- View commit history (latest commit shows on top):
  ```bash
  git log
  ```
- Say your first commit is `initialCommitId`, and a later commit is `newCodeCommitId` which you now want to undo.
- Run:
  ```bash
  git revert newCodeCommitId
  ```
- Git opens your default editor (usually Vim) pre-filled with a default commit message like `"Revert 'original commit message'"`. You can edit this message if needed, then save and exit (in Vim: press `Esc`, type `:wq`, hit Enter).
- Git creates a **new commit** (a "third" commit in this example) that removes the changes introduced by `newCodeCommitId` — while `newCodeCommitId` itself stays in the log, untouched.

> **Note:** This new revert commit exists only in your **local** repository until you push it — `git push origin <branch>` — to make it visible on the remote (GitHub).

### Interview Q&A

**Q: What is `git revert` and when do you use it?**
**A:** `git revert` is used to undo the changes introduced by a specific commit by creating a new commit that reverses those changes, without rewriting or deleting any existing commit history. It's preferred over `git reset` on shared/pushed branches because it's safe — it doesn't rewrite history that others may have already pulled.

---

## Git Reset

**Purpose:** Moves the current `HEAD` (and the branch pointer) to a specified earlier commit. Unlike `revert`, this **rewrites history** — the commits after the target commit are effectively removed from that branch's history.

> **Important correction:** `git reset` only affects your **local repository** (commit history + staging area + working directory, depending on the mode). It does **not** touch the remote (GitHub) at all — unless you explicitly run `git push --force` (or `--force-with-lease`) afterward to overwrite the remote branch too.

There are 3 modes:

### 1. `git reset --soft <commit-id>`

```bash
git reset --soft <commit-id>
```

- Moves `HEAD` back to `<commit-id>`.
- All changes from the commits after that point are kept — and remain **staged** (ready to commit again).
- Working directory files are untouched.
- Use case: You want to squash several commits into one, but keep all the code changes ready to re-commit.

### 2. `git reset --mixed <commit-id>` (this is the default mode if you just type `git reset`)

```bash
git reset --mixed <commit-id>
```

- Moves `HEAD` back to `<commit-id>`.
- Changes from later commits are **unstaged**, but still present in your working directory as uncommitted changes.
- Use case: You want to redo how you group/stage your commits from scratch.

### 3. `git reset --hard <commit-id>`

```bash
git reset --hard <commit-id>
```

- Moves `HEAD` back to `<commit-id>`.
- **Discards everything** — both staged changes and working directory changes are permanently deleted.
- The code from the removed commits is gone from your local machine entirely (not recoverable through normal means).

> ⚠️ **Always be very careful with `git reset --hard`** — you will permanently lose those code changes locally. Avoid using it unless you're absolutely sure you don't need that code anymore.

You can confirm which commits remain using:

```bash
git log
```

### If You Need Remote Reflected Too

None of the above modes touch GitHub by default. If you want the remote branch's history to match your local reset, you must force-push:

```bash
git push --force-with-lease origin <branch-name>
```

⚠️ Do this **only** on branches nobody else is working on — force-pushing rewrites history for everyone who has pulled that branch.

---

## Revert vs Reset

|                                 | Git Revert                     | Git Reset                                                                            |
| ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| Commit history                  | Preserved — adds a new commit | Rewritten — removes commits                                                         |
| Safe for shared/pushed branches | ✅ Yes                         | ❌ No (requires force-push, risky for others)                                        |
| What happens to old commit      | Stays visible in log           | Removed from log (in soft/mixed, code still exists elsewhere; in hard, code is gone) |

**Recommended for team projects:** Prefer `git revert` — since it preserves commit history and is safe to use even after pushing to a shared branch. `git reset` should generally be avoided on branches other people are also using.

---

## Git Cherry-pick

**Purpose:** Apply one or more **specific commits** from one branch onto another branch — without merging the entire branch.

### Example Scenario

- Rupali creates a branch from `main` and makes 3 commits.
- Andrew separately creates another branch from `main` and makes 4 commits.
- Both branches are pushed to GitHub.
- You only want:
  - Rupali's **3rd commit**
  - Andrew's **2nd** and **4th** commits
    ...and you want to bring just these into `main` (or any other target branch) — without merging Rupali's or Andrew's full branches.

### Steps

1. Make sure you have all branches available locally (clone/fetch them).
2. Checkout the branch where you want the commits applied:
   ```bash
   git checkout main
   ```
3. Cherry-pick the specific commits:
   ```bash
   git cherry-pick <rupali-3rd-commit-id> <andrew-2nd-commit-id> <andrew-4th-commit-id>
   ```
4. Git applies each of these commits as **new commits** (with new hashes) on top of your current branch, in the order you listed them.
5. **Conflicts may occur** — since these commits were made in the context of a different branch history, Git might not be able to apply them cleanly. Resolve conflicts the same way as a merge/rebase conflict, then continue:
   ```bash
   git cherry-pick --continue
   ```
6. Once done, push the updated branch to remote:
   ```bash
   git push origin main
   ```

**Use case:** Useful when you need to bring in only a few important fixes/features from someone else's branch without pulling in their entire (possibly unfinished or unrelated) set of changes.
