import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotes } from '../context/NotesContext';
import ConfirmModal from './ConfirmModal';
import { gsap } from 'gsap';

import { 
    Trash2, 
    Bookmark, 
    Search, 
    Plus, 
    FileText, 
    Calendar,
    Hash,
    X,
    Folder
} from 'lucide-react';

const NotesHome = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { 
        loading, 
        error, 
        createNote, 
        deleteNote, 
        togglePinNote,
        selectedTag, 
        setSelectedTag,
        searchQuery, 
        setSearchQuery,
        showPinnedOnly,
        getFilteredNotes,
        searchLoading,
        searchType,
        fetchNotes,
        hasMore,
        loadMoreNotes,
    } = useNotes();

    const filteredNotes = getFilteredNotes();


    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        if (!loading && filteredNotes.length > 0) {
            gsap.fromTo('.note-card-stagger', 
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' }
            );
        }
    }, [loading, filteredNotes.length]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const handleCreateNote = async () => {
        try {
            const newNote = await createNote();
            navigate(`/note/${newNote._id}`);
        } catch (err) {
            console.error('Failed to create note:', err);
        }
    };

    const handleDeleteClick = (e, noteId) => {
        e.stopPropagation();
        setNoteToDelete(noteId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!noteToDelete) return;
        try {
            await deleteNote(noteToDelete);
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setDeleteModalOpen(false);
            setNoteToDelete(null);
        }
    };

    const handlePinClick = async (e, noteId, currentStatus) => {
        e.stopPropagation();
        try {
            await togglePinNote(noteId, currentStatus);
        } catch (err) {
            console.error('Pin error:', err);
        }
    };



    // High Fidelity Skeleton Loader (Skeuomorphic)
    const SkeletonLoader = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', marginTop: '12px' }}>
            {[1, 2, 3, 4].map(i => (
                <div 
                    key={i} 
                    className="skeleton" 
                    style={{
                        padding: '32px',
                        borderRadius: '2rem',
                        minHeight: '260px',
                        background: 'var(--bg-dark)',
                        boxShadow: 'var(--neo-outset)',
                        border: '1px solid rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '70%' }}>
                            <div className="skeleton-line" style={{ width: '80%', height: '24px' }}></div>
                            <div className="skeleton-line" style={{ width: '40%', height: '14px' }}></div>
                        </div>
                        <div className="skeleton-line" style={{ width: '28px', height: '28px', borderRadius: '50%' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                        <div className="skeleton-line" style={{ width: '100%', height: '14px' }}></div>
                        <div className="skeleton-line" style={{ width: '90%', height: '14px' }}></div>
                        <div className="skeleton-line" style={{ width: '50%', height: '14px' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="skeleton-line" style={{ width: '60px', height: '20px', borderRadius: '8px' }}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Header Section matching demo.html exactly */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingTop: '64px',
                paddingBottom: '32px',
                borderBottom: '1px solid transparent',
                flexWrap: 'wrap',
                gap: '24px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
                    <h1 style={{ 
                        fontSize: '2.4rem', 
                        fontWeight: '800', 
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.2'
                    }}>
                        Welcome back, <span style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'Felix'}</span>
                    </h1>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        {showPinnedOnly ? 'Showing your bookmarked ideas.' : selectedTag ? `Filtered by tag: #${selectedTag}` : 'Your digital thoughts and knowledge base, powered by AI.'}
                    </p>
                </div>
                <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="btn-primary" onClick={handleCreateNote}>
                        <Plus size={18} />
                        <span>Create Note</span>
                    </button>
                </div>
            </header>

            {/* Main Content Pane */}
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Search Bar (Pressed Inset Neumorphic Trough matching demo.html) */}
                <div 
                    className="search-bar-container-inset" 
                    style={{
                        width: '100%',
                        borderRadius: '1.2rem',
                        background: 'var(--bg-dark)',
                        boxShadow: 'var(--neo-inset)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 24px',
                        marginBottom: '40px',
                        border: '1px solid rgba(255,255,255,0.02)',
                        transition: 'box-shadow 0.3s'
                    }}
                >
                    {searchLoading ? (
                        <div className="animate-spin" style={{
                            width: '20px',
                            height: '20px',
                            border: '2.5px solid rgba(76, 224, 146, 0.1)',
                            borderTop: '2.5px solid var(--accent-primary)',
                            borderRadius: '50%',
                            marginRight: '16px',
                            flexShrink: 0
                        }} />
                    ) : (
                        <Search size={22} style={{ color: 'var(--text-secondary)', opacity: 0.6, marginRight: '16px', flexShrink: 0 }} />
                    )}
                    <input 
                        type="text" 
                        placeholder="Search note titles, content preview, or tags..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            width: '100%',
                            fontSize: '1.05rem',
                            fontWeight: '500',
                            fontFamily: 'Manrope'
                        }}
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Filter Pill Badges Row */}
                {(selectedTag || showPinnedOnly || searchQuery) && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '600', opacity: 0.6 }}>Active filters:</span>
                        
                        {showPinnedOnly && (
                            <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '0.8rem', 
                                padding: '6px 14px', 
                                background: 'rgba(76, 224, 146, 0.08)', 
                                border: '1px solid rgba(76, 224, 146, 0.15)', 
                                borderRadius: '20px', 
                                color: 'var(--accent-primary)',
                                fontWeight: '600'
                            }}>
                                <Bookmark size={12} fill="var(--accent-primary)" />
                                <span>Pinned Only</span>
                            </span>
                        )}

                        {selectedTag && (
                            <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '0.8rem', 
                                padding: '6px 14px', 
                                background: 'rgba(76, 224, 146, 0.08)', 
                                border: '1px solid rgba(76, 224, 146, 0.15)', 
                                borderRadius: '20px', 
                                color: 'var(--accent-primary)',
                                fontWeight: '600'
                            }}>
                                <Hash size={12} />
                                <span>{selectedTag}</span>
                                <button onClick={() => setSelectedTag(null)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                            </span>
                        )}

                        {searchQuery && (
                            <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '0.8rem', 
                                padding: '6px 14px', 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                border: '1px solid rgba(255, 255, 255, 0.06)', 
                                borderRadius: '20px', 
                                color: 'var(--text-secondary)',
                                fontWeight: '600'
                            }}>
                                <span>Query: "{searchQuery}"</span>
                                <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                            </span>
                        )}

                        {searchQuery && searchType === 'semantic' && (
                            <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '0.8rem', 
                                padding: '6px 14px', 
                                background: 'rgba(76, 224, 146, 0.08)', 
                                border: '1px solid rgba(76, 224, 146, 0.15)', 
                                borderRadius: '20px', 
                                color: 'var(--accent-primary)',
                                fontWeight: '600'
                            }}>
                                <span>🤖 Semantic AI Active</span>
                            </span>
                        )}

                        <button 
                            onClick={() => {
                                setSelectedTag(null);
                                setSearchQuery('');
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.88rem', cursor: 'pointer', padding: '4px 8px', fontWeight: '700' }}
                        >
                            Reset All
                        </button>
                    </div>
                )}

                {/* Loading / Error Indicators */}
                {loading && <SkeletonLoader />}
                {error && <div className="card-neumorphic-outset" style={{ padding: '32px', borderRadius: '2rem', color: '#ff6b6b', border: '1px solid rgba(239, 68, 68, 0.1)', textAlign: 'center', margin: '40px 0', boxShadow: 'var(--neo-outset)' }}>{error}</div>}

                {/* Grid Lists Render */}
                {!loading && !error && (
                    <>
                        {filteredNotes.length === 0 ? (
                            /* Beautiful Skeuomorphic Empty State */
                            <div className="card-neumorphic-outset" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '80px 40px',
                                borderRadius: '2.5rem',
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.02)',
                                maxWidth: '640px',
                                margin: '40px auto',
                                background: 'var(--bg-dark)',
                                boxShadow: 'var(--neo-outset)',
                                gap: '24px',
                                animation: 'fadeIn 0.5s ease-out'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-dark)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'inset 4px 4px 10px var(--shadow-dark), inset -4px -4px 10px var(--shadow-light)',
                                    color: 'var(--accent-primary)'
                                }}>
                                    <FileText size={32} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                        {searchQuery ? 'No matching notes found' : 'Capture Your Creative Spark'}
                                    </h3>
                                    <p style={{ margin: '0 auto', fontSize: '1rem', color: 'var(--text-secondary)', opacity: 0.8, maxWidth: '400px', lineHeight: '1.6' }}>
                                        {searchQuery ? 'Try adjusting your search keywords or resetting your active tag filter.' : 'Create your first note to start organizing your thoughts with GlazeNotes, your high-performance AI second brain.'}
                                    </p>
                                </div>
                                {!searchQuery && (
                                    <button className="btn-primary" onClick={handleCreateNote}>
                                        <Plus size={16} />
                                        <span>Create Your First Note</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Bento Note Cards Grid matching demo.html */
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                                    {filteredNotes.map((note) => (
                                        <div
                                            className="card-neumorphic-outset note-card-stagger"
                                            key={note._id}
                                            onClick={() => navigate(`/note/${note._id}`)}

                                            style={{
                                                padding: '32px',
                                                cursor: 'pointer',
                                                minHeight: '240px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                background: 'var(--bg-dark)',
                                                border: '1px solid rgba(255,255,255,0.02)',
                                                borderRadius: '2rem',
                                                boxShadow: 'var(--neo-outset)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {/* Card header toolbar */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
                                                    <h2 className="card-title-hover" style={{ 
                                                        fontSize: '1.35rem', 
                                                        margin: 0, 
                                                        fontWeight: '700', 
                                                        textOverflow: 'ellipsis', 
                                                        overflow: 'hidden', 
                                                        whiteSpace: 'nowrap', 
                                                        color: 'var(--text-primary)',
                                                        transition: 'color 0.2s'
                                                    }}>
                                                        {note.title || 'Untitled'}
                                                    </h2>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                                                            <Calendar size={14} />
                                                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        {note.similarityScore !== undefined && note.similarityScore > 0 && searchQuery && (
                                                            <span style={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                color: 'var(--accent-primary)',
                                                                background: 'rgba(76, 224, 146, 0.08)',
                                                                padding: '2px 8px',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(76, 224, 146, 0.15)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                🤖 {Math.round(note.similarityScore * 100)}% match
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Action round-inset hover triggers matching demo.html precisely */}
                                                <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={(e) => handlePinClick(e, note._id, note.isPinned)}
                                                        className="card-round-action"
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: note.isPinned ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                            cursor: 'pointer',
                                                            padding: '10px',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                                                    >
                                                        <Bookmark size={16} fill={note.isPinned ? 'var(--accent-primary)' : 'transparent'} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, note._id)}
                                                        className="card-round-action delete"
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--text-secondary)',
                                                            cursor: 'pointer',
                                                            padding: '10px',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        title="Delete Note"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content Preview paragraph styled exactly like demo.html */}
                                            <p style={{ 
                                                flex: 1, 
                                                color: 'var(--text-secondary)', 
                                                opacity: 0.8,
                                                fontSize: '1rem', 
                                                lineHeight: '1.65',
                                                margin: '0 0 20px 0',
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis', 
                                                display: '-webkit-box', 
                                                WebkitLineClamp: 4, 
                                                WebkitBoxOrient: 'vertical',
                                                textAlign: 'justify'
                                            }}>
                                                {note.contentPreview || 'No content written yet.'}
                                            </p>

                                            {/* Bottom tags row */}
                                            {((note.tags && note.tags.length > 0) || note.folder) && (
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto', alignItems: 'center' }}>
                                                    {note.folder && (() => {
                                                        const folderObj = folders?.find(f => f._id === note.folder);
                                                        if (!folderObj) return null;
                                                        return (
                                                            <span 
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    padding: '4px 10px',
                                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                                    border: `1px solid ${folderObj.color || 'var(--accent-primary)'}33`,
                                                                    borderRadius: '8px',
                                                                    color: folderObj.color || 'var(--accent-primary)',
                                                                    fontWeight: '700',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    boxShadow: 'inset 1px 1px 2px var(--shadow-dark)'
                                                                }}
                                                            >
                                                                <Folder size={11} style={{ color: folderObj.color || 'var(--accent-primary)' }} />
                                                                <span>{folderObj.name}</span>
                                                            </span>
                                                        );
                                                    })()}
                                                    {note.tags && note.tags.slice(0, 3).map(tag => (
                                                        <span 
                                                            key={tag} 
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                padding: '4px 10px',
                                                                background: 'var(--bg-dark)',
                                                                border: '1px solid rgba(255,255,255,0.01)',
                                                                borderRadius: '8px',
                                                                color: 'var(--accent-primary)',
                                                                fontWeight: '700',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                boxShadow: 'inset 1px 1px 2px var(--shadow-dark)'
                                                            }}
                                                        >
                                                            <Hash size={11} />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {note.tags.length > 3 && (
                                                        <span style={{ 
                                                            fontSize: '0.75rem', 
                                                            padding: '4px 10px', 
                                                            background: 'var(--bg-dark)', 
                                                            color: 'var(--text-secondary)', 
                                                            borderRadius: '8px',
                                                            boxShadow: 'inset 1px 1px 2px var(--shadow-dark)'
                                                        }}>
                                                            +{note.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {hasMore && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
                                        <button 
                                            className="btn-primary" 
                                            onClick={loadMoreNotes}
                                            style={{
                                                padding: '14px 32px',
                                                fontSize: '0.95rem',
                                                borderRadius: '16px',
                                                fontFamily: 'Manrope',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                boxShadow: 'var(--neo-btn-outset)'
                                            }}
                                        >
                                            Load More Notes
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Inset Search and Outset Card Transition overrides */}
            <style>{`
                .search-bar-container-inset:focus-within {
                    box-shadow: inset 8px 8px 16px var(--shadow-dark), inset -8px -8px 16px var(--shadow-light) !important;
                }

                .card-neumorphic-outset:hover {
                    box-shadow: 16px 16px 40px var(--shadow-dark), -16px -16px 40px var(--shadow-light) !important;
                    transform: translateY(-4px);
                }
                .card-neumorphic-outset:hover .card-title-hover {
                    color: var(--accent-primary) !important;
                }

                /* Circular active inset buttons as defined in demo.html */
                .card-round-action:hover {
                    box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light) !important;
                    color: var(--text-primary) !important;
                }
                .card-round-action.delete:hover {
                    color: #ef4444 !important;
                }

                .skeleton-line {
                    background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
                    background-size: 200% 100%;
                    animation: skeletonPulse 1.6s infinite ease-in-out;
                    border-radius: 4px;
                }

                @keyframes skeletonPulse {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action is permanent and cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setNoteToDelete(null);
                }}
            />
        </div>
    );
};

export default NotesHome;
