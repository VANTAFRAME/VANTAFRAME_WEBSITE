import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * InteractiveLogo Component
 * 
 * Implements a high-end 3D rotation effect based on mouse position.
 * Uses GSAP for smooth inertia (lerp-like behavior) and performance.
 * 
 * Behavior:
 * - Tracks mouse moves across the window.
 * - Calculates distance from center (normalized -1 to 1).
 * - Rotates the element:
 *   - Mouse X controls Rotation Y (giving a 3D horizontal tilt)
 *   - Mouse Y controls Rotation X (giving a vertical tilt)
 * - Returns to 0,0 when mouse leaves the viewport or stops (optional, here implemented as continuous follow).
 */
const InteractiveLogo = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Configuration
            const MAX_ROTATION_X = 15; // Degrees (Vertical tilt)
            const MAX_ROTATION_Y = 20; // Degrees (Horizontal tilt)
            const DURATION = 1; // Seconds (Smoothing/Inertia duration)
            const EASE = "power3.out"; // Luxurious easing

            // Set initial 3D perspective
            gsap.set(containerRef.current, {
                perspective: 1000,
                transformStyle: "preserve-3d"
            });

            // Center origin for rotation
            gsap.set(textRef.current, {
                transformOrigin: "center center",
                z: 0
            });

            // Mouse Move Handler
            const onMouseMove = (e) => {
                const { clientX, clientY, innerWidth, innerHeight } = window;

                // Normalize mouse position (-1 to 1)
                // 0 is center, -1 is left/top, 1 is right/bottom
                const xNorm = (clientX / innerWidth) * 2 - 1;
                const yNorm = (clientY / innerHeight) * 2 - 1;

                // Invert Y for correct feel (mouse up = tilt up look)
                // Actually for rotateX: positive = tilt top away (look down), negative = tilt bottom away (look up)
                // Usually we want mouse UP -> Element looks UP (rotateX negative)
                const rotX = -yNorm * MAX_ROTATION_X;
                const rotY = xNorm * MAX_ROTATION_Y;

                gsap.to(textRef.current, {
                    rotateX: rotX,
                    rotateY: rotY,
                    duration: DURATION,
                    ease: EASE,
                    overwrite: 'auto'
                });
            };

            // Reset interaction on leave (optional, adds polish)
            const onMouseLeave = () => {
                gsap.to(textRef.current, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: DURATION,
                    ease: EASE,
                    overwrite: 'auto'
                });
            };

            window.addEventListener('mousemove', onMouseMove);
            document.body.addEventListener('mouseleave', onMouseLeave); // Detect leaving window

            return () => {
                window.removeEventListener('mousemove', onMouseMove);
                document.body.removeEventListener('mouseleave', onMouseLeave);
            };
        }, containerRef); // Scope to container

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full h-full min-h-[400px] select-none pointer-events-none md:pointer-events-auto"
            aria-label="Interactive VF Logo"
        >
            <div
                ref={textRef}
                className="text-[15vw] md:text-[20vw] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-400 to-gray-800 will-change-transform drop-shadow-2xl"
                style={{
                    fontFamily: '"Outfit", sans-serif',
                    textShadow: '0 20px 50px rgba(0,0,0,0.5)' // Deep shadow for depth
                }}
            >
                VF
                <span className="text-[10vw] text-white/20">.</span>
            </div>
        </div>
    );
};

export default InteractiveLogo;
