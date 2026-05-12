import React from 'react';
import { X } from 'lucide-react';

const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver'
];

const AvatarSelector = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '20px'
        }}>
            <div className="card-neumorphic-outset animate-scale-up" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '40px 32px',
                borderRadius: '2.5rem',
                background: 'var(--bg-dark)',
                border: '1px solid rgba(255, 255, 255, 0.02)',
                boxShadow: 'var(--neo-outset)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>Choose Avatar</h2>
                    <button 
                        onClick={onClose} 
                        className="neo-btn"
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--text-secondary)', 
                            cursor: 'pointer', 
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: '20px',
                    marginTop: '8px'
                }}>
                    {AVATAR_OPTIONS.map((avatar, index) => (
                        <div
                            key={index}
                            onClick={() => onSelect(avatar)}
                            className="avatar-option-neo"
                            style={{
                                cursor: 'pointer',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                background: 'var(--bg-dark)',
                                border: '1px solid rgba(255, 255, 255, 0.01)',
                                padding: '6px',
                                boxShadow: 'var(--neo-btn-outset)',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-scale-up {
                    animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.92); }
                    to { opacity: 1; transform: scale(1); }
                }

                .avatar-option-neo:hover {
                    box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light) !important;
                    transform: scale(0.96);
                }
            `}</style>
        </div>
    );
};

export default AvatarSelector;
