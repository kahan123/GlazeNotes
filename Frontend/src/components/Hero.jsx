import React from 'react';

const Hero = () => {
    return (
        <section className="container mobile-padding-top" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '80px',
            paddingBottom: '60px',
            position: 'relative',
            zIndex: 1
        }}>
            <div className="flex-col-mobile" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <div className="w-full-mobile" style={{ flex: 1, paddingRight: '40px' }}>
                    <h1 style={{ marginBottom: '24px', fontSize: '3.2rem', lineHeight: '1.15' }}>
                        Capture thoughts <br />
                        <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 35px rgba(76, 224, 146, 0.25)' }}>before they fade.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '500px', color: 'var(--text-secondary)' }}>
                        GlazeNotes: The high-contrast, AI-assisted notes app designed for absolute clarity.
                        Organize your second brain with skeuomorphic precision.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button className="btn-primary" onClick={() => window.location.href = '/auth'}>Start Writing Free</button>
                    </div>
                </div>

                <div className="w-full-mobile" style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    {/* Mock Neumorphic Note Card */}
                    <div className="card-neumorphic-outset" style={{ 
                        padding: '40px', 
                        transform: 'rotate(-2deg)', 
                        width: '100%', 
                        maxWidth: '450px', 
                        minHeight: '350px',
                        background: 'var(--bg-dark)',
                        borderRadius: '2.5rem',
                        boxShadow: 'var(--neo-outset)',
                        border: '1px solid rgba(255, 255, 255, 0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '15px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>Project Alpha Plan</span>
                            <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Just now</span>
                        </div>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>✓</span> Brainstorming session completed
                        </p>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                            <span style={{ border: '1px solid var(--text-secondary)', opacity: 0.5, width: '16px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span> Build design system tokens
                        </p>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                            <span style={{ border: '1px solid var(--text-secondary)', opacity: 0.5, width: '16px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span> Neumorphic user testing
                        </p>
                        <div style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                            <span style={{ padding: '4px 12px', background: 'rgba(76, 224, 146, 0.08)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', boxShadow: 'inset 1px 1px 2px var(--shadow-dark)' }}>#design</span>
                            <span style={{ padding: '4px 12px', background: 'rgba(76, 224, 146, 0.08)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', boxShadow: 'inset 1px 1px 2px var(--shadow-dark)' }}>#premium</span>
                        </div>
                    </div>

                    {/* Mock Floating Neumorphic Widget */}
                    <div className="card-neumorphic-outset" style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-20px',
                        padding: '24px',
                        width: '260px',
                        background: 'var(--bg-dark)',
                        borderRadius: '1.5rem',
                        boxShadow: '8px 8px 32px var(--shadow-dark)',
                        border: '1px solid rgba(255,255,255,0.02)',
                        animation: 'floating 4s ease-in-out infinite'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            {/* Inset Circular dot wrapper */}
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-dark)', boxShadow: 'inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px rgba(76,224,146,0.6)' }}></div>
                            </div>
                            <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>Smart Summary</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-secondary)', opacity: 0.9, lineHeight: 1.5 }}>
                            "Interactive session focused on Q4 goals. Key deliverables: Neumorphic Theme & AI Integrations."
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes floating {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
