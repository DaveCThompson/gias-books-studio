# Agent Guidelines for GIA Studio

This document provides context and guidelines for AI agents working on this codebase.

---

## Project Purpose

**GIA Studio** is a WYSIWYG editor for creating interactive children's storybooks. It outputs `data.json` files consumed by the companion viewer app (gias-books).

---

## Architecture Overview

### State Management
- **Zustand** store at `src/data/stores/bookStore.ts`
- Single source of truth for book data, current page, dirty state
- No Redux, no complex action patterns

### Rich Text Editing
- **TipTap** with custom marks for DSL tags
- Custom marks: `ExpressiveMark`, `InteractiveMark`
- DSL converter: `src/utils/dslConverter.ts`

### API Layer
- Next.js App Router API routes
- File-based storage via symlink to viewer's `src/books/`
- No database, no external services

---

## Key Files

| File | Purpose |
|------|---------|
| `src/data/stores/bookStore.ts` | Zustand store (book state) |
| `src/data/schemas.ts` | Zod schemas matching viewer |
| `src/utils/dslConverter.ts` | DSL ↔ HTML conversion |
| `src/editor/marks/*.ts` | TipTap custom marks |
| `src/components/Editor/TextEditor.tsx` | Main rich text editor |
| `src/components/Editor/EditorShell.tsx` | Editor layout wrapper |

---

## Coding Standards

### Patterns to Follow
- Use Zustand selectors: `useBookStore((s) => s.field)`
- CSS Modules for component styles
- `cn()` utility for conditional classes
- Zod for all validation

### SSR Considerations
- TipTap requires `immediatelyRender: false` for Next.js
- Use `'use client'` directive for interactive components
- `suppressHydrationWarning` on body for font classes

---

## Common Tasks

### Adding a new expressive style
1. Add style name to `EXPRESSIVE_STYLES` in `TextEditor.tsx`
2. Add CSS rule in `TextEditor.module.css` for `.editor :global([data-style="..."])`
3. Update DSL converter if needed

### Adding a new page field
1. Update `PageData` interface in `src/data/schemas.ts`
2. Add Zod validation in `PageSchema`
3. Update `Inspector.tsx` with UI control
4. Ensure viewer also supports the field

---

## Testing Workflow

1. Run `npm run dev` to start Studio
2. Edit content, verify changes save correctly
3. Run viewer (`npm run dev` in gias-books) to verify content renders
4. Run `npm run lint` before committing

---

## Symlink Dependency

The `books/` folder is a symlink to `../gias-books/src/books/`. If broken:

```powershell
rmdir books
cmd /c mklink /D books "..\gias-books\src\books"
```
