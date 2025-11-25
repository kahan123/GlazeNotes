import React from 'react';
import GlassCard from './GlassCard';

const About = () => {
    return (
        <section id="about" style={{ padding: '80px 20px', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #fff, #b3b3b3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About GlazeNote
                    </h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
                        This website was developed by Kahan Sanghani as a showcase of modern web design and functionality.
                    </p>
                </div>

                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '30px' }}>Meet the Creator</h3>
                    <GlassCard className="glass-hover" style={{ padding: '40px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', minWidth: '350px', maxWidth: '100%' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                        }}>
                            KS
                        </div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Kahan Sanghani</h3>
                        <p style={{ color: 'var(--accent-secondary)', marginBottom: '25px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Developer & Designer</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ opacity: 0.7 }}>📧</span>
                            <a href="mailto:krishsangghani@gmail.com" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                                krishsangghani@gmail.com
                            </a>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

export default About;
