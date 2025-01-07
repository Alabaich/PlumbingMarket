'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const [isHtmlMode, setHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(value);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
            BulletList,
            OrderedList,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['paragraph', 'heading'] }), // Configure text alignment
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setHtmlContent(html);
            onChange(html);
        },
    });

    const toggleHtmlMode = () => {
        if (isHtmlMode && editor) {
            editor.commands.setContent(htmlContent);
        }
        setHtmlMode(!isHtmlMode);
    };

    return (
        <div className="py-2 border-0 bg-white">
            <div className="flex justify-between mb-4 items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2  ${editor?.isActive('bold') ? 'bg-blue-100' : ''
                            }`}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2  ${editor?.isActive('italic') ? 'bg-blue-100' : ''
                            }`}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2  ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100' : ''
                            }`}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-2  ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100' : ''
                            }`}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-2  ${editor?.isActive('bulletList') ? 'bg-blue-100' : ''
                            }`}
                        title="Bullet List"
                    >
                                                <img
                            src={`/icons/bullet_list.svg`}
                            alt="bullet list"
                            className="w-4 h-4"
                        />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={`px-2 ${editor?.isActive('orderedList') ? 'bg-blue-100' : ''
                            }`}
                        title="Ordered List"
                    >
                        <img
                            src={`/icons/ordered_list.svg`}
                            alt="ordered list"
                            className="w-4 h-4"
                        />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                        className={`px-2  ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100' : ''
                            }`}
                        title="Align Left"
                    >
                        <img
                            src={`/icons/text_left.svg`}
                            alt="align left"
                            className="w-4 h-4"
                        />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                        className={`px-2  ${editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100' : ''
                            }`}
                        title="Align Center"
                    >
                        <img
                            src={`/icons/text_center.svg`}
                            alt="align center"
                            className="w-4 h-4"
                        />
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                        className={`px-2  ${editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100' : ''
                            }`}
                        title="Align Right"
                    >
                        <img
                            src={`/icons/text_right.svg`}
                            alt="align right"
                            className="w-4 h-4"
                        />
                    </button>
                </div>
                <button
                    onClick={toggleHtmlMode}
                    className="px-2 py-2 bg-white shadow-md flex items-center gap-2"
                    title={isHtmlMode ? 'Switch to Editor' : 'Edit HTML'}
                >
                    <img
                        src={`/icons/${isHtmlMode ? 'keyboard.svg' : 'code.svg'}`}
                        alt={isHtmlMode ? 'Editor Icon' : 'Code Icon'}
                        className="w-4 h-4"
                    />
                </button>
            </div>

            {isHtmlMode ? (
                <textarea
                    value={htmlContent}
                    onChange={(e) => {
                        setHtmlContent(e.target.value);
                        onChange(e.target.value);
                    }}
                    rows={10}
                    className="w-full p-2 border rounded"
                />
            ) : (
                <EditorContent
                    editor={editor}
                    className="max-h-[450px] bg-gray-50 overflow-y-auto p-2 [&_:focus]:outline-none"
                />

            )}
        </div>
    );
};

export default RichTextEditor;
