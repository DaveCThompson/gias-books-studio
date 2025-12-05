'use client';

import { useBookStore } from '@/data/stores/bookStore';
import { cn } from '@/utils/cn';
import styles from './PageList.module.css';

export function PageList() {
    const book = useBookStore((state) => state.book);
    const currentPageIndex = useBookStore((state) => state.currentPageIndex);
    const setCurrentPage = useBookStore((state) => state.setCurrentPage);
    const addPage = useBookStore((state) => state.addPage);
    const deletePage = useBookStore((state) => state.deletePage);

    if (!book) return null;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2>Pages</h2>
                <button onClick={addPage} className={styles.addButton}>
                    + Add
                </button>
            </div>

            <ul className={styles.pageList}>
                {book.pages.map((page, index) => (
                    <li
                        key={page.pageNumber}
                        className={cn(styles.pageItem, index === currentPageIndex && styles.active)}
                        onClick={() => setCurrentPage(index)}
                    >
                        <span className={styles.pageNumber}>{page.pageNumber}</span>
                        <span className={styles.pagePreview}>
                            {page.text.slice(0, 30)}...
                        </span>
                        {book.pages.length > 1 && (
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(index);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
