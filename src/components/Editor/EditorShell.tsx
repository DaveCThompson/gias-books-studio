'use client';

import { useEffect, useState } from 'react';
import { useBookStore } from '@/data/stores/bookStore';
import { getBook, saveBook } from '@/utils/fileIO';
import { PageList } from '@/components/Sidebar/PageList';
import { Inspector } from '@/components/Sidebar/Inspector';
import { TextEditor } from '@/components/Editor/TextEditor';
import styles from './EditorShell.module.css';

interface EditorShellProps {
    bookSlug: string;
}

export function EditorShell({ bookSlug }: EditorShellProps) {
    const book = useBookStore((state) => state.book);
    const isDirty = useBookStore((state) => state.isDirty);
    const loadBook = useBookStore((state) => state.loadBook);
    const markClean = useBookStore((state) => state.markClean);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getBook(bookSlug).then(loadBook);
    }, [bookSlug, loadBook]);

    const handleSave = async () => {
        if (!book) return;
        setSaving(true);
        setError(null);

        const result = await saveBook(book);

        if (result.success) {
            markClean();
        } else {
            setError(result.error || 'Save failed');
        }

        setSaving(false);
    };

    if (!book) {
        return (
            <div className={styles.loading}>
                <p>Loading book...</p>
            </div>
        );
    }

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h1>
                        {book.title}
                        {isDirty && <span className={styles.dirty}>•</span>}
                    </h1>
                    <span className={styles.author}>by {book.author}</span>
                </div>
                <div className={styles.actions}>
                    {error && <span className={styles.error}>{error}</span>}
                    <button
                        onClick={handleSave}
                        disabled={!isDirty || saving}
                        className={styles.saveButton}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </header>

            <div className={styles.workspace}>
                <PageList />
                <main className={styles.editor}>
                    <TextEditor />
                </main>
                <Inspector />
            </div>
        </div>
    );
}
