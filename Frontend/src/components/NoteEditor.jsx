import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Loader, Sparkles, Trash2, Download, ChevronDown, Share2, Globe, Lock, Folder } from 'lucide-react';
import "@blocknote/core/fonts/inter.css";
import html2pdf from 'html2pdf.js';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import AIChatBar from './AIChatBar';
import API from '../services/api';
import ConfirmModal from './ConfirmModal';
import { useNotes } from '../context/NotesContext';
import { gsap } from 'gsap';


const MenuBar = ({ navigate, onSave, isSaving, onSummarize, isSummarizing, onDelete, onExport, onShare, isPublic, folders, selectedFolderId, onChangeFolder, className }) => {

    const { sidebarCollapsed } = useNotes();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isFolderMenuOpen, setIsFolderMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`card-neumorphic-outset ${className || ''}`} style={{

            position: 'fixed',
            top: '20px',
            left: isMobile ? '50%' : `calc(50vw + ${sidebarCollapsed ? '40px' : '140px'})`,
            transform: 'translateX(-50%)',
            width: isMobile ? 'calc(100% - 32px)' : `calc(100vw - ${sidebarCollapsed ? '80px' : '280px'} - 96px)`,
            maxWidth: '100%',
            padding: isMobile ? '12px 10px' : '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '4px' : '12px',
            zIndex: 1000,
            borderRadius: '1.5rem',
            background: 'var(--bg-dark)',
            boxShadow: 'var(--neo-btn-outset)',
            border: '1px solid rgba(255,255,255,0.02)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button 
                    onClick={() => navigate('/app')} 
                    className="back-btn-inset" 
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--text-secondary)', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '10px', 
                        borderRadius: '50%', 
                        flexShrink: 0,
                        transition: 'all 0.2s'
                    }}
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="hide-on-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '-0.01em' }}>
                    GlazeNotes / Editor
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
                <button
                    onClick={onSummarize}
                    disabled={isSummarizing || isSaving}
                    className="summarize-btn-neo"
                    style={{
                        padding: isMobile ? '10px' : '10px 18px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '0' : '8px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        background: 'var(--bg-dark)',
                        border: '1px solid rgba(255,255,255,0.01)',
                        borderRadius: '12px',
                        color: 'var(--accent-primary)',
                        cursor: 'pointer',
                        boxShadow: 'var(--neo-btn-outset)',
                        fontFamily: 'Manrope',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    title={isSummarizing ? "Summarizing Note" : "Summarize Note with AI"}
                >
                    {isSummarizing ? <Loader size={14} className="spin" /> : <Sparkles size={14} />}
                    <span className="hide-on-mobile">{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
                </button>

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="btn-primary"
                    style={{
                        padding: isMobile ? '10px' : '10px 20px',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '0' : '8px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        minWidth: isMobile ? 'auto' : '100px',
                        justifyContent: 'center'
                    }}
                    title={isSaving ? "Saving Note" : "Save Note"}
                >
                    {isSaving ? <Loader size={14} className="spin" /> : <Save size={15} />}
                    <span className="hide-on-mobile">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>

                <button
                    onClick={onShare}
                    className="share-btn-neo"
                    style={{
                        padding: isMobile ? '10px' : '10px 14px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        background: isPublic ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-dark)',
                        border: '1px solid rgba(255,255,255,0.01)',
                        borderRadius: '12px',
                        color: isPublic ? '#38bdf8' : 'var(--text-primary)',
                        cursor: 'pointer',
                        boxShadow: 'var(--neo-btn-outset)',
                        fontFamily: 'Manrope',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    title={isPublic ? "Shared Publicly" : "Share Note"}
                >
                    {isPublic ? <Globe size={14} /> : <Share2 size={14} />}
                    <span className="hide-on-mobile">{isPublic ? 'Shared' : 'Share'}</span>
                </button>

                <button
                    onClick={onDelete}
                    className="delete-btn-neo"
                    style={{
                        padding: isMobile ? '10px' : '10px 14px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        background: 'var(--bg-dark)',
                        border: '1px solid rgba(255,255,255,0.01)',
                        borderRadius: '12px',
                        color: '#f87171',
                        cursor: 'pointer',
                        boxShadow: 'var(--neo-btn-outset)',
                        fontFamily: 'Manrope',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    title="Delete Note"
                >
                    <Trash2 size={14} />
                    <span className="hide-on-mobile">Delete</span>
                </button>

                {/* Workspace Folder Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsFolderMenuOpen(!isFolderMenuOpen)}
                        className="folder-select-btn-neo"
                        style={{
                            padding: isMobile ? '10px' : '10px 14px',
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            background: 'var(--bg-dark)',
                            border: '1px solid rgba(255,255,255,0.01)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            boxShadow: 'var(--neo-btn-outset)',
                            fontFamily: 'Manrope',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        title="Move to Workspace"
                    >
                        <Folder size={14} style={{ color: folders?.find(f => f._id === selectedFolderId)?.color || 'var(--text-secondary)' }} />
                        <span className="hide-on-mobile">
                            {folders?.find(f => f._id === selectedFolderId)?.name || 'No Workspace'}
                        </span>
                        <ChevronDown size={14} style={{ marginLeft: '4px' }} className="hide-on-mobile" />
                    </button>

                    {isFolderMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            background: 'var(--bg-dark)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px var(--shadow-dark), inset 1px 1px 2px rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '180px',
                            zIndex: 1001,
                        }}>
                            {/* Unassigned Option */}
                            <button
                                onClick={() => {
                                    onChangeFolder(null);
                                    setIsFolderMenuOpen(false);
                                }}
                                style={{
                                    background: selectedFolderId === null ? 'rgba(255,255,255,0.03)' : 'transparent',
                                    border: 'none',
                                    color: selectedFolderId === null ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    padding: '8px 12px',
                                    textAlign: 'left',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = selectedFolderId === null ? 'rgba(255,255,255,0.03)' : 'transparent';
                                    e.currentTarget.style.color = selectedFolderId === null ? 'var(--accent-primary)' : 'var(--text-secondary)';
                                }}
                            >
                                <Folder size={12} style={{ opacity: 0.5 }} />
                                <span>No Workspace</span>
                            </button>

                            {/* Folders Options */}
                            {folders && folders.map(f => (
                                <button
                                    key={f._id}
                                    onClick={() => {
                                        onChangeFolder(f._id);
                                        setIsFolderMenuOpen(false);
                                    }}
                                    style={{
                                        background: selectedFolderId === f._id ? 'rgba(255,255,255,0.03)' : 'transparent',
                                        border: 'none',
                                        color: selectedFolderId === f._id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = selectedFolderId === f._id ? 'rgba(255,255,255,0.03)' : 'transparent';
                                        e.currentTarget.style.color = selectedFolderId === f._id ? 'var(--accent-primary)' : 'var(--text-secondary)';
                                    }}
                                >
                                    <Folder size={12} style={{ color: f.color || 'var(--accent-primary)' }} />
                                    <span>{f.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                        className="export-btn-neo"
                        style={{
                            padding: isMobile ? '10px' : '10px 14px',
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            background: 'var(--bg-dark)',
                            border: '1px solid rgba(255,255,255,0.01)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            boxShadow: 'var(--neo-btn-outset)',
                            fontFamily: 'Manrope',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        title="Export Options"
                    >
                        <Download size={14} />
                        <span className="hide-on-mobile">Export</span>
                        <ChevronDown size={14} style={{ marginLeft: '4px' }} className="hide-on-mobile" />
                    </button>

                    {isExportMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            background: 'var(--bg-dark)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px var(--shadow-dark), inset 1px 1px 2px rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '160px',
                            zIndex: 1001,
                        }}>
                            {[
                                { id: 'pdf', label: 'PDF Document (.pdf)' },
                                { id: 'docx', label: 'Word Document (.docx)' },
                                { id: 'markdown', label: 'Markdown (.md)' },
                                { id: 'txt', label: 'Plain Text (.txt)' }
                            ].map(format => (
                                <button
                                    key={format.id}
                                    onClick={() => {
                                        onExport(format.id);
                                        setIsExportMenuOpen(false);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.03)';
                                        e.target.style.color = 'var(--text-primary)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    {format.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateNoteState, folders, sidebarCollapsed } = useNotes();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [initialContentLoaded, setInitialContentLoaded] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [noteFolder, setNoteFolder] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [customAlert, setCustomAlert] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showCustomAlert = (title, message, type = 'info') => {
        setCustomAlert({ isOpen: true, title, message, type });
    };

    
    // Editor stats
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [readingTime, setReadingTime] = useState(0);

    const saveTimeoutRef = useRef(null);
    const chatBarRef = useRef(null);

    const editor = useCreateBlockNote();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Helper to compute editor text stats
    const updateStats = useCallback(() => {
        if (!editor) return;
        const text = editor._tiptapEditor?.getText() || '';
        const chars = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const mins = Math.ceil(words / 200); // 200 wpm average reading speed

        setCharCount(chars);
        setWordCount(words);
        setReadingTime(mins);
    }, [editor]);

    // Fetch Note and Load HTML blocks
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const { data } = await API.get(`/notes/${id}`);
                if (data) {
                    setTitle(data.title || '');
                    setNoteFolder(data.folder || null);
                    setIsPublic(data.isPublic || false);
                    if (editor && !initialContentLoaded) {
                        const blocks = await editor.tryParseHTMLToBlocks(data.content || '<p></p>');
                        editor.replaceBlocks(editor.document, blocks);
                        setInitialContentLoaded(true);
                        setTimeout(() => updateStats(), 100);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch note:', err);
            }
        };

        if (id && editor && !initialContentLoaded) {
            fetchNote();
        }
    }, [id, editor, initialContentLoaded, updateStats]);

    // Auto-save logic
    const saveNote = useCallback(async (isManual = false) => {
        if (!id || !editor || !initialContentLoaded) return;
        setIsSaving(true);
        try {
            const htmlContent = await editor.blocksToFullHTML(editor.document);
            const previewText = editor._tiptapEditor?.getText() || '';
            const preview = previewText.substring(0, 160) + (previewText.length > 160 ? '...' : '');

            // Extrapolate auto-tags from the note content
            const words = previewText.toLowerCase().split(/[^a-zA-Z]/).filter(w => w.length > 3);
            const commonTerms = ['react', 'node', 'javascript', 'html', 'css', 'design', 'ideas', 'meetings', 'ai', 'study', 'grocery', 'work', 'personal', 'project', 'finance', 'travel'];
            const tagsSet = new Set();
            words.forEach(word => {
                if (commonTerms.includes(word)) {
                    tagsSet.add(word);
                }
            });
            const autoTags = Array.from(tagsSet).slice(0, 5);

            await API.put(`/notes/${id}`, {
                title: title.trim() === '' ? 'Untitled' : title,
                content: htmlContent,
                contentPreview: preview,
                tags: autoTags,
                isManualSave: isManual
            });
            setLastSaved(new Date());

            // Synchronize with NotesContext list in-memory to reflect immediately on the dashboard without a page refresh
            updateNoteState(id, {
                title: title.trim() === '' ? 'Untitled' : title,
                contentPreview: preview,
                tags: autoTags
            });
        } catch (err) {
            console.error('Auto-save error:', err);
        } finally {
            setIsSaving(false);
        }
    }, [id, editor, title, initialContentLoaded, updateNoteState]);

    const stableEditorChange = useCallback(() => {
        updateStats();
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveNote(false);
        }, 2000);
    }, [updateStats, saveNote]);

    useEffect(() => {
        if (initialContentLoaded) {
            gsap.fromTo('.editor-reveal-element', 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
            );
        }
    }, [initialContentLoaded]);


    // Trigger summarization and load it inside the AI chat interface
    const handleSummarize = async () => {
        if (!editor || isSummarizing) return;
        setIsSummarizing(true);
        try {
            const textContent = editor._tiptapEditor?.getText() || '';
            if (textContent.trim() === '') {
                showCustomAlert('Empty Note', 'Please write something in the note before requesting a summary.', 'warning');
                setIsSummarizing(false);
                return;
            }


            // Open chat bar and trigger summarize endpoint
            if (chatBarRef.current) {
                chatBarRef.current.openWithSummary(textContent);
            }
        } catch (err) {
            console.error('Summarize error:', err);
        } finally {
            setIsSummarizing(false);
        }
    };

    // Global save listener (Ctrl + S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveNote(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [saveNote]);

    // Save when title changes (debounced)
    useEffect(() => {
        if (!initialContentLoaded) return;
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveNote(false);
        }, 1000);
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [title, saveNote, initialContentLoaded]);

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleChangeFolder = async (folderId) => {
        if (!id) return;
        try {
            await API.put(`/notes/${id}`, { folder: folderId || null });
            setNoteFolder(folderId || null);
            updateNoteState(id, { folder: folderId || null });
        } catch (err) {
            console.error('Failed to change note folder:', err);
            showCustomAlert('Error', 'Failed to update note workspace.', 'danger');
        }

    };

    const handleConfirmDelete = async () => {
        if (!id) return;
        try {
            await API.delete(`/notes/${id}`);
            navigate('/app');
        } catch (err) {
            console.error('Failed to delete note:', err);
            showCustomAlert('Error', 'Failed to delete note. Please try again.', 'danger');
        } finally {

            setDeleteModalOpen(false);
        }
    };

    const handleExport = async (format) => {
        if (!editor) return;
        const noteTitle = (title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();

        try {
            if (format === 'markdown') {
                const markdown = await editor.blocksToMarkdownLossy(editor.document);
                const fullContent = `# ${title || 'Untitled'}\n\n${markdown}`;
                downloadBlob(fullContent, 'text/markdown;charset=utf-8', `${noteTitle}.md`);
            } else if (format === 'txt') {
                const text = editor._tiptapEditor?.getText() || '';
                const fullContent = `${title || 'Untitled'}\n\n${text}`;
                downloadBlob(fullContent, 'text/plain;charset=utf-8', `${noteTitle}.txt`);
            } else if (format === 'docx') {
                // Export as HTML encapsulated inside a fake docx blob (Word opens it natively)
                const htmlContent = await editor.blocksToFullHTML(editor.document);
                const fullDocxHTML = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head><meta charset='utf-8'><title>${title || 'Untitled'}</title></head>
                    <body>
                        <h1 style="font-family: sans-serif;">${title || 'Untitled'}</h1>
                        ${htmlContent}
                    </body>
                    </html>
                `;
                downloadBlob(fullDocxHTML, 'application/vnd.ms-word;charset=utf-8', `${noteTitle}.doc`);
            } else if (format === 'pdf') {
                const htmlContent = await editor.blocksToFullHTML(editor.document);
                const pdfContainer = document.createElement('div');
                pdfContainer.innerHTML = `
                    <div style="padding: 40px; font-family: 'Inter', sans-serif; color: #1a1a1a;">
                        <h1 style="margin-bottom: 24px; font-size: 32px; border-bottom: 2px solid #eaeaea; padding-bottom: 12px;">${title || 'Untitled'}</h1>
                        <div style="font-size: 16px; line-height: 1.6;">${htmlContent}</div>
                    </div>
                `;
                
                const opt = {
                    margin:       0,
                    filename:     `${noteTitle}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(pdfContainer).save();
            }
        } catch (err) {
            console.error(`Failed to export ${format}:`, err);
            showCustomAlert('Error', 'Failed to export note.', 'danger');
        }

    };

    const downloadBlob = (content, mimeType, filename) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        if (!id) return;
        try {
            const newPublicState = !isPublic;
            const payload = { isPublic: newPublicState };
            
            await API.put(`/notes/${id}`, payload);
            setIsPublic(newPublicState);
            
            if (newPublicState) {
                const url = `${window.location.origin}/public/${id}`;
                navigator.clipboard.writeText(url);
                showCustomAlert('Link Copied', `Public link copied to clipboard!\n${url}`, 'success');
            } else {
                showCustomAlert('Note Private', 'This note has been successfully set to private.', 'info');
            }
        } catch (err) {
            console.error('Failed to toggle share status:', err);
            showCustomAlert('Error', 'Failed to update share status.', 'danger');
        }

    };

    if (!initialContentLoaded) {
        return (
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '160px', width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Fixed Mock MenuBar */}
                <div className="card-neumorphic-outset" style={{
                    position: 'fixed',
                    top: '20px',
                    left: isMobile ? '50%' : `calc(50vw + ${sidebarCollapsed ? '40px' : '140px'})`,
                    transform: 'translateX(-50%)',
                    width: isMobile ? 'calc(100% - 32px)' : `calc(100vw - ${sidebarCollapsed ? '80px' : '280px'} - 96px)`,
                    maxWidth: '100%',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 1000,
                    borderRadius: '1.5rem',
                    background: 'var(--bg-dark)',
                    boxShadow: 'var(--neo-btn-outset)',
                    border: '1px solid rgba(255,255,255,0.02)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="skeleton-loader-pulse" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-dark)', boxShadow: 'var(--neo-inset)' }} />
                        <div className="skeleton-loader-pulse" style={{ width: '120px', height: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="skeleton-loader-pulse" style={{ width: '90px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                        <div className="skeleton-loader-pulse" style={{ width: '90px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                </div>

                {/* Big Editor Card Skeleton */}
                <div className="card-neumorphic-outset skeleton-loader-pulse" style={{
                    width: '100%',
                    padding: '48px',
                    minHeight: '70vh',
                    marginTop: '32px',
                    borderRadius: '2.5rem',
                    background: 'var(--bg-dark)',
                    boxShadow: 'var(--neo-outset)',
                    border: '1px solid rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {/* Mock Title bar */}
                    <div style={{ width: '60%', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginLeft: isMobile ? '0' : '54px' }} />
                    
                    {/* Mock Paragraph lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                        <div style={{ width: '100%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ width: '95%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ width: '98%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ width: '40%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                        <div style={{ width: '85%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ width: '92%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ width: '30%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
                    </div>
                </div>

                <style>{`
                    @keyframes skeleton-pulse {
                        0%, 100% { opacity: 0.6; }
                        50% { opacity: 0.35; }
                    }
                    .skeleton-loader-pulse {
                        animation: skeleton-pulse 1.8s infinite ease-in-out;
                    }
                `}</style>
            </div>
        );
    }

    return (

        <div className="container" style={{ paddingTop: '120px', paddingBottom: '160px', width: '100%', maxWidth: '100%' }}>
            <MenuBar 
                className="editor-reveal-element"
                navigate={navigate} 
                onSave={() => saveNote(true)} 
                isSaving={isSaving} 
                onSummarize={handleSummarize}
                isSummarizing={isSummarizing}
                onDelete={handleDelete}
                onExport={handleExport}
                onShare={handleShare}
                isPublic={isPublic}
                folders={folders}
                selectedFolderId={noteFolder}
                onChangeFolder={handleChangeFolder}
            />


            {/* Note Editor Main Neumorphic Card container */}
            <div className="card-neumorphic-outset editor-reveal-element" style={{ 
                width: '100%',
                padding: isMobile ? '24px 16px' : '48px', 
                minHeight: '80vh', 
                marginTop: '32px', 
                borderRadius: isMobile ? '1.5rem' : '2.5rem',
                background: 'var(--bg-dark)',
                boxShadow: 'var(--neo-outset)',
                border: '1px solid rgba(255,255,255,0.02)'
            }}>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        fontSize: isMobile ? '1.8rem' : '2.8rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '32px',
                        outline: 'none',
                        fontFamily: 'Manrope',
                        letterSpacing: '-0.02em',
                        paddingLeft: isMobile ? '0' : '54px',
                        transition: 'padding-left 0.2s ease'
                    }}
                />
                
                <div style={{ marginTop: '10px' }}>
                    <BlockNoteView editor={editor} theme="dark" onChange={stableEditorChange} />
                </div>
            </div>

            {/* Editor stats footer panel */}
            <div className="stats-panel editor-reveal-element" style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                marginTop: '24px', 
                padding: '0 16px',
                opacity: 0.6, 
                fontSize: '0.88rem',
                fontFamily: 'Manrope',
                fontWeight: '600',
                gap: isMobile ? '12px' : '0'
            }}>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span><strong>{wordCount}</strong> words</span>
                    <span><strong>{charCount}</strong> characters</span>
                    <span><strong>{readingTime}</strong> min read</span>
                </div>
                <div style={{ marginTop: isMobile ? '4px' : '0' }}>
                    {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
                </div>
            </div>

            <AIChatBar ref={chatBarRef} editor={editor} noteId={id} />

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action is permanent and cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />

            <ConfirmModal
                isOpen={customAlert.isOpen}
                title={customAlert.title}
                message={customAlert.message}
                type={customAlert.type}
                isAlert={true}
                onConfirm={() => setCustomAlert({ ...customAlert, isOpen: false })}
            />


            <style>{`
                .back-btn-inset:hover {
                    box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light) !important;
                    color: var(--text-primary) !important;
                }

                 .folder-select-btn-neo:hover {
                     box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light) !important;
                     transform: translateY(-1px);
                     color: var(--accent-primary) !important;
                 }
                 .folder-select-btn-neo:active {
                     box-shadow: var(--neo-btn-inset) !important;
                     transform: translateY(1px);
                 }

                .summarize-btn-neo:hover {
                    box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light) !important;
                    transform: translateY(-1px);
                    color: var(--text-primary) !important;
                }
                .summarize-btn-neo:active {
                    box-shadow: var(--neo-btn-inset) !important;
                    transform: translateY(1px);
                }

                .delete-btn-neo:hover {
                    box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light) !important;
                    transform: translateY(-1px);
                    background: rgba(239, 68, 68, 0.08) !important;
                    color: #f87171 !important;
                }
                .delete-btn-neo:active {
                    box-shadow: var(--neo-btn-inset) !important;
                    transform: translateY(1px);
                }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                
                /* Override BlockNote elements to fit beautifully in the custom Neumorphic Editor */
                .bn-container {
                    background: transparent !important;
                    padding: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                .bn-editor {
                    background: transparent !important;
                    color: var(--text-primary) !important;
                    font-size: 1.15rem !important;
                    line-height: 1.85 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    min-height: 65vh !important;
                }
                .bn-editor .bn-block-outer {
                    max-width: 100% !important;
                }
                .bn-editor * {
                    font-family: 'Manrope', sans-serif !important;
                }
                
                /* Selection text highlights */
                .bn-editor ::selection {
                    background: rgba(76, 224, 146, 0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default NoteEditor;
