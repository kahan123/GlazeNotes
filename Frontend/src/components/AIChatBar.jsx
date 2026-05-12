import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sparkles, Send, X, ChevronDown, Trash2 } from 'lucide-react';
import API from '../services/api';
import { useNotes } from '../context/NotesContext';

const htmlToReact = (html) => {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const renderMessageText = (text) => {
    if (!text) return '';
    
    // Split by lines
    const lines = text.split('\n');
    let inList = false;
    const elements = [];

    lines.forEach((line, lIdx) => {
        let content = line.trim();
        if (!content) {
            if (inList) {
                inList = false;
            }
            elements.push(<div key={`empty-${lIdx}`} style={{ height: '8px' }} />);
            return;
        }

        // Match markdown formats
        const isHeading = line.startsWith('###');
        const isSubheading = line.startsWith('##') && !line.startsWith('###');
        const isHeader = line.startsWith('#') && !line.startsWith('##');
        const isBullet = line.startsWith('- ') || line.startsWith('* ');
        
        if (isHeading) content = line.substring(4);
        else if (isSubheading) content = line.substring(3);
        else if (isHeader) content = line.substring(2);
        else if (isBullet) content = line.substring(2);

        // Bold (**text**), Italic (*text*), Code (`text`)
        const boldRegex = /\*\*(.*?)\*\*/g;
        const italicRegex = /\*(.*?)\*/g;
        const codeRegex = /`(.*?)`/g;

        let html = content
            .replace(boldRegex, '<strong>$1</strong>')
            .replace(italicRegex, '<em>$1</em>')
            .replace(codeRegex, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; border: 1px solid rgba(255,255,255,0.03);">$1</code>');

        if (isBullet) {
            elements.push(
                <li key={lIdx} style={{ marginLeft: '16px', marginBottom: '6px', listStyleType: 'disc', fontFamily: 'Manrope' }}>
                    {htmlToReact(html)}
                </li>
            );
            inList = true;
        } else {
            if (inList) {
                inList = false;
            }
            if (isHeading) {
                elements.push(<h4 key={lIdx} style={{ margin: '14px 0 6px', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>{htmlToReact(html)}</h4>);
            } else if (isSubheading) {
                elements.push(<h3 key={lIdx} style={{ margin: '18px 0 8px', fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>{htmlToReact(html)}</h3>);
            } else if (isHeader) {
                elements.push(<h2 key={lIdx} style={{ margin: '22px 0 10px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>{htmlToReact(html)}</h2>);
            } else {
                elements.push(<p key={lIdx} style={{ margin: '0 0 10px 0', lineHeight: '1.6', fontFamily: 'Manrope' }}>{htmlToReact(html)}</p>);
            }
        }
    });

    return elements;
};

const AIChatBar = forwardRef(({ editor, noteId }, ref) => {
    const { sidebarCollapsed } = useNotes();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isClearing, setIsClearing] = useState(false);
    const messagesEndRef = useRef(null);

    useImperativeHandle(ref, () => ({
        openWithSummary: async (context) => {
            setIsOpen(true);
            setMessages(prev => [...prev, { role: 'ai', text: 'Generating a premium, skeuomorphic summary of your note...', isTemp: true }]);
            try {
                const { data } = await API.post(`/ai/chat/${noteId}`, {
                    message: "Please provide a premium, beautifully structured summary of the note content. Use bullet points, bold text, and a TL;DR where appropriate.",
                    context
                });
                setMessages(prev => [
                    ...prev.filter(msg => !msg.isTemp),
                    { role: 'ai', text: data.reply }
                ]);
            } catch (error) {
                console.error('Summarize error:', error);
                const apiErrorMsg = error.response?.data?.message || 'Sorry, I encountered an error while summarizing. Please try again.';
                setMessages(prev => [
                    ...prev.filter(msg => !msg.isTemp),
                    { role: 'ai', text: apiErrorMsg }
                ]);
            }
        }
    }));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsOpen(true);

        // Add loading state message
        setMessages(prev => [...prev, { role: 'ai', text: '', isTemp: true }]);

        try {
            // Get note context if editor exists
            const context = editor ? editor._tiptapEditor?.getText() : '';

            const { data } = await API.post(`/ai/chat/${noteId}`, {
                message: userMsg,
                context
            });

            setMessages(prev => [
                ...prev.filter(msg => !msg.isTemp),
                { role: 'ai', text: data.reply }
            ]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            const apiErrorMsg = error.response?.data?.message || 'Failed to generate AI response. Please try again.';
            setMessages(prev => [
                ...prev.filter(msg => !msg.isTemp),
                { role: 'ai', text: apiErrorMsg }
            ]);
        }
    };

    const handleClearChat = async () => {
        setIsClearing(true);
        try {
            await API.delete(`/ai/chat/${noteId}`);
            setMessages([]);
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to clear chat:', err);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: isMobile ? '50%' : `calc(50vw + ${sidebarCollapsed ? '40px' : '140px'})`,
            transform: 'translateX(-50%)',
            width: isMobile ? 'calc(100% - 32px)' : `calc(100vw - ${sidebarCollapsed ? '80px' : '280px'} - 96px)`,
            maxWidth: '100%',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Expanded Messages Box */}
            {isOpen && (
                <div className="card-neumorphic-outset" style={{
                    width: '100%',
                    height: '350px',
                    borderRadius: '2rem',
                    background: 'var(--bg-dark)',
                    border: '1px solid rgba(255,255,255,0.02)',
                    boxShadow: 'var(--neo-outset)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {/* Header toolbar */}
                    <div style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>GlazeAI Chat Brain</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {messages.length > 0 && (
                                <button
                                    onClick={handleClearChat}
                                    disabled={isClearing}
                                    style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}
                                    title="Clear Chat History"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-dark)',
                                padding: '14px 18px',
                                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                maxWidth: '80%',
                                fontSize: '0.98rem',
                                color: msg.role === 'user' ? '#00391f' : 'var(--text-primary)',
                                fontWeight: msg.role === 'user' ? '700' : '500',
                                boxShadow: msg.role === 'user' ? '0 4px 15px rgba(76,224,146,0.3)' : 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)',
                                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.01)'
                            }}>
                                {msg.isTemp ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="dot-pulse" style={{ display: 'flex', gap: '4px' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.4s infinite ease-in-out both' }}></span>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                ) : (
                                    renderMessageText(msg.text)
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Input Trough Bar */}
            <div className="search-bar-container-inset" style={{
                width: '100%',
                padding: '10px 10px 10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--bg-dark)',
                border: '1px solid rgba(255, 255, 255, 0.02)',
                borderRadius: '50px',
                boxShadow: 'var(--neo-inset)',
                transition: 'all 0.3s ease'
            }}>
                <Sparkles size={18} style={{ color: 'var(--accent-primary)', minWidth: '18px' }} />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => messages.length > 0 && setIsOpen(true)}
                    placeholder="Ask GlazeAI to edit, summarize, or explain..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '500',
                        fontFamily: 'Manrope',
                        outline: 'none',
                        padding: '6px 0'
                    }}
                />
                <button
                    onClick={handleSend}
                    className="btn-primary"
                    style={{
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <Send size={15} />
                </button>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}</style>
        </div>
    );
});

export default AIChatBar;
