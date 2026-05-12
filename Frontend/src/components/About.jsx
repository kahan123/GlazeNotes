import React from 'react';

const About = () => {
    return (
        <section id="about" style={{ padding: '80px 24px', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '20px',
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope',
                        letterSpacing: '-0.02em'
                    }}>
                        About GlazeNotes
                    </h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        This website was developed by Kahan Sanghani as a showcase of premium skeuomorphic web design and advanced AI functionality.
                    </p>
                </div>

                <div style={{ marginTop: '64px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>Meet the Creator</h3>
                    
                    <div className="card-neumorphic-outset creator-card" style={{ 
                        padding: '48px 40px', 
                        display: 'inline-flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        minWidth: '360px', 
                        maxWidth: '100%',
                        background: 'var(--bg-dark)',
                        borderRadius: '2.5rem',
                        boxShadow: 'var(--neo-outset)',
                        border: '1px solid rgba(255,255,255,0.02)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        {/* Inset Circular profile picture frame */}
                        <div style={{
                            width: '104px',
                            height: '104px',
                            borderRadius: '50%',
                            background: 'var(--bg-dark)',
                            margin: '0 auto 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            fontFamily: 'Manrope',
                            color: 'var(--accent-primary)',
                            boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)'
                        }}>
                            KS
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>Kahan Sanghani</h3>
                        <p style={{ color: 'var(--accent-primary)', marginBottom: '28px', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Developer & Designer</p>

                        <div className="search-bar-container-inset" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            background: 'var(--bg-dark)', 
                            padding: '12px 24px', 
                            borderRadius: '50px', 
                            boxShadow: 'var(--neo-inset)',
                            border: '1px solid rgba(255,255,255,0.01)'
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>📧</span>
                            <a href="mailto:krishsangghani@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', fontFamily: 'Manrope' }}>
                                krishsangghani@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .creator-card:hover {
                    box-shadow: 16px 16px 40px var(--shadow-dark), -16px -16px 40px var(--shadow-light) !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </section>
    );
};

export default About;
