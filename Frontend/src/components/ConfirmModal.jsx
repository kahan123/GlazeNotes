import React, { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "OK", 
    cancelText = "Cancel", 
    isAlert = false,
    type = "danger" // danger, warning, success, info
}) => {
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

    // Type specific colors and icons
    let iconColor = '#ef4444'; // default danger
    let iconBg = 'rgba(239, 68, 68, 0.1)';
    let IconComponent = AlertTriangle;
    let buttonBg = '#ef4444';
    let buttonHoverBg = '#dc2626';
    let buttonShadow = '0 4px 15px rgba(239, 68, 68, 0.35)';

    if (type === 'warning') {
        iconColor = '#f59e0b';
        iconBg = 'rgba(245, 158, 11, 0.1)';
        IconComponent = AlertCircle;
        buttonBg = '#f59e0b';
        buttonHoverBg = '#d97706';
        buttonShadow = '0 4px 15px rgba(245, 158, 11, 0.35)';
    } else if (type === 'success') {
        iconColor = 'var(--accent-primary)';
        iconBg = 'rgba(76, 224, 146, 0.1)';
        IconComponent = CheckCircle2;
        buttonBg = 'var(--accent-primary)';
        buttonHoverBg = 'var(--accent-secondary)';
        buttonShadow = 'var(--glow)';
    } else if (type === 'info') {
        iconColor = '#3b82f6';
        iconBg = 'rgba(59, 130, 246, 0.1)';
        IconComponent = Info;
        buttonBg = '#3b82f6';
        buttonHoverBg = '#2563eb';
        buttonShadow = '0 4px 15px rgba(59, 130, 246, 0.35)';
    }

    const defaultConfirmText = isAlert ? "OK" : (confirmText || "Confirm");

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(18, 20, 20, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
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
                {/* Custom Type Icon inside inset neumorphic trough */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor,
                }}>
                    <IconComponent size={26} />
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
                    {!isAlert && (
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
                    )}
                    <button
                        onClick={onConfirm}
                        className="modal-confirm-btn"
                        style={{
                            flex: 1,
                            padding: '12px 18px',
                            background: buttonBg,
                            border: 'none',
                            borderRadius: '14px',
                            color: type === 'success' ? '#00391f' : 'white',
                            fontSize: '0.92rem',
                            fontWeight: '800',
                            fontFamily: 'Manrope',
                            cursor: 'pointer',
                            boxShadow: buttonShadow,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {defaultConfirmText}
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
                    filter: brightness(1.1) !important;
                    transform: translateY(-1px);
                }
                .modal-confirm-btn:active {
                    transform: translateY(1px);
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;

