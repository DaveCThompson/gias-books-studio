import { NextResponse } from 'next/server';
import { readdir, readFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const BOOKS_DIR = path.join(process.cwd(), 'books');

export async function GET() {
    try {
        const slugs = await readdir(BOOKS_DIR);
        const books = await Promise.all(
            slugs
                .filter(s => !s.startsWith('.'))
                .map(async (slug) => {
                    try {
                        const data = await readFile(path.join(BOOKS_DIR, slug, 'data.json'), 'utf-8');
                        return JSON.parse(data);
                    } catch {
                        return null;
                    }
                })
        );
        return NextResponse.json(books.filter(Boolean));
    } catch {
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    const { slug, title, author } = await req.json();

    const bookDir = path.join(BOOKS_DIR, slug);
    const assetsDir = path.join(bookDir, 'assets');

    await mkdir(assetsDir, { recursive: true });

    const book = {
        slug,
        title,
        author,
        pages: [{ pageNumber: 1, text: 'Once upon a time...' }],
    };

    await writeFile(path.join(bookDir, 'data.json'), JSON.stringify(book, null, 2));

    return NextResponse.json(book);
}
