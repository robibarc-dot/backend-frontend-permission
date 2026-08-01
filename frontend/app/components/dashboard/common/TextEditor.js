'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import Code from '@tiptap/extension-code';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { useEffect, useCallback, useState } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Undo, Redo,
    Heading1, Heading2, Heading3, Link, Image,
    Table as TableIcon, AlignLeft, AlignCenter, AlignRight,
    Highlighter, Code as CodeIcon, Minus, Type,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    Palette, Columns, Rows, Trash2, Plus, ChevronDown
} from 'lucide-react';

const MenuButton = ({ onClick, active, children, title, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-colors ${
            active ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);

const Divider = () => <span className="w-px h-5 bg-slate-300 mx-1" />;

const FONT_FAMILIES = [
    { label: 'Default', value: 'Inter, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
];

const COLORS = [
    { label: 'Default', value: '#000000' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Gray', value: '#6b7280' },
    { label: 'Dark Blue', value: '#1e40af' },
];

export default function TextEditor({ value, onChange, placeholder = 'Write your content here...' }) {
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontMenu, setShowFontMenu] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                code: false,
                horizontalRule: false,
            }),
            Underline,
            Strike,
            Highlight.configure({ multicolor: true }),
            Code,
            HorizontalRule,
            TextStyle,
            Color,
            FontFamily,
            Subscript,
            Superscript,
            ImageExtension.configure({ inline: true }),
            LinkExtension.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-slate-900',
                placeholder: placeholder,
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    const addLink = useCallback(() => {
        const url = window.prompt('Enter URL:');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const insertTable = useCallback(() => {
        if (editor) {
            editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
            setShowTableMenu(false);
        }
    }, [editor, tableRows, tableCols]);

    const deleteTable = useCallback(() => {
        if (editor) {
            editor.chain().focus().deleteTable().run();
        }
    }, [editor]);

    const addColumnAfter = useCallback(() => {
        if (editor) {
            editor.chain().focus().addColumnAfter().run();
        }
    }, [editor]);

    const addRowAfter = useCallback(() => {
        if (editor) {
            editor.chain().focus().addRowAfter().run();
        }
    }, [editor]);

    const setColor = useCallback((color) => {
        if (editor) {
            editor.chain().focus().setColor(color).run();
            setShowColorPicker(false);
        }
    }, [editor]);

    const setFontFamily = useCallback((font) => {
        if (editor) {
            editor.chain().focus().setFontFamily(font).run();
            setShowFontMenu(false);
        }
    }, [editor]);

    if (!editor) return null;

    const isInTable = editor.isActive('table');

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            {/* Toolbar Row 1 - Text Formatting */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
                {/* Font Family */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowFontMenu(!showFontMenu)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Font Family"
                    >
                        <Type size={14} />
                        <ChevronDown size={12} />
                    </button>
                    {showFontMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 min-w-[160px]">
                            {FONT_FAMILIES.map((font) => (
                                <button
                                    key={font.value}
                                    type="button"
                                    onClick={() => setFontFamily(font.value)}
                                    className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Divider />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                    title="Inline Code"
                >
                    <CodeIcon size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    active={editor.isActive('subscript')}
                    title="Subscript"
                >
                    <SubscriptIcon size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    active={editor.isActive('superscript')}
                    title="Superscript"
                >
                    <SuperscriptIcon size={16} />
                </MenuButton>

                <Divider />

                {/* Text Color */}
                <div className="relative">
                    <MenuButton
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        active={showColorPicker}
                        title="Text Color"
                    >
                        <Palette size={16} />
                    </MenuButton>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 min-w-[160px]">
                            <div className="grid grid-cols-4 gap-1">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setColor(color.value)}
                                        className="w-8 h-8 rounded-lg border border-slate-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                                className="w-full text-left px-2 py-1 mt-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                                Reset color
                            </button>
                        </div>
                    )}
                </div>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive('highlight')}
                    title="Highlight"
                >
                    <Highlighter size={16} />
                </MenuButton>
            </div>

            {/* Toolbar Row 2 - Headings, Lists, Alignment */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 size={16} />
                </MenuButton>

                <Divider />

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </MenuButton>

                <Divider />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    active={false}
                    title="Horizontal Rule"
                >
                    <Minus size={16} />
                </MenuButton>

                <Divider />

                <MenuButton onClick={addLink} active={editor.isActive('link')} title="Insert Link">
                    <Link size={16} />
                </MenuButton>
                <MenuButton onClick={addImage} active={false} title="Insert Image">
                    <Image size={16} />
                </MenuButton>

                <Divider />

                {/* Table Controls */}
                <div className="relative">
                    <MenuButton
                        onClick={() => setShowTableMenu(!showTableMenu)}
                        active={isInTable}
                        title="Table"
                    >
                        <TableIcon size={16} />
                    </MenuButton>
                    {showTableMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 min-w-[200px]">
                            {!isInTable ? (
                                <>
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Insert Table</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <label className="text-xs text-slate-500">Rows:</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={tableRows}
                                                onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                                                className="w-14 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <label className="text-xs text-slate-500">Cols:</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={tableCols}
                                                onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                                                className="w-14 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={insertTable}
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={14} />
                                        Insert Table
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Table Actions</p>
                                    <button
                                        type="button"
                                        onClick={addColumnAfter}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <Columns size={14} />
                                        Add Column
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addRowAfter}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <Rows size={14} />
                                        Add Row
                                    </button>
                                    <button
                                        type="button"
                                        onClick={deleteTable}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete Table
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Divider />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    active={false}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo size={16} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    active={false}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo size={16} />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Table Styles */}
            <style jsx global>{`
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0.5rem 0;
                    overflow: hidden;
                }
                .ProseMirror td, .ProseMirror th {
                    border: 2px solid #e2e8f0;
                    padding: 8px 12px;
                    vertical-align: top;
                    position: relative;
                    min-width: 80px;
                }
                .ProseMirror th {
                    background-color: #f8fafc;
                    font-weight: 600;
                    text-align: left;
                }
                .ProseMirror td {
                    background-color: #ffffff;
                }
                .ProseMirror .selectedCell {
                    background-color: #eff6ff;
                    border-color: #93c5fd;
                }
                .ProseMirror table .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background-color: #3b82f6;
                    pointer-events: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #94a3b8;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .ProseMirror pre {
                    background: #1e293b;
                    color: #e2e8f0;
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    overflow-x: auto;
                }
                .ProseMirror code {
                    background: #f1f5f9;
                    color: #dc2626;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.875em;
                }
                .ProseMirror pre code {
                    background: none;
                    color: inherit;
                    padding: 0;
                    border-radius: 0;
                }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 0.5rem 0;
                }
                .ProseMirror a {
                    color: #3b82f6;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #3b82f6;
                    padding-left: 1rem;
                    color: #64748b;
                    font-style: italic;
                    margin: 0.5rem 0;
                }
                .ProseMirror ul, .ProseMirror ol {
                    padding-left: 1.5rem;
                    margin: 0.25rem 0;
                }
                .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; }
                .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; }
                .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.5rem 0; }
                .ProseMirror hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 1rem 0;
                }
                .ProseMirror mark {
                    background-color: #fef08a;
                    padding: 0 2px;
                    border-radius: 2px;
                }
                .ProseMirror sub { font-size: 0.75em; vertical-align: sub; }
                .ProseMirror sup { font-size: 0.75em; vertical-align: super; }
            `}</style>
        </div>
    );
}