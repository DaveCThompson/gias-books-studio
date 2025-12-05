import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const BOOKS_DIR = path.join(process.cwd(), 'books');

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const assetType = formData.get('assetType') as string | null;

    if (!file || !slug) {
        return NextResponse.json({ error: 'Missing file or slug' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '-');

    // Generate unique filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const prefix = assetType || 'asset';
    const filename = `${prefix}-${baseName}-${timestamp}${ext}`;

    const assetsDir = path.join(BOOKS_DIR, slug, 'assets');

    await mkdir(assetsDir, { recursive: true });
    await writeFile(path.join(assetsDir, filename), buffer);

    const publicPath = `/books/${slug}/assets/${filename}`;
    return NextResponse.json({ path: publicPath });
}
