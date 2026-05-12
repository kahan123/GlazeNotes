import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useUser } from './UserContext';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const { user, loading: userLoading } = useUser();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    // Fetch notes from server
    const fetchNotes = useCallback(async (reset = false) => {
        if (!user) {
            setNotes([]);
            return;
        }
        if (reset) {
            setLoading(true);
            setPage(1);
        }
        try {
            const currentPage = reset ? 1 : page;
            const { data } = await API.get(`/notes?page=${currentPage}&limit=20`);
            
            if (reset) {
                setNotes(data.notes || []);
            } else {
                setNotes(prev => {
                    // Prevent duplicates
                    const newNotes = (data.notes || []).filter(n => !prev.find(p => p._id === n._id));
                    return [...prev, ...newNotes];
                });
            }
            
            setHasMore(data.pagination?.hasMore || false);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
            setError('Failed to load notes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user, page]);

    const loadMoreNotes = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const fetchFolders = useCallback(async () => {
        if (!user) {
            setFolders([]);
            return;
        }
        try {
            const { data } = await API.get('/folders');
            setFolders(data || []);
        } catch (err) {
            console.error('Failed to fetch folders:', err);
        }
    }, [user]);

    const createFolderAction = useCallback(async (name, color) => {
        try {
            const { data } = await API.post('/folders', { name, color });
            setFolders(prev => [data, ...prev]);
            return data;
        } catch (err) {
            console.error('Failed to create folder:', err);
            throw err;
        }
    }, []);

    const deleteFolderAction = useCallback(async (id) => {
        try {
            await API.delete(`/folders/${id}`);
            setFolders(prev => prev.filter(f => f._id !== id));
            // Deleting folder sets all notes in that folder to unassigned folder, update client state:
            setNotes(prev => prev.map(n => n.folder === id ? { ...n, folder: null } : n));
        } catch (err) {
            console.error('Failed to delete folder:', err);
            throw err;
        }
    }, []);

    useEffect(() => {
        if (!userLoading) {
            fetchNotes();
            fetchFolders();
        }
    }, [user, userLoading, fetchNotes, fetchFolders]);

    // Debounced semantic & full-text search trigger
    useEffect(() => {
        if (!searchQuery || !searchQuery.trim()) {
            setSearchResults([]);
            setSearchType(null);
            setSearchLoading(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const { data } = await API.get(`/notes/search?q=${encodeURIComponent(searchQuery)}`);
                setSearchResults(data.results || []);
                setSearchType(data.searchType || 'keyword');
            } catch (err) {
                console.error('Failed to search notes:', err);
                // Fallback to client-side filtering
                setSearchResults([]);
                setSearchType('client-fallback');
            } finally {
                setSearchLoading(false);
            }
        }, 400); // 400ms debounce for instantaneous feel

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Create a new note
    const createNote = useCallback(async (title = 'Untitled', content = '<p></p>') => {
        try {
            const { data } = await API.post('/notes', { title, content });
            setNotes(prev => [data, ...prev]);
            return data;
        } catch (err) {
            console.error('Failed to create note:', err);
            throw err;
        }
    }, []);

    // Delete a note
    const deleteNote = useCallback(async (noteId) => {
        try {
            await API.delete(`/notes/${noteId}`);
            setNotes(prev => prev.filter(n => n._id !== noteId));
        } catch (err) {
            console.error('Failed to delete note:', err);
            throw err;
        }
    }, []);

    // Toggle pin status of a note
    const togglePinNote = useCallback(async (noteId, currentStatus) => {
        try {
            const { data } = await API.put(`/notes/${noteId}`, { isPinned: !currentStatus });
            setNotes(prev => prev.map(n => n._id === noteId ? { ...n, isPinned: !currentStatus } : n));
            return data;
        } catch (err) {
            console.error('Failed to pin note:', err);
            throw err;
        }
    }, []);

    // Update local state of a note (in-memory)
    const updateNoteState = useCallback((noteId, updatedFields) => {
        setNotes(prev => prev.map(n => n._id === noteId ? { ...n, ...updatedFields } : n));
    }, []);

    // Extract unique tags from notes list
    const getUniqueTags = useCallback(() => {
        const tagsSet = new Set();
        notes.forEach(note => {
            if (note.tags && Array.isArray(note.tags)) {
                note.tags.forEach(tag => {
                    if (tag && tag.trim()) {
                        tagsSet.add(tag.trim());
                    }
                });
            }
        });
        return Array.from(tagsSet).sort();
    }, [notes]);

    // Filtered notes list for rendering
    const getFilteredNotes = useCallback(() => {
        let sourceNotes = notes;
        const isSearchActive = searchQuery && searchQuery.trim();

        if (isSearchActive && searchType && searchType !== 'client-fallback') {
            sourceNotes = searchResults;
        }

        return sourceNotes.filter(note => {
            // 0. Folder filter
            if (selectedFolder) {
                if (selectedFolder === 'unassigned') {
                    if (note.folder) return false;
                } else if (note.folder !== selectedFolder) {
                    return false;
                }
            }

            // 1. Tag filter
            if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) {
                return false;
            }

            // 2. Pin filter
            if (showPinnedOnly && !note.isPinned) {
                return false;
            }

            // 3. Search query filter (only fallback if backend search didn't run)
            if (isSearchActive && (!searchType || searchType === 'client-fallback')) {
                const query = searchQuery.toLowerCase().trim();
                const titleMatch = note.title && note.title.toLowerCase().includes(query);
                const contentMatch = note.contentPreview && note.contentPreview.toLowerCase().includes(query);
                const tagMatch = note.tags && note.tags.some(tag => tag.toLowerCase().includes(query));
                return titleMatch || contentMatch || tagMatch;
            }

            return true;
        });
    }, [notes, selectedTag, showPinnedOnly, searchQuery, searchResults, searchType, selectedFolder]);

    return (
        <NotesContext.Provider value={{
            notes,
            setNotes,
            loading,
            error,
            fetchNotes,
            createNote,
            deleteNote,
            togglePinNote,
            updateNoteState,
            selectedTag,
            setSelectedTag,
            searchQuery,
            setSearchQuery,
            showPinnedOnly,
            setShowPinnedOnly,
            getUniqueTags,
            getFilteredNotes,
            sidebarCollapsed,
            setSidebarCollapsed,
            isMobileOpen,
            setIsMobileOpen,
            searchResults,
            searchType,
            searchLoading,
            loadMoreNotes,
            hasMore,
            folders,
            selectedFolder,
            setSelectedFolder,
            createFolderAction,
            deleteFolderAction
        }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
