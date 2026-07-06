
These questions are usually asked to check whether you understand the concepts and can explain them clearly. You don't need to go into internal implementation unless the interviewer asks a follow-up. Here are concise, interview-ready answers.

---

# 1) Git Revert vs Git Reset

### Answer

> Both Git Revert and Git Reset are used to undo changes, but they work differently.
>
> **Git Revert** creates a new commit that reverses the changes of a specific commit. It does not remove the original commit from history, so the commit history remains intact. This is the preferred approach for shared branches.
>
> **Git Reset** moves the current branch (HEAD) back to a previous commit, effectively rewriting the local commit history. Depending on the reset mode, it can keep or discard changes. It is mainly used for local changes before they are shared with others.

### One-line difference

* **Revert:** Undo by creating a new commit (history preserved).
* **Reset:** Undo by moving HEAD backward (history rewritten).

### When to use?

* **Revert:** When the commit has already been pushed or is on a shared branch.
* **Reset:** When cleaning up your own local commits before pushing.

---

# 2) Git Reset --soft vs Git Reset --hard

### Answer

> Both commands move the current branch to a previous commit, but the difference is what happens to the changes.
>
> **Git Reset --soft** removes the commits from the local history but keeps all the changes staged, so you can recommit them.
>
> **Git Reset --hard** removes the commits and also discards all staged and working directory changes. The files are reset to the specified commit.

### Simple difference

| `--soft`            | `--hard`                        |
| --------------------- | --------------------------------- |
| Removes commits only  | Removes commits and code changes  |
| Changes remain staged | Changes are permanently discarded |
| Safe for recommitting | Use carefully                     |

### When to use?

* **Soft:** When you want to modify or combine commits.
* **Hard:** When you want to completely discard local changes.

---

# 3) What is Git Cherry-pick?

### Answer

> Git Cherry-pick is used to copy one or more specific commits from one branch to another without merging the entire branch.
>
> For example, if another developer's branch contains five commits but I only need one bug-fix commit, I can use `git cherry-pick <commit-id>` to copy just that commit into my branch.

### When to use?

* Copy a specific bug fix.
* Copy a particular feature commit.
* Avoid merging an entire branch when only selected commits are needed.

---

# 4) Git Merge vs Git Rebase

### Answer

> Both Git Merge and Git Rebase are used to combine changes from one branch into another, but they do it differently.
>
> **Git Merge** combines the histories of both branches. If both branches have new commits, Git creates a merge commit. It preserves the original commit history and is safe for shared branches.
>
> **Git Rebase** moves the feature branch to the latest commit of the target branch and reapplies its commits one by one. This creates a clean, linear history, but since commits are recreated, their hashes change.

### Difference

| Git Merge                     | Git Rebase                         |
| ----------------------------- | ---------------------------------- |
| Preserves commit history      | Rewrites feature branch history    |
| May create a merge commit     | No merge commit                    |
| Commit hashes remain the same | Commit hashes change               |
| Safe for shared branches      | Best for personal feature branches |

### When to use?

* **Merge:** When collaborating on shared branches and you want to preserve history.
* **Rebase:** Before raising a Pull Request to keep the history clean and up to date.

---

# ⭐ If the interviewer asks, "Which one do you use in your project?"

A strong answer is:

> In my project, I usually use **Rebase** on my personal feature branch before creating a Pull Request to keep the commit history clean and to bring my branch up to date with the latest `main`. Once the PR is approved, the repository follows the configured merge strategy to integrate the changes into the main branch. For undoing changes on shared branches, I prefer **Git Revert** because it preserves the commit history.

This sounds practical and demonstrates that you understand both the concepts and their real-world usage.
