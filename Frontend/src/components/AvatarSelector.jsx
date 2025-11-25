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
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div className="glass-strong" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '30px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Choose Avatar</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: '15px',
                    marginTop: '10px'
                }}>
                    {AVATAR_OPTIONS.map((avatar, index) => (
                        <div
                            key={index}
                            onClick={() => onSelect(avatar)}
                            className="glass-hover"
                            style={{
                                cursor: 'pointer',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                border: '2px solid rgba(255,255,255,0.1)',
                                padding: '5px'
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
        </div>
    );
};

export default AvatarSelector;
