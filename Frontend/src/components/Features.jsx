import React from 'react';
import GlassCard from './GlassCard';

const features = [
    {
        title: 'AI Powered',
        desc: 'Auto-tagging, summarization, and content generation at your fingertips.',
        icon: '✨'
    },
    {
        title: 'Sync Everywhere',
        desc: 'Seamlessly access your notes across all devices, offline or online.',
        icon: '🔄'
    },
    {
        title: 'Infinite Canvas',
        desc: 'Visualize your ideas freely with our new whiteboard mode.',
        icon: '🎨'
    }
];

const Features = () => {
    return (
        <section id="features" className="container" style={{ padding: '60px 24px 120px', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Designed for focus</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Everything you need to stay productive, without the clutter.</p>
            </div>
            <div className="grid-1-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {features.map((f, i) => (
                    <GlassCard key={i} style={{ padding: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {f.icon}
                        </div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>{f.title}</h3>
                        <p style={{ margin: 0 }}>{f.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
};

export default Features;
