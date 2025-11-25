import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userAvatar', userData.avatar);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userAvatar');
    };

    const updateUserAvatar = async (avatar) => {
        if (user) {
            try {
                // Optimistic update
                const updatedUser = { ...user, avatar };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                localStorage.setItem('userAvatar', avatar);

                // Persist to backend
                await API.put('/auth/avatar', { avatar });
            } catch (err) {
                console.error('Failed to update avatar', err);
                // Revert on failure (optional, but good practice)
                // For now, we'll keep the optimistic update as it's less jarring
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUserAvatar, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
