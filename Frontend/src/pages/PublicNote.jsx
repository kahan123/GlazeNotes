import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

const PublicNote = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Instantiate editor with blocknote
    const editor = useCreateBlockNote({});

    useEffect(() => {
        const fetchPublicNote = async () => {
            try {
                // Since this is a public route, we don't need axios instance with auth interceptors
                // We'll use native fetch or a clean axios instance if available.
                // Assuming Vite proxy handles /api
                const response = await fetch(`http://localhost:5000/api/notes/public/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("This note is either private or doesn't exist.");
                    }
                    throw new Error("Failed to load note.");
                }

                const data = await response.json();
                setNote(data);

                // Try to load content into editor
                if (data.content) {
                    try {
                        let parsedBlocks;
                        try {
                            parsedBlocks = JSON.parse(data.content);
                        } catch (e) {
                            parsedBlocks = await editor.tryParseHTMLToBlocks(data.content);
                        }
                        editor.replaceBlocks(editor.document, parsedBlocks);
                    } catch (e) {
                        console.error("Failed to parse blocks:", e);
                    }
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id && editor) {
            fetchPublicNote();
        }
    }, [id, editor]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
                <Loader className="spin" size={32} color="var(--accent-primary)" />
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading note...</p>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)', textAlign: 'center' }}>
                <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Oops!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || "Note not found"}</p>
                    <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Go to GlazeNotes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingBottom: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{note.title || 'Untitled'}</h1>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Last updated on {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Link to="/" style={{ 
                        padding: '10px 20px', 
                        background: 'rgba(255,255,255,0.05)', 
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        Build your own
                    </Link>
                </div>
                
                <div style={{ background: 'var(--bg-dark)' }}>
                    <BlockNoteView editor={editor} theme="dark" editable={false} />
                </div>
            </div>
        </div>
    );
};

export default PublicNote;
