import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel" }) => {
    // Disable background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '20px'
        }}>
            <div className="card-neumorphic-outset" style={{
                maxWidth: '440px',
                width: '100%',
                padding: '40px 32px',
                borderRadius: '2.5rem',
                background: 'var(--bg-dark)',
                border: '1px solid rgba(255, 255, 255, 0.02)',
                boxShadow: 'var(--neo-outset)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* Warning Icon inside inset neumorphic trough */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f87171',
                }}>
                    <AlertTriangle size={24} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{
                        fontSize: '1.45rem',
                        fontWeight: '800',
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope'
                    }}>
                        {title}
                    </h3>
                    <p style={{
                        fontSize: '0.98rem',
                        color: 'var(--text-secondary)',
                        opacity: 0.8,
                        lineHeight: 1.6,
                        margin: 0,
                        fontFamily: 'Manrope'
                    }}>
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    width: '100%',
                    marginTop: '8px'
                }}>
                    <button
                        onClick={onCancel}
                        className="modal-cancel-btn"
                        style={{
                            flex: 1,
                            padding: '12px 18px',
                            background: 'var(--bg-dark)',
                            border: '1px solid rgba(255, 255, 255, 0.01)',
                            borderRadius: '14px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.92rem',
                            fontWeight: '700',
                            fontFamily: 'Manrope',
                            cursor: 'pointer',
                            boxShadow: 'var(--neo-btn-outset)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="modal-confirm-btn"
                        style={{
                            flex: 1,
                            padding: '12px 18px',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '14px',
                            color: 'white',
                            fontSize: '0.92rem',
                            fontWeight: '700',
                            fontFamily: 'Manrope',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.92); }
                    to { opacity: 1; transform: scale(1); }
                }

                .modal-cancel-btn:hover {
                    box-shadow: 6px 6px 16px var(--shadow-dark), -6px -6px 16px var(--shadow-light) !important;
                    transform: translateY(-1px);
                    color: var(--text-primary) !important;
                }
                .modal-cancel-btn:active {
                    box-shadow: var(--neo-btn-inset) !important;
                    transform: translateY(1px);
                }

                .modal-confirm-btn:hover {
                    background: #dc2626 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.45) !important;
                }
                .modal-confirm-btn:active {
                    transform: translateY(1px);
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
