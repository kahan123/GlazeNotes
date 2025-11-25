import React from 'react';

const GlassCard = ({ children, className = '', style = {}, ...props }) => {
    return (
        <div
            className={`glass glass-hover ${className}`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
