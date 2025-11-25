import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../services/api';
import { useUser } from '../context/UserContext';
import { ArrowRight, Mail, Lock, User, Chrome } from 'lucide-react';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { login } = useUser();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isSignUp ? '/auth/register' : '/auth/login';
            const { data } = await API.post(endpoint, formData);

            login(data);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data } = await API.post('/auth/google', {
                    token: tokenResponse.access_token
                });
                login(data);
                navigate('/app');
            } catch (err) {
                console.error(err);
                setError('Google Login Failed');
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            padding: '20px'
        }}>
            <div className={`glass-strong ${isMobile ? 'perspective-container' : ''}`} style={{
                position: 'relative',
                width: '900px',
                maxWidth: '100%',
                minHeight: '600px',
                overflow: isMobile ? 'visible' : 'hidden',
                padding: 0,
                display: 'flex',
                borderRadius: '20px',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                {/* Mobile Flip Wrapper */}
                {isMobile ? (
                    <div className={`flip-card-inner ${isSignUp ? 'flipped' : ''}`} style={{ flex: 1 }}>
                        {/* Front Face: Sign In */}
                        <div className="flip-card-front glass-strong" style={{ borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '0%', marginBottom: '10px' }} />
                                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Sign in</h1>
                                {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="glass" style={{
                                    width: '100%',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '500'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </button>

                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>or use your email account</span>

                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>

                                <a href="#" style={{ fontSize: '0.9rem', color: 'white', textDecoration: 'none', borderBottom: '1px solid white', paddingBottom: '2px' }}>Forgot your password?</a>

                                <button type="submit" className="glass" style={{ marginTop: '20px', padding: '12px 40px', width: '100%', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Sign In</button>
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); setError(''); }} style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</a>
                                </p>
                            </form>
                        </div>

                        {/* Back Face: Sign Up */}
                        <div className="flip-card-back glass-strong" style={{ borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '0%', marginBottom: '10px' }} />
                                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h1>
                                {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="glass" style={{
                                    width: '100%',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '500'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign up with Google
                                </button>

                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>or use your email for registration</span>

                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="text" name="name" placeholder="Name" style={inputStyle} required onChange={handleChange} />
                                    <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>

                                <button type="submit" className="glass" style={{ marginTop: '20px', padding: '12px 40px', width: '100%', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', color: 'white', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Sign Up</button>
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); setError(''); }} style={{ color: 'white', fontWeight: 'bold' }}>Sign In</a>
                                </p>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Layout */}
                        {/* Sign Up Form Container */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            height: '100%',
                            transition: 'all 0.6s ease-in-out',
                            left: 0,
                            width: '50%',
                            opacity: isSignUp ? 1 : 0,
                            zIndex: isSignUp ? 5 : 1,
                            transform: isSignUp ? 'translateX(100%)' : 'translateX(100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px'
                        }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
                                <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '0%', marginBottom: '-10px' }} />
                                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h1>
                                {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="glass" style={{
                                    width: '100%',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '500'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign up with Google
                                </button>

                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>or use your email for registration</span>

                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="text" name="name" placeholder="Name" style={inputStyle} required onChange={handleChange} />
                                    <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>

                                <button type="submit" className="glass" style={{ marginTop: '20px', padding: '12px 40px', width: '100%', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', color: 'white', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Sign Up</button>
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); setError(''); }} style={{ color: 'white', fontWeight: 'bold' }}>Sign In</a>
                                </p>
                            </form>
                        </div>

                        {/* Sign In Form Container */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            height: '100%',
                            transition: 'all 0.6s ease-in-out',
                            left: 0,
                            width: '50%',
                            zIndex: 2,
                            opacity: isSignUp ? 0 : 1,
                            transform: isSignUp ? 'translateX(100%)' : 'translateX(0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px'
                        }}>
                            <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
                                <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '0%', marginBottom: '10px' }} />
                                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Sign in</h1>
                                {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}

                                <button type="button" onClick={() => googleLogin()} className="glass" style={{
                                    width: '100%',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '500'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </button>

                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>or use your email account</span>

                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle} required onChange={handleChange} />
                                    <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <input type="password" name="password" placeholder="Password" style={inputStyle} required onChange={handleChange} />
                                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} />
                                </div>

                                <a href="#" style={{ fontSize: '0.9rem', color: 'white', textDecoration: 'none', borderBottom: '1px solid white', paddingBottom: '2px' }}>Forgot your password?</a>

                                <button type="submit" className="glass" style={{ marginTop: '20px', padding: '12px 40px', width: '100%', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Sign In</button>
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); setError(''); }} style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</a>
                                </p>
                            </form>
                        </div>
                    </>
                )}

                {/* Overlay Container - Hidden on Mobile */}
                {!isMobile && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: '50%',
                        height: '100%',
                        overflow: 'hidden',
                        transition: 'transform 0.6s ease-in-out',
                        zIndex: 100,
                        transform: isSignUp ? 'translateX(-100%)' : 'translateX(0)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(to right, var(--accent-primary), #4f46e5)',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: '0 0',
                            color: '#FFFFFF',
                            position: 'relative',
                            left: '-100%',
                            height: '100%',
                            width: '200%',
                            transform: isSignUp ? 'translateX(50%)' : 'translateX(0)',
                            transition: 'transform 0.6s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Overlay Left (Visible when Sign Up is active) */}
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
                                transform: 'translateX(0)',
                                transition: 'transform 0.6s ease-in-out',
                                right: '50%'
                            }}>
                                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.2', color: 'white' }}>
                                    Sign up to start taking notes and organize your life.
                                </p>
                            </div>

                            {/* Overlay Right (Visible when Sign In is active) */}
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
                                transform: 'translateX(0)',
                                transition: 'transform 0.6s ease-in-out',
                                right: 0
                            }}>
                                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.2', color: 'white' }}>
                                    Sign in to access your notes.
                                </p>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '12px 15px 12px 45px',
    width: '100%',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
};

export default AuthPage;
