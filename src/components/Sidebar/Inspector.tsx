'use client';

import { useBookStore } from '@/data/stores/bookStore';
import type { PageData } from '@/data/schemas';
import styles from './Inspector.module.css';

export function Inspector() {
    const getCurrentPage = useBookStore((state) => state.getCurrentPage);
    const updatePage = useBookStore((state) => state.updatePage);
    const page = getCurrentPage();

    if (!page) return null;

    const handleChange = (field: keyof PageData, value: string) => {
        updatePage({ [field]: value || undefined });
    };

    return (
        <aside className={styles.inspector}>
            <h2>Page Settings</h2>

            <div className={styles.field}>
                <label>Mood</label>
                <select
                    value={page.mood || ''}
                    onChange={(e) => handleChange('mood', e.target.value)}
                >
                    <option value="">None</option>
                    <option value="calm">Calm</option>
                    <option value="tense">Tense</option>
                    <option value="joyful">Joyful</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>Layout</label>
                <select
                    value={page.layout || ''}
                    onChange={(e) => handleChange('layout', e.target.value)}
                >
                    <option value="">Default</option>
                    <option value="fullbleed">Full Bleed</option>
                    <option value="split">Split</option>
                    <option value="textOnly">Text Only</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>Illustration</label>
                <input
                    type="text"
                    value={typeof page.illustration === 'string' ? page.illustration : ''}
                    onChange={(e) => handleChange('illustration', e.target.value)}
                    placeholder="/books/slug/assets/..."
                />
            </div>

            <div className={styles.field}>
                <label>Mask</label>
                <input
                    type="text"
                    value={page.mask || ''}
                    onChange={(e) => handleChange('mask', e.target.value)}
                    placeholder="/books/slug/assets/mask.svg"
                />
            </div>

            <div className={styles.field}>
                <label>Narration URL</label>
                <input
                    type="text"
                    value={page.narrationUrl || ''}
                    onChange={(e) => handleChange('narrationUrl', e.target.value)}
                    placeholder="/books/slug/assets/narration.m4a"
                />
            </div>
        </aside>
    );
}
