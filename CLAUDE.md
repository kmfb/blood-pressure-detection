# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.4 web application for blood pressure tracking, using TypeScript and the modern App Router architecture.

## Essential Commands

```bash
# Install dependencies (using Bun)
bun install

# Development server with Turbopack
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Run linting
bun run lint
```

## Architecture & Key Technologies

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Package Manager**: Bun (note: bun.lockb file present)
- **React Version**: 19.1.0

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/public`: Static assets
- `@/*`: Path alias configured for imports from root

## Development Notes

1. **No testing framework** is currently set up. Consider adding Vitest or Jest if tests are needed.
2. **ESLint** is available via `next lint` but no custom rules are configured.
3. **Tailwind CSS v4** uses the new PostCSS plugin approach - no tailwind.config.js needed.
4. The project uses **React Server Components** by default - be mindful of client/server boundaries.
5. **TypeScript strict mode** is enabled - maintain type safety.

## Common Tasks

When implementing features:
- Place new pages in `/app` following Next.js App Router conventions
- Use Server Components by default, add `'use client'` only when needed
- Import styles and components using the `@/` alias
- Tailwind classes are available globally via PostCSS