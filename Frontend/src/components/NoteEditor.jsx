import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Code, Link as LinkIcon,
    Undo, Redo, ChevronLeft, Heading1, Heading2, Heading3,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    Save, Loader
} from 'lucide-react';
import GlassCard from './GlassCard';
import AIChatBar from './AIChatBar';
import API from '../services/api';

const MenuBar = ({ editor, navigate, onSave, isSaving }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const updateHandler = () => setUpdateTrigger(prev => prev + 1);
        editor.on('transaction', updateHandler);
        editor.on('selectionUpdate', updateHandler);
        return () => {
            editor.off('transaction', updateHandler);
            editor.off('selectionUpdate', updateHandler);
        };
    }, [editor]);

    if (!editor) return null;

    const buttons = [
        { icon: <Undo size={18} />, action: () => editor.chain().focus().undo().run(), isActive: false, title: 'Undo' },
        { icon: <Redo size={18} />, action: () => editor.chain().focus().redo().run(), isActive: false, title: 'Redo' },
        { type: 'divider' },
        { icon: <Heading1 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), title: 'H1' },
        { icon: <Heading2 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), title: 'H2' },
        { icon: <Heading3 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }), title: 'H3' },
        { type: 'divider' },
        { icon: <Bold size={18} />, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: 'Bold' },
        { icon: <Italic size={18} />, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: 'Italic' },
        { icon: <UnderlineIcon size={18} />, action: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive('underline'), title: 'Underline' },
        { icon: <Strikethrough size={18} />, action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), title: 'Strike' },
        { type: 'divider' },
        { icon: <AlignLeft size={18} />, action: () => editor.chain().focus().setTextAlign('left').run(), isActive: editor.isActive({ textAlign: 'left' }), title: 'Align Left' },
        { icon: <AlignCenter size={18} />, action: () => editor.chain().focus().setTextAlign('center').run(), isActive: editor.isActive({ textAlign: 'center' }), title: 'Align Center' },
        { icon: <AlignRight size={18} />, action: () => editor.chain().focus().setTextAlign('right').run(), isActive: editor.isActive({ textAlign: 'right' }), title: 'Align Right' },
        { type: 'divider' },
        { icon: <List size={18} />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: 'Bullet List' },
        { icon: <ListOrdered size={18} />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: 'Ordered List' },
        { icon: <Quote size={18} />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), title: 'Blockquote' },
        { icon: <Code size={18} />, action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive('codeBlock'), title: 'Code Block' },
    ];

    return (
        <div className="glass glass-strong" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            maxWidth: '1000px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000,
            borderRadius: '12px',
            flexWrap: 'nowrap', // Prevent wrapping
            justifyContent: 'flex-start',
            overflowX: 'auto' // Allow scrolling if really needed on tiny screens
        }}>
            <button onClick={() => navigate('/app')} className="hover-bg" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                <ChevronLeft size={20} />
            </button>

            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', flex: 1, alignItems: 'center', scrollbarWidth: 'none' }}>
                {buttons.map((btn, index) => (
                    btn.type === 'divider' ?
                        <div key={index} style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px', flexShrink: 0 }} /> :
                        <button
                            key={index}
                            onClick={btn.action}
                            title={btn.title}
                            className="toolbar-btn"
                            style={{
                                background: btn.isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                border: 'none',
                                color: btn.isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            {btn.icon}
                        </button>
                ))}
            </div>

            <button
                onClick={onSave}
                disabled={isSaving}
                className="btn-primary"
                style={{
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: '80px', // Fixed width to prevent jumping
                    justifyContent: 'center'
                }}
            >
                {isSaving ? <Loader size={14} className="spin" /> : <Save size={16} />}
                {isSaving ? 'Saving' : 'Save'}
            </button>
        </div>
    );
};

const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const saveTimeoutRef = useRef(null);
    const isMounted = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Subscript,
            Superscript,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert focus:outline-none',
                style: 'min-height: 60vh; color: var(--text-primary); padding: 20px; font-size: 1.1rem; line-height: 1.8;'
            },
        },
    });

    // Fetch Note
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const { data } = await API.get(`/notes`);
                const note = data.find(n => n._id === id);
                if (note) {
                    setTitle(note.title);
                    if (editor) {
                        editor.commands.setContent(note.content);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (id && editor) {
            fetchNote();
        }
    }, [id, editor]);

    const saveNote = useCallback(async () => {
        if (!editor || isMounted.current || !id) return;

        console.log('saveNote called. ID:', id);
        setIsSaving(true);
        try {
            const content = editor.getHTML();
            const contentPreview = editor.getText().slice(0, 200);

            console.log('Sending PUT request...');
            await API.put(`/notes/${id}`, {
                title,
                content,
                contentPreview
            });
            console.log('PUT request successful');

            if (isMounted.current) {
                setLastSaved(new Date());
            }
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            console.log('Finally block reached. isMounted:', isMounted.current);
            if (!isMounted.current) {
                setIsSaving(false);
                console.log('setIsSaving(false) called');
            }
        }
    }, [id, title, editor]);

    // Handle Editor Updates for Autosave
    useEffect(() => {
        if (!editor) return;

        const updateHandler = () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
                saveNote();
            }, 1000);
        };

        editor.on('update', updateHandler);

        return () => {
            editor.off('update', updateHandler);
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [editor, saveNote]);

    // Save when title changes (debounced)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (title) saveNote();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [title, saveNote]);

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', maxWidth: '900px' }}>
            <MenuBar editor={editor} navigate={navigate} onSave={saveNote} isSaving={isSaving} />

            <GlassCard className="responsive-card-padding" style={{ padding: '40px', minHeight: '80vh', marginTop: '20px' }}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '20px',
                        outline: 'none',
                        fontFamily: 'var(--font-heading)'
                    }}
                />
                <EditorContent editor={editor} />
            </GlassCard>

            <div style={{ textAlign: 'center', marginTop: '10px', opacity: 0.5, fontSize: '0.8rem' }}>
                {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
            </div>

            <AIChatBar editor={editor} />

            <style>{`
        .hover-bg:hover { background: rgba(255,255,255,0.05); color: white !important; }
        .toolbar-btn:hover { background: rgba(255,255,255,0.05); color: white !important; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .ProseMirror p.is-editor-empty:first-child::before { color: #adb5bd; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
        .ProseMirror blockquote { border-left: 3px solid var(--accent-primary); padding-left: 1rem; margin-left: 0; font-style: italic; color: var(--text-secondary); }
        .ProseMirror pre { background: #0d0d0d; border-radius: 0.5rem; color: #fff; font-family: 'JetBrains Mono', monospace; padding: 0.75rem 1rem; }
        .ProseMirror:focus { outline: none; }
      `}</style>
        </div>
    );
};

export default NoteEditor;
