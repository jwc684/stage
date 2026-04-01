---
description: 코드 리뷰 (변경사항 / PR / 파일 지정)
argument-hint: [pr-number | file-path | 빈칸=현재 변경사항]
allowed-tools: [Read, Glob, Grep, Bash, Agent]
model: opus
---

# Code Review

You are an expert code reviewer. Perform a thorough, professional code review.

## Determine Review Mode

Parse `$ARGUMENTS` to decide which mode to use:

1. **No arguments (empty)** — Review current uncommitted changes
2. **Numeric argument (e.g., `123`)** — Review GitHub PR #$ARGUMENTS
3. **File path or glob pattern** — Review the specified file(s)

---

## Mode 1: Current Changes (no arguments)

Gather the diff:

```
!`git diff HEAD --stat`
```

```
!`git diff HEAD`
```

Review ALL changed files. For each file:

- Identify bugs, logic errors, and edge cases
- Check for security vulnerabilities (SQL injection, XSS, etc.)
- Evaluate code style and consistency with the project conventions
- Look for performance issues
- Check for proper error handling
- Verify TypeScript types are correct

## Mode 2: GitHub PR Review (numeric argument)

Fetch PR details:

```
!`gh pr view $1 --json title,body,additions,deletions,files,reviews`
```

```
!`gh pr diff $1`
```

Review the PR diff thoroughly, then post a review comment summarizing findings using `gh pr review`.

## Mode 3: File/Directory Review (path argument)

Read and review the specified file(s) at `$ARGUMENTS`.

For each file:

- Analyze code quality, readability, maintainability
- Check for bugs and potential issues
- Evaluate error handling and edge cases
- Review security implications
- Suggest concrete improvements

---

## Output Format

Structure your review as follows:

### Summary
One paragraph overview of what was reviewed and overall assessment.

### Issues Found

For each issue, use this format:

**[CRITICAL/WARNING/SUGGESTION]** `file:line` — Description of the issue

```
// problematic code
```

Suggested fix:
```
// fixed code
```

### Positive Highlights
Note 1-3 things done well (good patterns, clean code, etc.)

### Verdict
One of:
- **Approve** — Code is good to merge/deploy
- **Request Changes** — Issues must be fixed before merge
- **Comment** — Minor suggestions, no blockers

---

## Rules

- Be specific: always include file paths and line numbers
- Be constructive: suggest fixes, not just problems
- Prioritize: CRITICAL > WARNING > SUGGESTION
- Follow this project's conventions (Korean UI text, Prisma patterns, Server Actions pattern)
- Check CLAUDE.md for project-specific rules
- Do NOT review generated files (node_modules, .next, src/generated/)
- Keep the review concise and actionable
