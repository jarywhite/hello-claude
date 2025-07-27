---
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git push:*)
description: Stage all changes, commit with provided message, and push to current branch
---

I'll execute a complete git workflow: stage all changes, commit with your message, and push to the current branch.

First, let me stage all changes:

!git add -A

Now I'll commit with your message:

!git commit -m "$ARGUMENTS"

Finally, I'll push to the current branch:

!git push

All changes have been staged, committed with message "$ARGUMENTS", and pushed to the current branch.