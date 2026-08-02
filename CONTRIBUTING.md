# Contributing to mogplex-docs

## Development Setup

```sh
# Clone the repository
git clone https://github.com/webrenew/mogplex-docs.git
cd mogplex-docs

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run typecheck
pnpm types:check

# Run lint
pnpm lint

# Run tests
pnpm test

# Production build
pnpm build
```

## Project Structure

This is a Next.js documentation site using [Fumadocs](https://fumadocs.vercel.app/). Key directories:

| Directory | Description |
|-----------|-------------|
| `content/` | MDX documentation files |
| `app/` | Next.js app router pages |
| `components/` | React components |
| `lib/` | Utilities and source configuration |
| `scripts/` | Build and generation scripts |
| `tests/` | Test files |

## Commit Style

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new documentation page
fix: correct broken link
chore: update dependencies
docs: improve API reference
```

## Branching

- `main` — primary development branch
- Feature branches via PR

## Pre-commit Hooks

Husky is configured with lint-staged to run ESLint on changed files.

Do not bypass hooks with `--no-verify` unless you have a specific reason and will run checks manually.

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes with appropriate commits
3. Ensure `pnpm types:check && pnpm lint && pnpm test` passes
4. Open a PR with a clear description of changes
5. Address review feedback

## Content Guidelines

- Use clear, concise language
- Include code examples where helpful
- Keep pages focused on a single topic
- Test any code snippets you include

## Questions?

Open a GitHub issue for questions or discussions.
