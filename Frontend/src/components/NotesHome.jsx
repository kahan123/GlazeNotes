import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import GlassCard from './GlassCard';
import { useUser } from '../context/UserContext';

const NotesHome = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/auth');
            return;
        }

        if (user) {
            const fetchNotes = async () => {
                try {
                    const { data } = await API.get('/notes');
                    setNotes(data);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setError('Failed to fetch notes');
                    setLoading(false);
                }
            };
            fetchNotes();
        }
    }, [user, userLoading, navigate]);

    const handleNewNote = async () => {
        // Option 1: Create immediately
        try {
            const { data } = await API.post('/notes', { title: 'Untitled', content: '<p></p>' });
            navigate(`/note/${data._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ paddingTop: '140px', textAlign: 'center', color: 'white' }}>Loading notes...</div>;

    return (
        <div className="container" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Welcome, <span style={{ color: 'var(--accent-primary)' }}>{user?.name?.split(' ')[0]}</span></h1>
                <button className="btn-primary" onClick={handleNewNote}>+ New Note</button>
            </div>

            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

            {notes.length === 0 && !error ? (
                <div style={{ textAlign: 'center', opacity: 0.7, marginTop: '50px' }}>
                    <p>No notes yet. Create your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {notes.map((note) => (
                        <GlassCard
                            className="glass-strong"
                            key={note._id}
                            onClick={() => navigate(`/note/${note._id}`)}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                minHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{note.title || 'Untitled'}</h3>
                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ flex: 1, opacity: 0.8, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                {note.contentPreview || 'No content'}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                                {note.tags && note.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--accent-secondary)'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesHome;
