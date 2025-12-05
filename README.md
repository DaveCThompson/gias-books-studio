# GIA Studio (gias-books-studio)

A high-craft WYSIWYG story editor for creating interactive children's storybooks. Outputs JSON + assets consumed by the companion [gias-books](https://github.com/DaveCThompson/gias-books) viewer.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the book library.

---

## Project Architecture

### Relationship to Viewer

```
GIA_CODE/
├── gias-books-studio/         ← THIS PROJECT (Editor)
│   └── books/                 ← Symlink → ../gias-books/src/books/
│
└── gias-books/                ← Companion viewer
    └── src/books/
        └── slimey/
            ├── data.json      ← Studio WRITES, Viewer READS
            └── assets/
```

**Key:** The `books/` folder is a symlink to the viewer's source. Edits in Studio are immediately available in the Viewer.

### Symlink Setup

If the `books/` symlink is missing or broken:

```powershell
cd gias-books-studio
rmdir books  # Remove broken symlink
cmd /c mklink /D books "..\gias-books\src\books"
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Rich Text | TipTap with custom marks |
| State | Zustand |
| Validation | Zod |
| Styling | CSS Modules + oklch + Semantic Variables |

### Styling Architecture

Uses the **shared design system** from the viewer:
- **oklch color space** – Perceptual uniformity, easy dark mode via L-shifting
- **Semantic CSS variables** – All colors via `--color-*` tokens
- **Dark mode** – Toggle via 🌙 button (bottom-right), managed by `useThemeManager`
- **Symlink sync** – `src/styles/variables.css` → viewer's tokens

See [../gias-books/docs/DESIGN-SYSTEM.md](../gias-books/docs/DESIGN-SYSTEM.md) for full spec.

---

## Key Features

- **Rich Text Editor** - TipTap-based with custom DSL marks
- **Expressive Text** - `handwritten`, `shout`, `bully` styles
- **Interactive Text** - Tooltips on words
- **Page Management** - Add, delete, reorder pages
- **Asset Upload** - Illustrations, masks, narration
- **Live Sync** - Changes visible in viewer immediately

---

## DSL Tag Format

Content uses a custom DSL format stored in `data.json`:

```
[expressive:handwritten]different[/expressive]
[interactive:wearing glasses]bespectacled[/interactive]
```

The editor converts between DSL and HTML for editing.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/books` | GET | List all books |
| `/api/books` | POST | Create new book |
| `/api/books/[slug]` | GET | Get book data |
| `/api/books/[slug]` | PUT | Save book data |
| `/api/upload` | POST | Upload asset file |

---

## Development Workflow

1. Edit in Studio at `http://localhost:3000`
2. Preview in Viewer at `http://localhost:3001` (run viewer separately)
3. Save in Studio → immediately reflected in Viewer

---

## Git Repository

- **GitHub:** https://github.com/DaveCThompson/gias-books-studio
- **Companion:** https://github.com/DaveCThompson/gias-books
