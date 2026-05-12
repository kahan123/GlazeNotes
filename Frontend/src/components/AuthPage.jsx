import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../services/api';
import { useUser } from '../context/UserContext';
import { Mail, Lock, User } from 'lucide-react';
import { gsap } from 'gsap';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { login } = useUser();
    const [authLoading, setAuthLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Refs for GSAP
    const cardRef = useRef(null);
    const bgBlob1Ref = useRef(null);
    const bgBlob2Ref = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Staggered entrance animation for form fields whenever mode toggles
    useEffect(() => {
        const items = document.querySelectorAll('.form-item-stagger');
        if (items.length > 0) {
            gsap.fromTo(items, 
                { opacity: 0, y: 15, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
            );
        }
    }, [isSignUp, isMobile]);

    // Initial mount card entrance and infinite background animations
    useEffect(() => {
        // Ambient background floats
        gsap.to(bgBlob1Ref.current, {
            x: '60px',
            y: '-40px',
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        gsap.to(bgBlob2Ref.current, {
            x: '-60px',
            y: '60px',
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Entrance scale-up of the main login card
        gsap.fromTo(cardRef.current,
            { opacity: 0, scale: 0.95, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power4.out' }
        );

        return () => {
            gsap.killTweensOf([bgBlob1Ref.current, bgBlob2Ref.current, cardRef.current]);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setAuthLoading(true);
        try {
            const endpoint = isSignUp ? '/auth/register' : '/auth/login';
            const { data } = await API.post(endpoint, formData);

            login(data);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setAuthLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setAuthLoading(true);
            try {
                const { data } = await API.post('/auth/google', {
                    token: tokenResponse.access_token
                });
                login(data);
                navigate('/app');
            } catch (err) {
                console.error(err);
                setError('Google Login Failed');
                setAuthLoading(false);
            }
        },
        onError: () => {
            setError('Google Login Failed');
            setAuthLoading(false);
        },
    });

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            padding: '24px',
            background: 'var(--bg-dark)',
            overflow: 'hidden'
        }}>
            {/* Background floating ambient blobs */}
            <div ref={bgBlob1Ref} style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'rgba(76, 224, 146, 0.035)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                pointerEvents: 'none',
                zIndex: -1
            }} />
            <div ref={bgBlob2Ref} style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'rgba(59, 130, 246, 0.025)',
                borderRadius: '50%',
                filter: 'blur(140px)',
                pointerEvents: 'none',
                zIndex: -1
            }} />

            {authLoading && (
                <div className="loading-overlay">
                    <div className="premium-spinner"></div>
                    <div className="loading-text">
                        {isSignUp ? "Creating your Second Brain..." : "Opening your Second Brain..."}
                    </div>
                </div>
            )}

            <div ref={cardRef} className="card-neumorphic-outset" style={{
                position: 'relative',
                width: '900px',
                maxWidth: '100%',
                minHeight: '600px',
                overflow: 'hidden',
                padding: 0,
                display: 'flex',
                borderRadius: '2.5rem',
                background: 'var(--bg-dark)',
                border: '1px solid rgba(255, 255, 255, 0.02)',
                boxShadow: 'var(--neo-outset)',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                {isMobile ? (
                    /* Mobile Form Layout */
                    <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {/* Inset Glowing 3D Logo Block */}
                            <div className="logo-box-inset form-item-stagger" style={{ 
                                width: '56px', 
                                height: '56px', 
                                borderRadius: '16px', 
                                background: 'var(--bg-dark)', 
                                boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '8px'
                            }}>
                                <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                            </div>
                            
                            <h1 className="form-item-stagger" style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: '800', fontFamily: 'Manrope' }}>
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            {error && <p className="form-item-stagger" style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }}>{error}</p>}

                            <button type="button" onClick={() => googleLogin()} className="google-btn-neo form-item-stagger" style={{
                                width: '100%',
                                padding: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                borderRadius: '14px',
                                background: 'var(--bg-dark)',
                                border: '1px solid rgba(255,255,255,0.01)',
                                boxShadow: 'var(--neo-btn-outset)',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                fontWeight: '700',
                                fontFamily: 'Manrope',
                                transition: 'all 0.2s'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>

                            <span className="form-item-stagger" style={{ fontSize: '0.88rem', opacity: 0.6, color: 'var(--text-secondary)', fontWeight: '600' }}>or use email address</span>

                            {isSignUp && (
                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="text" name="name" placeholder="Full Name" style={inputStyle} required onChange={handleChange} />
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>
                            )}
                            <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                <input type="email" name="email" placeholder="Email Address" style={inputStyle} required onChange={handleChange} />
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                            </div>
                            <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                            </div>

                            <button type="submit" className="btn-primary form-item-stagger" style={{ width: '100%', padding: '14px', marginTop: '12px' }}>
                                {isSignUp ? 'Create Premium Account' : 'Sign In Now'}
                            </button>
                            
                            <p className="form-item-stagger" style={{ marginTop: '16px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setError(''); }} style={{ color: 'var(--accent-primary)', fontWeight: '800', textDecoration: 'none' }}>
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </a>
                            </p>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Desktop Sign Up Form */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            height: '100%',
                            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                            left: '50%',
                            width: '50%',
                            opacity: isSignUp ? 1 : 0,
                            zIndex: isSignUp ? 5 : 1,
                            transform: isSignUp ? 'translateX(0)' : 'translateX(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '64px'
                        }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                                {/* Inset Glowing Logo */}
                                <div className="logo-box-inset form-item-stagger" style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '16px', 
                                    background: 'var(--bg-dark)', 
                                    boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: '4px'
                                }}>
                                    <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                                </div>

                                <h1 className="form-item-stagger" style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope', letterSpacing: '-0.02em' }}>Create Account</h1>
                                {error && <p className="form-item-stagger" style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="google-btn-neo form-item-stagger" style={{
                                    width: '100%',
                                    padding: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    borderRadius: '14px',
                                    background: 'var(--bg-dark)',
                                    border: '1px solid rgba(255,255,255,0.01)',
                                    boxShadow: 'var(--neo-btn-outset)',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    fontWeight: '700',
                                    fontFamily: 'Manrope',
                                    transition: 'all 0.2s'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign up with Google
                                </button>

                                <span className="form-item-stagger" style={{ fontSize: '0.88rem', opacity: 0.6, color: 'var(--text-secondary)', fontWeight: '600' }}>or use email for registration</span>

                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="text" name="name" placeholder="Name" style={inputStyle} required onChange={handleChange} />
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>
                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>
                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>

                                <button type="submit" className="btn-primary form-item-stagger" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>Sign Up</button>
                            </form>
                        </div>

                        {/* Desktop Sign In Form */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            height: '100%',
                            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                            left: 0,
                            width: '50%',
                            zIndex: 2,
                            opacity: isSignUp ? 0 : 1,
                            transform: isSignUp ? 'translateX(-20px)' : 'translateX(0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '64px'
                        }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                                {/* Inset Glowing Logo */}
                                <div className="logo-box-inset form-item-stagger" style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '16px', 
                                    background: 'var(--bg-dark)', 
                                    boxShadow: 'inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: '4px'
                                }}>
                                    <img src="/logo.png" alt="GlazeNote Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                                </div>

                                <h1 className="form-item-stagger" style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Manrope', letterSpacing: '-0.02em' }}>Sign In</h1>
                                {error && <p className="form-item-stagger" style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="google-btn-neo form-item-stagger" style={{
                                    width: '100%',
                                    padding: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    borderRadius: '14px',
                                    background: 'var(--bg-dark)',
                                    border: '1px solid rgba(255,255,255,0.01)',
                                    boxShadow: 'var(--neo-btn-outset)',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    fontWeight: '700',
                                    fontFamily: 'Manrope',
                                    transition: 'all 0.2s'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </button>

                                <span className="form-item-stagger" style={{ fontSize: '0.88rem', opacity: 0.6, color: 'var(--text-secondary)', fontWeight: '600' }}>or use email account</span>

                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>
                                <div className="form-item-stagger" style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.6 }} />
                                </div>

                                <button type="submit" className="btn-primary form-item-stagger" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>Sign In</button>
                            </form>
                        </div>

                        {/* Sliding Overlay Panels */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: '50%',
                            height: '100%',
                            overflow: 'hidden',
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                            zIndex: 100,
                            transform: isSignUp ? 'translateX(-100%)' : 'translateX(0)'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                                color: '#00391f',
                                position: 'relative',
                                left: '-100%',
                                height: '100%',
                                width: '200%',
                                transform: isSignUp ? 'translateX(50%)' : 'translateX(0)',
                                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Overlay Left Text */}
                                <div style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    padding: '0 60px',
                                    textAlign: 'center',
                                    top: 0,
                                    height: '100%',
                                    width: '50%',
                                    transform: isSignUp ? 'translateX(0)' : 'translateX(-20px)',
                                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                    right: '50%',
                                    gap: '16px'
                                }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', color: '#00391f', letterSpacing: '-0.02em', fontFamily: 'Manrope' }}>
                                        Discover your second brain.
                                    </h2>
                                    <p style={{ fontSize: '1.05rem', color: '#004f2d', fontWeight: '600', opacity: 0.9 }}>
                                        Join our premium platform to organize thoughts, draft notes, and harness the full power of advanced AI completions.
                                    </p>
                                    <button 
                                        onClick={() => { setIsSignUp(false); setError(''); }}
                                        className="overlay-btn-neo"
                                        style={{
                                            marginTop: '12px',
                                            padding: '12px 32px',
                                            borderRadius: '50px',
                                            background: '#00391f',
                                            color: 'var(--accent-primary)',
                                            border: 'none',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 14px rgba(0, 57, 31, 0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        I have an account
                                    </button>
                                </div>

                                {/* Overlay Right Text */}
                                <div style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    padding: '0 60px',
                                    textAlign: 'center',
                                    top: 0,
                                    height: '100%',
                                    width: '50%',
                                    transform: isSignUp ? 'translateX(20px)' : 'translateX(0)',
                                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                    right: 0,
                                    gap: '16px'
                                }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', color: '#00391f', letterSpacing: '-0.02em', fontFamily: 'Manrope' }}>
                                        GlazeNotes Premium
                                    </h2>
                                    <p style={{ fontSize: '1.05rem', color: '#004f2d', fontWeight: '600', opacity: 0.9 }}>
                                        Enter your email credentials to securely unlock your digital workspace and AI-assisted drafts.
                                    </p>
                                    <button 
                                        onClick={() => { setIsSignUp(true); setError(''); }}
                                        className="overlay-btn-neo"
                                        style={{
                                            marginTop: '12px',
                                            padding: '12px 32px',
                                            borderRadius: '50px',
                                            background: '#00391f',
                                            color: 'var(--accent-primary)',
                                            border: 'none',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 14px rgba(0, 57, 31, 0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Create an account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .google-btn-neo:hover {
                    box-shadow: 6px 6px 20px var(--shadow-dark), -6px -6px 20px var(--shadow-light) !important;
                    transform: translateY(-1px);
                }
                .google-btn-neo:active {
                    box-shadow: var(--neo-btn-inset) !important;
                    transform: translateY(1px);
                }

                .overlay-btn-neo:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 57, 31, 0.45) !important;
                }
                .overlay-btn-neo:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

const inputStyle = {
    background: 'var(--bg-dark)',
    border: '1px solid rgba(255, 255, 255, 0.01)',
    padding: '14px 15px 14px 48px',
    width: '100%',
    borderRadius: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.98rem',
    fontWeight: '500',
    fontFamily: 'Manrope',
    boxShadow: 'var(--neo-inset)',
    transition: 'all 0.3s ease'
};

export default AuthPage;
