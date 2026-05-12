import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            padding: '0.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            borderRadius: '100px',
            flexWrap: 'wrap'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '50px', height: '50px', borderRadius: '0%', padding: '2px' }} />
                GlazeNote
            </div>

            {/* Desktop Menu */}
            <div className="nav-links hide-on-mobile" style={{ display: 'flex', gap: '2rem' }}>
                <a href="#features" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.95rem' }}>Features</a>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, fontSize: '0.95rem' }}>About</a>
            </div>
            <button className="btn-primary hide-on-mobile" style={{ padding: '10px 28px', fontSize: '0.9rem' }} onClick={() => window.location.href = '/auth'}>Get Started</button>

            {/* Mobile Menu Toggle */}
            <div className="show-on-mobile">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="glass-strong" style={{
                    position: 'absolute',
                    top: '80px',
                    left: '0',
                    width: '100%',
                    flexDirection: 'column',
                    padding: '20px',
                    gap: '20px',
                    borderRadius: '20px',
                    display: 'flex',
                    zIndex: 999
                }}>
                    <a href="#features" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '10px', textAlign: 'center' }}>Features</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', padding: '10px', textAlign: 'center' }}>About</a>
                    <button className="btn-primary" onClick={() => window.location.href = '/auth'} style={{ width: '100%' }}>Get Started</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
