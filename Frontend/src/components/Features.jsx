import React from 'react';

const features = [
    {
        title: 'AI Smart Brain',
        desc: 'Advanced auto-tagging, deep content summarization, and direct block editor integrations powered by high-performance Llama-3 models.',
        icon: '✨'
    },
    {
        title: 'Bento Grid Dashboard',
        desc: 'Seamlessly search, bookmark, and filter your notes using beautiful high-contrast outset grids and inset text fields.',
        icon: '🍱'
    },
    {
        title: 'Modern Typography',
        desc: 'Tailored typography using the Google Manrope typeface alongside sleek Material Icons and responsive collapsible panels.',
        icon: '🎨'
    }
];

const Features = () => {
    return (
        <section id="features" className="container" style={{ padding: '80px 48px 140px', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: 'Manrope', letterSpacing: '-0.02em' }}>Designed for focus</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-secondary)', opacity: 0.8 }}>Everything you need to stay productive, without the clutter.</p>
            </div>
            <div className="grid-1-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {features.map((f, i) => (
                    <div 
                        className="card-neumorphic-outset feature-card" 
                        key={i} 
                        style={{ 
                            padding: '40px', 
                            textAlign: 'left', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                            background: 'var(--bg-dark)',
                            borderRadius: '2.5rem',
                            boxShadow: 'var(--neo-outset)',
                            border: '1px solid rgba(255,255,255,0.02)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* Recessed emoji box circle */}
                        <div style={{ 
                            fontSize: '1.8rem', 
                            marginBottom: '28px', 
                            background: 'var(--bg-dark)', 
                            boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)',
                            width: '64px', 
                            height: '64px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}>
                            {f.icon}
                        </div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope' }}>{f.title}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', opacity: 0.8, lineHeight: '1.65' }}>{f.desc}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .feature-card:hover {
                    box-shadow: 16px 16px 40px var(--shadow-dark), -16px -16px 40px var(--shadow-light) !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </section>
    );
};

export default Features;
