
# GitHub

## 1) Created a new project locally and now want to push it to a GitHub remote repository

### 1.1) Generate a Personal Access Token (PAT) in GitHub

Navigate to:

```
Profile Picture
    └── Settings
            └── Developer Settings
                    └── Personal Access Tokens
                            └── Tokens (classic)
```

Click **Generate new token**.

Fill the following details:

- **Note** → Mention the purpose (e.g., Git Authentication)
- **Expiration** → Select an expiration date (I selected **No Expiration**)
- **Scopes** → Select the required permissions using the checkboxes

Click **Generate Token**.

> **Important:** Copy the generated token immediately and keep it in a safe place. GitHub will not show it again.

---

### 1.2) Create a new repository in GitHub

Click **New Repository**, provide the repository name, and create it.

After the repository is created, GitHub will display the repository URL.

---

### 1.3) Copy the GitHub repository URL

Select the **HTTPS** tab and copy the repository URL.

Example:

```text
https://github.com/username/my-project.git
```

---

### 1.4) Navigate to your project folder

```bash
cd C:\Users\Prince\Desktop\PlaywrightProject
```

---

### 1.5) Initialize Git

Run:

```bash
git init
```

This creates an empty **.git** folder inside your project.

---

### 1.6) Stage and Commit your code

#### Check Git status

```bash
git status
```

Initially, all files will appear in **red**, which means they are in the **Working Directory** (not yet staged).

#### Add files to the Staging Area

To add all files:

```bash
git add .
```

Or add specific files:

```bash
git add filename1 filename2
```

Run:

```bash
git status
```

Now all staged files will appear in **green**, which means they are in the **Staging Area**.

If any file is still shown in **red**, it is still in the **Working Directory**.

#### Commit the changes

```bash
git commit -m "Initial Commit"
```

Now your code has been committed to your **Local Git Repository** and is ready to be pushed to GitHub.

---

#### Useful Scenario 1

Suppose after running:

```bash
git add .
```

you realize you don't want to push some files.

Run:

```bash
git reset
```

This removes all staged files and moves them back to the **Working Directory**.

---

#### Useful Scenario 2

Suppose you already committed your code using:

```bash
git commit -m "message"
```

and now realize you accidentally committed some files.

> **To be added later** (Reset, Amend Commit, Remove files from last commit).

---

### 1.7) Connect the Local Repository to the Remote Repository

Currently, your local Git repository does **not** know where your GitHub repository is.

Copy the repository URL from GitHub.

Example:

```text
https://github.com/username/my-project.git
```

---

### 1.8) Add the Remote Repository

Run:

```bash
git remote add origin https://github.com/username/my-project.git
```

Verify the remote:

```bash
git remote -v
```

Expected output:

```text
origin  https://github.com/username/my-project.git (fetch)
origin  https://github.com/username/my-project.git (push)
```

---

### 1.9) Check the Local Branch Name

Run:

```bash
git branch
```

Expected output:

```text
* main
```

If your branch is named **master**, rename it:

```bash
git branch -M main
```

---

### 1.10) Push the Code to GitHub

Run:

```bash
git push -u origin main
```

The **-u** flag sets the upstream branch.

From the next time onward, you only need:

```bash
git push
```

To pull the latest changes:

```bash
git pull
```

---

### 1.11) Authentication

If you're using **HTTPS**, GitHub will ask for:

**Username**

```
Your GitHub Username
```

**Password**

```
Your Personal Access Token (PAT)
```

> **Do NOT use your GitHub account password.**

If your organization uses **Enterprise SSO**, GitHub may open a browser window for authentication.

Click **Login with Browser**, select your enterprise account (NTID), and complete the authentication process.

---

### 1.12) Verify the Push

Open your GitHub repository.

You should now see:

- ✅ Main branch
- ✅ All project files
- ✅ Initial commit successfully pushed

---

# Summary of Commands

```bash
cd C:\Users\Prince\Desktop\PlaywrightProject

git init

git status

git add .

git status

git commit -m "Initial Commit"

git remote add origin https://github.com/username/my-project.git

git remote -v

git branch

git push -u origin main
```

---

# Git File Lifecycle

```text
Working Directory
        │
        │ git add
        ▼
Staging Area
        │
        │ git commit
        ▼
Local Repository
        │
        │ git push
        ▼
Remote Repository (GitHub)
```
