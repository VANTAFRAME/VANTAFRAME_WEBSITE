import React, { useEffect, useState } from 'react';
import './VFWireframeLogo.css';

const VFWireframeLogo = ({
    autoPlay = true,
    onComplete = () => { },
    duration = 2000
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!autoPlay) return;

        const timeout = setTimeout(() => {
            setVisible(true);
            setTimeout(() => {
                onComplete();
            }, duration);
        }, 100);

        return () => clearTimeout(timeout);
    }, [autoPlay, duration, onComplete]);

    return (
        <div className="vf-wireframe-container">
            <div className={`vf-logo-wrapper ${visible ? 'visible' : ''}`}>
                <img
                    src="/vf-logo-wireframe.png"
                    alt="VANTAFRAME Logo"
                    className="vf-logo-image"
                />
            </div>
        </div>
    );
};

export default VFWireframeLogo;
