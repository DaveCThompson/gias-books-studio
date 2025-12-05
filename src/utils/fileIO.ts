import type { BookData } from '@/data/schemas';
import { BookSchema } from '@/data/schemas';

export async function getBooks(): Promise<BookData[]> {
    const res = await fetch('/api/books');
    return res.json();
}

export async function getBook(slug: string): Promise<BookData> {
    const res = await fetch(`/api/books/${slug}`);
    return res.json();
}

export async function saveBook(book: BookData): Promise<{ success: boolean; error?: string }> {
    // Validate before saving
    const result = BookSchema.safeParse(book);
    if (!result.success) {
        return {
            success: false,
            error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')
        };
    }

    const res = await fetch(`/api/books/${book.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
    });

    if (!res.ok) {
        return { success: false, error: 'Failed to save book' };
    }

    return { success: true };
}

export async function createBook(slug: string, title: string, author: string): Promise<BookData> {
    const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, author }),
    });
    return res.json();
}
