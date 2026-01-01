# Code Review Guide

This guide helps code reviewers provide effective and constructive feedback on pull requests.

## Table of Contents

- [Review Principles](#review-principles)
- [What to Look For](#what-to-look-for)
- [Review Process](#review-process)
- [Providing Feedback](#providing-feedback)
- [Review Checklist](#review-checklist)

## Review Principles

### Be Respectful and Constructive

- 🎯 Focus on the code, not the person
- 💬 Use "we" instead of "you" when giving feedback
- ✅ Explain *why* changes are needed
- 🌟 Acknowledge good work and clever solutions
- ❓ Ask questions instead of making demands

### Examples

**Bad**: "This code is wrong."
**Good**: "We might want to handle the error case here. What do you think about adding a try-catch?"

**Bad**: "You didn't follow the style guide."
**Good**: "Let's align this with our style guide by using arrow functions. See STYLE.md for details."

### Be Timely

- ⏱️ Respond to review requests within 24-48 hours
- 🚀 Prioritize smaller PRs for faster feedback
- 📝 If you can't review right away, acknowledge and set expectations

## What to Look For

### Code Quality

#### 1. Correctness

- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Are error conditions handled properly?
- [ ] Is the logic sound and bug-free?

#### 2. Security

- [ ] Are user inputs validated and sanitized?
- [ ] Are there any SQL injection risks?
- [ ] Are secrets or credentials hardcoded?
- [ ] Are authentication/authorization checks in place?
- [ ] Are dependencies secure (check for known vulnerabilities)?

Example security issues:

```typescript
// ❌ Bad: SQL injection risk
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good: Parameterized query
const query = db.select().from('users').where({ id: userId });
```

```typescript
// ❌ Bad: No input validation
function updateUser(email: string) {
  // directly use email without validation
}

// ✅ Good: Input validation
function updateUser(email: string) {
  if (!isValidEmail(email)) {
    throw new InputError('Invalid email format');
  }
  // proceed with update
}
```

#### 3. Performance

- [ ] Are there any obvious performance issues?
- [ ] Are database queries optimized (no N+1 queries)?
- [ ] Is pagination used for large datasets?
- [ ] Are expensive operations cached?
- [ ] Is the bundle size reasonable (for frontend)?

#### 4. Testing

- [ ] Are there tests for new functionality?
- [ ] Do tests cover edge cases?
- [ ] Are tests meaningful and not just testing trivial code?
- [ ] Do tests follow existing patterns in the codebase?

#### 5. Code Style

- [ ] Does it follow the style guide (STYLE.md)?
- [ ] Is the code readable and well-organized?
- [ ] Are variable and function names descriptive?
- [ ] Is the code properly formatted?
- [ ] Are there appropriate comments for complex logic?

### Architecture & Design

#### 1. Design Patterns

- [ ] Does it follow existing patterns in the codebase?
- [ ] Is the abstraction level appropriate?
- [ ] Is code duplication minimized?
- [ ] Are there any anti-patterns?

#### 2. API Design

- [ ] Is the API intuitive and consistent?
- [ ] Are breaking changes necessary and documented?
- [ ] Is backwards compatibility maintained?
- [ ] Are error messages clear and helpful?

#### 3. Dependencies

- [ ] Are new dependencies necessary?
- [ ] Are dependencies up to date and secure?
- [ ] Is the license compatible?
- [ ] Is the bundle size impact acceptable?

### Documentation

- [ ] Is there a changeset (if needed)?
- [ ] Are public APIs documented?
- [ ] Is the README updated (if needed)?
- [ ] Are breaking changes documented?
- [ ] Are code comments helpful and accurate?

## Review Process

### Step 1: Understand the Context

1. Read the PR description and linked issues
2. Understand the problem being solved
3. Review the changeset (if present)
4. Check if tests are included

### Step 2: High-Level Review

1. Review the overall approach and architecture
2. Check if the solution is appropriate for the problem
3. Look for any major design issues
4. Consider alternative approaches if needed

### Step 3: Detailed Code Review

1. Review code line by line
2. Check for bugs, security issues, and performance problems
3. Verify test coverage
4. Check code style and readability

### Step 4: Test the Changes (if applicable)

1. Pull the branch locally
2. Run tests: `yarn test`
3. Test the functionality manually
4. Check for any regressions

### Step 5: Provide Feedback

1. Leave inline comments on specific lines
2. Summarize in a review comment
3. Approve, request changes, or comment as appropriate
4. Be specific about what needs to change

## Providing Feedback

### Comment Types

Use GitHub's review features effectively:

- **Approve**: The PR is ready to merge
- **Request Changes**: Issues must be fixed before merging
- **Comment**: Suggestions or questions, but not blocking

### Writing Effective Comments

#### Use Conventional Comment Prefixes

- `nit:` - Minor/style issue, not blocking
- `suggestion:` - Optional improvement
- `question:` - Need clarification
- `issue:` - Problem that needs fixing
- `security:` - Security concern
- `performance:` - Performance concern

#### Examples

**Nit (Non-blocking style issue)**:
```
nit: Consider renaming `data` to `userData` for clarity
```

**Suggestion (Optional improvement)**:
```
suggestion: We could use Array.map() here for better readability:
```tsx
const names = users.map(u => u.name);
```
```

**Question (Need clarification)**:
```
question: What happens if the API returns null here? Should we handle that case?
```

**Issue (Blocking problem)**:
```
issue: This will cause a memory leak. We need to clean up the event listener:
```tsx
useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```
```

**Security concern**:
```
security: User input is not sanitized here. This could lead to XSS attacks.
Please use the `sanitizeHtml()` helper from '@backstage/core-utils'.
```

### Offering Solutions

When requesting changes, provide guidance:

**Bad**:
```
This is wrong.
```

**Good**:
```
issue: This will fail if `user` is undefined. Consider adding a guard:

```tsx
if (!user) {
  throw new NotFoundError('User not found');
}
```
```

### Recognizing Good Work

Don't forget to acknowledge good solutions:

```
Nice work! This is a clean solution that handles the edge cases well. 👍
```

```
Great idea using memoization here - this will significantly improve performance! ⚡
```

## Review Checklist

### Before Approving

- [ ] PR description is clear and complete
- [ ] Code solves the stated problem
- [ ] Code is tested (unit and/or integration tests)
- [ ] No security vulnerabilities introduced
- [ ] No obvious performance issues
- [ ] Breaking changes are documented
- [ ] Changeset is present (if needed)
- [ ] Documentation is updated (if needed)
- [ ] Code follows style guidelines
- [ ] All conversations are resolved
- [ ] CI checks are passing

### Common Issues to Watch For

#### Security Issues

- [ ] SQL injection vulnerabilities
- [ ] XSS (Cross-Site Scripting) vulnerabilities
- [ ] Hardcoded secrets or credentials
- [ ] Missing authentication/authorization
- [ ] Unsafe user input handling
- [ ] Insecure dependencies

#### Performance Issues

- [ ] N+1 database queries
- [ ] Missing pagination
- [ ] Large bundle sizes
- [ ] Memory leaks
- [ ] Blocking operations
- [ ] Missing caching

#### Code Quality Issues

- [ ] Code duplication
- [ ] Poor naming
- [ ] Lack of error handling
- [ ] Magic numbers/strings
- [ ] Overly complex logic
- [ ] Missing tests

## Special Cases

### Large PRs

For large PRs (>500 lines):

1. Ask the author to split if possible
2. Review in multiple passes (architecture → logic → details)
3. Focus on high-impact areas first
4. Set aside more time for thorough review

### Emergency Fixes

For urgent hotfixes:

1. Still review for security issues
2. Accept that code style can be fixed later
3. Ensure the fix is properly tested
4. Plan a follow-up for improvements

### Breaking Changes

For PRs with breaking changes:

1. Verify breaking changes are necessary
2. Check migration guide is provided
3. Ensure deprecation warnings were in place
4. Verify semver compliance

## Best Practices

### Do's

✅ Review code, not people
✅ Explain your reasoning
✅ Offer alternatives
✅ Be specific
✅ Acknowledge good work
✅ Ask questions
✅ Learn from the code you review

### Don'ts

❌ Be rude or dismissive
❌ Nitpick without explaining why
❌ Request changes without clear reasoning
❌ Let perfect be the enemy of good
❌ Block on purely stylistic issues
❌ Rush through reviews
❌ Approve without actually reviewing

## Resources

- [STYLE.md](../STYLE.md) - Code style guidelines
- [REVIEWING.md](../REVIEWING.md) - PR review guidelines
- [SECURITY.md](../SECURITY.md) - Security guidelines
- [Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)

## Questions?

If you have questions about code review best practices, ask in the [#support channel on Discord](https://discord.gg/backstage-687207715902193673).

---

**Remember**: Code review is a conversation, not a lecture. The goal is to improve the code together! 🤝
