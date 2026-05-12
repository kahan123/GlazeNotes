import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotes } from '../context/NotesContext';
import AvatarSelector from './AvatarSelector';
import ConfirmModal from './ConfirmModal';
import { gsap } from 'gsap';


import { 
    Plus, 
    FileText, 
    Bookmark, 
    Hash, 
    ChevronLeft, 
    ChevronRight, 
    LogOut, 
    Sun, 
    Moon, 
    User, 
    X,
    Menu,
    Folder,
    FolderPlus,
    Trash2
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout, updateUserAvatar } = useUser();
    const { 
        notes,
        createNote, 
        selectedTag, 
        setSelectedTag, 
        showPinnedOnly, 
        setShowPinnedOnly,
        getUniqueTags,
        sidebarCollapsed,
        setSidebarCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        folders,
        selectedFolder,
        setSelectedFolder,
        createFolderAction,
        deleteFolderAction
    } = useNotes();

    const navigate = useNavigate();
    const location = useLocation();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [deleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);

    const handleConfirmDeleteFolder = async () => {
        if (!folderToDelete) return;
        try {
            await deleteFolderAction(folderToDelete._id);
            if (selectedFolder === folderToDelete._id) setSelectedFolder(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteFolderModalOpen(false);
            setFolderToDelete(null);
        }
    };


    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await createFolderAction(newFolderName.trim());
            setNewFolderName('');
            setIsCreatingFolder(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Initialize Theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.add('light-theme');
        } else {
            setIsDarkMode(true);
            document.documentElement.classList.remove('light-theme');
        }
    }, []);

    useEffect(() => {
        // Smooth staggered reveal of navigation buttons
        const navElements = document.querySelectorAll('nav > button, nav > div');
        if (navElements.length > 0) {
            gsap.fromTo(navElements,
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' }
            );
        }
    }, [sidebarCollapsed]);


    const toggleTheme = () => {
        if (isDarkMode) {
            setIsDarkMode(false);
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            setIsDarkMode(true);
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    };

    const handleNewNote = async () => {
        try {
            const newNote = await createNote();
            setIsMobileOpen(false);
            navigate(`/note/${newNote._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAllNotes = () => {
        setSelectedTag(null);
        setSelectedFolder(null);
        setShowPinnedOnly(false);
        setIsMobileOpen(false);
        if (location.pathname !== '/app') {
            navigate('/app');
        }
    };

    const handlePinnedNotes = () => {
        setSelectedTag(null);
        setSelectedFolder(null);
        setShowPinnedOnly(true);
        setIsMobileOpen(false);
        if (location.pathname !== '/app') {
            navigate('/app');
        }
    };

    const handleTagSelect = (tag) => {
        setSelectedTag(tag);
        setSelectedFolder(null);
        setShowPinnedOnly(false);
        setIsMobileOpen(false);
        if (location.pathname !== '/app') {
            navigate('/app');
        }
    };

    const handleLogout = () => {
        setShowProfileMenu(false);
        setIsMobileOpen(false);
        logout();
        navigate('/auth');
    };

    const handleAvatarSelect = (avatar) => {
        updateUserAvatar(avatar);
        setShowAvatarSelector(false);
        setShowProfileMenu(false);
    };

    // Calculate tag counts
    const getTagCount = (tag) => {
        return notes.filter(note => note.tags && note.tags.includes(tag)).length;
    };

    const uniqueTags = getUniqueTags();
    const pinnedCount = notes.filter(n => n.isPinned).length;

    return (
        <>
            {/* Avatar Selector Modal */}
            <AvatarSelector
                isOpen={showAvatarSelector}
                onClose={() => setShowAvatarSelector(false)}
                onSelect={handleAvatarSelect}
            />

            {/* Mobile Sidebar Overlay Backdrop */}
            {isMobileOpen && (
                <div 
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        zIndex: 999,
                        animation: 'fadeIn 0.25s ease'
                    }}
                />
            )}

            {/* Mobile Header */}
            <div className="mobile-header" style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                height: '60px',
                padding: '0 20px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 998,
                background: 'var(--bg-dark)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 20px var(--shadow-dark)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleAllNotes}>
                    <div className="logo-box-inset" style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-dark)', boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>GlazeNote</span>
                </div>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="neo-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Sidebar Drawer */}
            <aside 
                className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    bottom: '0',
                    width: sidebarCollapsed ? '80px' : '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'var(--bg-dark)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.03)',
                    boxShadow: 'inset -1px 0 0 0 rgba(255,255,255,0.03), 8px 0 32px var(--shadow-dark)',
                    padding: '24px 16px',
                    overflowX: 'hidden'
                }}
            >
                {/* Close Button (Mobile Only) */}
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="mobile-close-btn neo-btn"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'none',
                        padding: '6px',
                        borderRadius: '50%'
                    }}
                >
                    <X size={18} />
                </button>

                {/* Sidebar Header / Logo (Neumorphic Inset Indicator Box) */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    marginBottom: '28px',
                    padding: '0 8px',
                    minHeight: '44px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={handleAllNotes}>
                        <div className="logo-box-inset" style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '10px', 
                            background: 'var(--bg-dark)', 
                            boxShadow: 'inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        </div>
                        {!sidebarCollapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0', color: 'var(--text-primary)', tracking: '-0.02em' }}>GlazeNote</h2>
                                <span style={{ fontSize: '0.62rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', fontWeight: '800', marginTop: '1px' }}>PREMIUM AI</span>
                            </div>
                        )}
                    </div>

                    {/* Collapse Button (Desktop Only) */}
                    {!sidebarCollapsed && (
                        <button 
                            onClick={() => setSidebarCollapsed(true)}
                            className="collapse-toggle-btn hide-on-mobile neo-btn"
                            style={{
                                background: 'var(--bg-dark)',
                                color: 'var(--text-secondary)',
                                padding: '6px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ChevronLeft size={14} />
                        </button>
                    )}
                </div>

                {/* Expand Button (when collapsed) */}
                {sidebarCollapsed && (
                    <button 
                        onClick={() => setSidebarCollapsed(false)}
                        className="collapse-toggle-btn hide-on-mobile neo-btn"
                        style={{
                            background: 'var(--bg-dark)',
                            color: 'var(--text-secondary)',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            alignSelf: 'center',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                )}

                {/* Create Note Button (Neumorphic Elevated Button) */}
                <div style={{ padding: '0 4px', marginBottom: '24px' }}>
                    <button 
                        onClick={handleNewNote}
                        className="sidebar-action-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarCollapsed ? 'center' : 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '14px',
                            background: 'var(--bg-dark)',
                            border: '1px solid rgba(255,255,255,0.02)',
                            borderRadius: '14px',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 16px var(--shadow-dark), -4px -4px 16px var(--shadow-light)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <Plus size={18} className="btn-icon" style={{ transition: 'transform 0.2s' }} />
                        {!sidebarCollapsed && <span>New Note</span>}
                    </button>
                </div>

                {/* Navigation Links (Flat lists hovering to extruded Neumorphism, Active with Mint-green Inset) */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', padding: '0 4px' }}>
                    
                    {/* All Notes */}
                    <button 
                        onClick={handleAllNotes}
                        className={`sidebar-nav-link ${(!selectedTag && !showPinnedOnly && location.pathname === '/app') ? 'active' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            gap: '12px',
                            padding: '12px 16px',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '12px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.92rem',
                            fontWeight: '500',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <FileText size={18} style={{ opacity: 0.8 }} />
                        {!sidebarCollapsed && <span>All Notes</span>}
                    </button>

                    {/* Pinned Notes */}
                    <button 
                        onClick={handlePinnedNotes}
                        className={`sidebar-nav-link ${(showPinnedOnly && location.pathname === '/app') ? 'active' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                            gap: '12px',
                            padding: '12px 16px',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '12px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.92rem',
                            fontWeight: '500',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Bookmark size={18} style={{ opacity: 0.8 }} />
                            {!sidebarCollapsed && <span>Pinned</span>}
                        </div>
                        {!sidebarCollapsed && pinnedCount > 0 && (
                            <span className="badge-count-inset" style={{ 
                                fontSize: '0.75rem', 
                                padding: '2px 8px', 
                                borderRadius: '20px', 
                                background: 'var(--bg-dark)',
                                color: 'var(--accent-primary)',
                                fontWeight: '700',
                                boxShadow: 'inset 1px 1px 3px var(--shadow-dark), inset -1px -1px 3px var(--shadow-light)'
                            }}>{pinnedCount}</span>
                        )}
                    </button>

                    {/* Folders / Workspaces Section (when expanded) */}
                    {!sidebarCollapsed && (
                        <div style={{ marginTop: '24px', padding: '0 8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.12em', 
                                    color: 'var(--text-secondary)',
                                    opacity: 0.4,
                                    fontWeight: '700'
                                }}>Workspaces</span>
                                <button
                                    onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        opacity: 0.6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '2px',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                    title="New Workspace"
                                    className="neo-btn"
                                >
                                    <FolderPlus size={14} />
                                </button>
                            </div>

                            {/* Create Folder Inline Form */}
                            {isCreatingFolder && (
                                <form onSubmit={handleCreateFolder} style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%', boxSizing: 'border-box' }}>
                                    <input
                                        type="text"
                                        placeholder="Workspace name..."
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        autoFocus
                                        style={{
                                            flex: 1,
                                            minWidth: '0',
                                            padding: '6px 12px',
                                            fontSize: '0.82rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg-dark)',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            background: 'var(--accent-primary)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'var(--bg-dark)',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Add
                                    </button>
                                </form>
                            )}

                            {/* Folders List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Unassigned Folder */}
                                <button
                                    onClick={() => {
                                        setSelectedFolder(selectedFolder === 'unassigned' ? null : 'unassigned');
                                        setSelectedTag(null);
                                        setShowPinnedOnly(false);
                                        setIsMobileOpen(false);
                                        if (location.pathname !== '/app') navigate('/app');
                                    }}
                                    className={`sidebar-nav-link ${selectedFolder === 'unassigned' ? 'active' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 12px',
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        borderRadius: '10px',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '0.88rem',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        paddingLeft: '14px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Folder size={14} style={{ opacity: 0.5, color: 'var(--text-secondary)' }} />
                                        <span>Unassigned</span>
                                    </div>
                                    <span style={{ 
                                        fontSize: '0.72rem', 
                                        padding: '1px 6px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        boxShadow: 'inset 1px 1px 2px var(--shadow-dark)'
                                    }}>
                                        {notes.filter(n => !n.folder).length}
                                    </span>
                                </button>

                                {folders && folders.map(folder => {
                                    const isFolderActive = selectedFolder === folder._id && location.pathname === '/app';
                                    const notesCount = notes.filter(n => n.folder === folder._id).length;
                                    return (
                                        <div 
                                            key={folder._id}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
                                            className="folder-item-wrapper"
                                        >
                                            <button 
                                                onClick={() => {
                                                    setSelectedFolder(isFolderActive ? null : folder._id);
                                                    setSelectedTag(null);
                                                    setShowPinnedOnly(false);
                                                    setIsMobileOpen(false);
                                                    if (location.pathname !== '/app') navigate('/app');
                                                }}
                                                className={`sidebar-nav-link ${isFolderActive ? 'active' : ''}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    flex: 1,
                                                    border: 'none',
                                                    background: 'transparent',
                                                    borderRadius: '10px',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.88rem',
                                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    paddingLeft: '14px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <Folder size={14} style={{ opacity: 0.8, color: folder.color || 'var(--accent-primary)' }} />
                                                    <span>{folder.name}</span>
                                                </div>
                                                <span className="folder-count-badge" style={{ 
                                                    fontSize: '0.72rem', 
                                                    padding: '1px 6px',
                                                    borderRadius: '8px',
                                                    fontWeight: '600',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    boxShadow: 'inset 1px 1px 2px var(--shadow-dark)',
                                                    marginRight: '22px' // leave room for delete icon
                                                }}>{notesCount}</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFolderToDelete(folder);
                                                    setDeleteFolderModalOpen(true);
                                                }}

                                                style={{
                                                    position: 'absolute',
                                                    right: '4px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    opacity: 0,
                                                    padding: '4px',
                                                    borderRadius: '40%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'opacity 0.2s, color 0.2s'
                                                }}
                                                className="folder-delete-btn"
                                                title="Delete Folder"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tags List Section (when expanded) */}
                    {!sidebarCollapsed && uniqueTags.length > 0 && (
                        <div style={{ marginTop: '20px', padding: '0 8px' }}>
                            <span style={{ 
                                display: 'block', 
                                marginBottom: '10px', 
                                fontSize: '0.7rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.12em', 
                                color: 'var(--text-secondary)',
                                opacity: 0.4,
                                fontWeight: '700'
                            }}>Tags</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {uniqueTags.map(tag => {
                                    const isActive = selectedTag === tag && location.pathname === '/app';
                                    return (
                                        <button 
                                            key={tag}
                                            onClick={() => handleTagSelect(tag)}
                                            className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 12px',
                                                width: '100%',
                                                border: 'none',
                                                background: 'transparent',
                                                borderRadius: '10px',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                fontSize: '0.88rem',
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                paddingLeft: '14px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <Hash size={14} style={{ opacity: 0.5 }} />
                                                <span>{tag}</span>
                                            </div>
                                            <span style={{ 
                                                fontSize: '0.72rem', 
                                                padding: '1px 6px',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                boxShadow: 'inset 1px 1px 2px var(--shadow-dark)'
                                            }}>{getTagCount(tag)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Footer User Profile with Neumorphic Hover */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '16px', position: 'relative' }}>
                    
                    {/* Theme and Profile Floating Overlay */}
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            bottom: '72px',
                            left: sidebarCollapsed ? '4px' : '0',
                            right: sidebarCollapsed ? 'auto' : '0',
                            width: '220px',
                            padding: '12px',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            zIndex: 1001,
                            background: 'var(--bg-dark)',
                            border: '1px solid rgba(255,255,255,0.03)',
                            boxShadow: '8px 8px 32px var(--shadow-dark), -8px -8px 32px var(--shadow-light)',
                            animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            {/* Dark/Light mode switch */}
                            <button
                                onClick={toggleTheme}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    padding: '8px 10px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '0.88rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}
                                className="profile-menu-item"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </div>
                                <div style={{ 
                                    width: '30px', 
                                    height: '18px', 
                                    background: isDarkMode ? 'var(--accent-primary)' : 'rgba(0,0,0,0.15)', 
                                    borderRadius: '100px',
                                    position: 'relative',
                                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        background: isDarkMode ? '#00391f' : 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '3px',
                                        left: isDarkMode ? '15px' : '3px',
                                        transition: 'all 0.3s'
                                    }}></div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setShowAvatarSelector(true);
                                    setShowProfileMenu(false);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    padding: '8px 10px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '0.88rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%'
                                }}
                                className="profile-menu-item"
                            >
                                <User size={15} />
                                Change Avatar
                            </button>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)', margin: '2px 0' }}></div>
                            
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f87171',
                                    padding: '8px 10px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '0.88rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%'
                                }}
                                className="profile-menu-item-logout"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Profile User block trigger */}
                    <div 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="sidebar-profile-trigger"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            gap: '12px',
                            padding: '8px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'var(--accent-primary)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(76,224,146,0.3)'
                        }}>
                            <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        
                        {!sidebarCollapsed && (
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', margin: '0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{user?.name || 'Felix User'}</h4>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', opacity: 0.7, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>{user?.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Backdrop */}
            {isMobileOpen && (
                <div 
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 999
                    }}
                ></div>
            )}

            {/* Custom Theme Overrides to align with demo.html */}
            <style>{`
                .sidebar-action-btn:hover {
                    box-shadow: 6px 6px 20px var(--shadow-dark), -6px -6px 20px var(--shadow-light) !important;
                    transform: translateY(-2px);
                }
                .sidebar-action-btn:active {
                    box-shadow: var(--neo-btn-inset) !important;
                    transform: translateY(1px);
                }
                .sidebar-action-btn:hover .btn-icon {
                    transform: scale(1.1);
                }

                /* Flat normal item styles hover to elevated Neumorphic */
                .sidebar-nav-link {
                    border: 1px solid transparent !important;
                }
                .sidebar-nav-link:hover {
                    color: var(--text-primary) !important;
                    box-shadow: 4px 4px 12px var(--shadow-dark), -4px -4px 12px var(--shadow-light) !important;
                }

                /* Inset Neumorphic Active state matching demo.html precisely */
                .sidebar-nav-link.active {
                    background: rgba(76, 224, 146, 0.12) !important;
                    color: var(--accent-primary) !important;
                    font-weight: 700 !important;
                    box-shadow: inset 4px 4px 8px #002d18, inset -4px -4px 8px rgba(76, 224, 146, 0.2) !important;
                    border: 1px solid rgba(76, 224, 146, 0.1) !important;
                }
                .light-theme .sidebar-nav-link.active {
                    box-shadow: inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff !important;
                    background: rgba(16, 185, 129, 0.08) !important;
                    color: var(--accent-primary) !important;
                }

                .sidebar-profile-trigger:hover {
                    box-shadow: inset 2px 2px 6px var(--shadow-dark), inset -2px -2px 6px var(--shadow-light) !important;
                }
                .profile-menu-item:hover {
                    background: rgba(255,255,255,0.03) !important;
                }
                .profile-menu-item-logout:hover {
                    background: rgba(239, 68, 68, 0.06) !important;
                }

                .folder-item-wrapper:hover .folder-delete-btn {
                    opacity: 0.6 !important;
                }
                .folder-item-wrapper:hover .folder-delete-btn:hover {
                    opacity: 1 !important;
                    color: #ef4444 !important;
                }

                @keyframes slideUp {
                    from { transform: translateY(8px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 768px) {
                    .mobile-header {
                        display: flex !important;
                    }
                    .sidebar {
                        transform: translateX(-100%);
                        width: 260px !important;
                        border-radius: 0 24px 24px 0;
                    }
                    .sidebar.mobile-open {
                        transform: translateX(0);
                    }
                    .mobile-close-btn {
                        display: flex !important;
                    }
                }
            `}</style>

            <ConfirmModal 
                isOpen={deleteFolderModalOpen}
                title="Delete Workspace"
                message={`Are you sure you want to delete "${folderToDelete?.name}"? All notes in this workspace will be unassigned but won't be deleted.`}
                onConfirm={handleConfirmDeleteFolder}
                onCancel={() => {
                    setDeleteFolderModalOpen(false);
                    setFolderToDelete(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>

    );
};

export default Sidebar;
