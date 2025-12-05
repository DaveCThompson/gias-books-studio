'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { ExpressiveMark } from '@/editor/marks/ExpressiveMark';
import { InteractiveMark } from '@/editor/marks/InteractiveMark';
import { dslToHtml, htmlToDsl } from '@/utils/dslConverter';
import { useBookStore } from '@/data/stores/bookStore';
import { useEffect } from 'react';
import styles from './TextEditor.module.css';

const EXPRESSIVE_STYLES = ['handwritten', 'shout', 'bully'];

export function TextEditor() {
    const getCurrentPage = useBookStore((state) => state.getCurrentPage);
    const updatePage = useBookStore((state) => state.updatePage);
    const page = getCurrentPage();

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: false }),
            Underline,
            ExpressiveMark,
            InteractiveMark,
        ],
        content: page ? dslToHtml(page.text) : '',
        onUpdate: ({ editor }) => {
            const dsl = htmlToDsl(editor.getHTML());
            updatePage({ text: dsl });
        },
    });

    // Update editor when page changes
    useEffect(() => {
        if (editor && page) {
            const currentHtml = editor.getHTML();
            const newHtml = dslToHtml(page.text);
            if (currentHtml !== newHtml) {
                editor.commands.setContent(newHtml);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, page?.pageNumber]);

    if (!editor || !page) return null;

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? styles.active : ''}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? styles.active : ''}
                >
                    I
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? styles.active : ''}
                >
                    U
                </button>

                <span className={styles.divider} />

                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            editor.chain().focus().setExpressive(e.target.value).run();
                        } else {
                            editor.chain().focus().unsetExpressive().run();
                        }
                        e.target.value = '';
                    }}
                    defaultValue=""
                >
                    <option value="">Expressive...</option>
                    {EXPRESSIVE_STYLES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        const tooltip = prompt('Enter tooltip text:');
                        if (tooltip) {
                            editor.chain().focus().setInteractive(tooltip).run();
                        }
                    }}
                >
                    📖 Interactive
                </button>

                <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    Clear
                </button>
            </div>

            <EditorContent editor={editor} className={styles.editor} />
        </div>
    );
}
