import React from 'react';
import GlassCard from './GlassCard';

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
                <div className="w-full-mobile" style={{ flex: 1, paddingRight: '60px' }}>

                    <h1 style={{ marginBottom: '24px' }}>
                        Capture thoughts <br />
                        <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}>before they fade.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '500px' }}>
                        GlazeNote: The minimal, AI-powered notes app designed for clarity.
                        Organize your mind with a tool that feels like an extension of your thought process.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button className="btn-primary" onClick={() => window.location.href = '/auth'}>Start Writing Free</button>

                    </div>
                </div>

                <div className="w-full-mobile" style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <GlassCard style={{ padding: '40px', transform: 'rotate(-2deg)', width: '100%', maxWidth: '450px', minHeight: '350px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                            <span style={{ fontWeight: 'bold' }}>Project Alpha</span>
                            <span style={{ opacity: 0.5 }}>Just now</span>
                        </div>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#4ade80' }}>✓</span> Brainstorming session
                        </p>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ border: '1px solid #666', width: '16px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span> Design system architecture
                        </p>
                        <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ border: '1px solid #666', width: '16px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span> User testing phase 1
                        </p>
                        <div style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                            <span style={{ padding: '4px 12px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '20px', fontSize: '0.8rem', color: '#a78bfa' }}>#design</span>
                            <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '20px', fontSize: '0.8rem', color: '#60a5fa' }}>#urgent</span>
                        </div>
                    </GlassCard>

                    <GlassCard style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-20px',
                        padding: '20px',
                        width: '240px',
                        backdropFilter: 'blur(20px)',
                        background: 'rgba(15, 15, 25, 0.8)',
                        border: '1px solid rgba(255,255,255,0.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'black' }}>AI</span>
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Smart Summary</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.8, lineHeight: 1.4 }}>"Meeting focused on Q4 goals. Key deliverables: UI refresh & Mobile App."</p>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

export default Hero;
