import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, ChevronDown } from 'lucide-react';
import GlassCard from './GlassCard';
import API from '../services/api';

const AIChatBar = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false); // Tracks if chat history is visible
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsOpen(true);

        try {
            // Get context from editor if available
            const context = editor ? editor.getText() : '';

            // Add temporary loading message
            setMessages(prev => [...prev, { role: 'ai', text: 'Thinking...', isTemp: true }]);

            const { data } = await API.post('/ai/chat', {
                message: userMessage.text,
                context
            });

            // Replace temp message with actual response
            setMessages(prev => [
                ...prev.filter(msg => !msg.isTemp),
                { role: 'ai', text: data.reply }
            ]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [
                ...prev.filter(msg => !msg.isTemp),
                { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }
            ]);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            width: '90%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        }}>
            {/* Chat History (Pop-up) */}
            {isOpen && messages.length > 0 && (
                <GlassCard className="glass-strong" style={{
                    width: '100%',
                    maxHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} color="var(--accent-primary)" />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                maxWidth: '85%',
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                color: 'white'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </GlassCard>
            )}

            {/* Input Bar */}
            <div className="glass" style={{
                width: '100%',
                padding: '8px 8px 8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.15)', // Light glass as requested
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
            }}>
                <Sparkles size={20} color="#fff" style={{ minWidth: '20px' }} />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => messages.length > 0 && setIsOpen(true)}
                    placeholder="Ask AI to edit or summarize..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        padding: '8px 0'
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Send size={18} />
                </button>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AIChatBar;
