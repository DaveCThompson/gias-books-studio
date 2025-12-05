import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const BOOKS_DIR = path.join(process.cwd(), 'books');

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const pageNumber = formData.get('pageNumber') as string;

    if (!file || !slug) {
        return NextResponse.json({ error: 'Missing file or slug' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const filename = `page-${pageNumber}-illustration${ext}`;
    const assetsDir = path.join(BOOKS_DIR, slug, 'assets');

    await mkdir(assetsDir, { recursive: true });
    await writeFile(path.join(assetsDir, filename), buffer);

    const publicPath = `/books/${slug}/assets/${filename}`;
    return NextResponse.json({ path: publicPath });
}
