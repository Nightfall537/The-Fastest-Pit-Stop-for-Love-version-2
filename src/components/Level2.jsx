import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Level2({ onComplete }) {
    const [fuel, setFuel] = useState(0);
    const [pumps, setPumps] = useState(0);
    const [started, setStarted] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);

    // Stats
    const [bpm, setBpm] = useState(60);
    const [lead, setLead] = useState(0.000);

    const startTimeRef = useRef(null);

    const startLevel = () => {
        setShowOverlay(false);
        setStarted(true);
        startTimeRef.current = Date.now();
    };

    const handlePump = () => {
        if (!started || fuel >= 100) return;

        const newPumps = pumps + 1;
        setPumps(newPumps);

        // Add fuel
        const increment = 4 + Math.random() * 2; // Slightly faster than original
        const newFuel = Math.min(100, fuel + increment);
        setFuel(newFuel);

        // Update stats
        setBpm(Math.floor(60 + (newFuel / 100) * 120));

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setLead((elapsed * 0.001 + newFuel * 0.001).toFixed(3));
    };


    return (
        <section className="screen active" style={{ width: '100%', height: '100%', position: 'absolute' }}>
            {/* Background elements */}
            <div className="hud-border"></div>
            <div className="scanline-overlay"></div>

            <header className="l2-header">
                <div className="l2-header-left">
                    <div className="l2-level-badge">LEVEL 02</div>
                    <h1 className="l2-title">The Fuel Up</h1>
                    <p className="l2-subtitle">Rapidly shift the pump to fill the tank with love!</p>
                </div>
                <div className="l2-header-right">
                    {/* Progress bars visual */}
                    <div className="progress-bars">
                        <div className="pb filled"></div>
                        <div className="pb filled"></div>
                        <div className="pb"></div>
                    </div>
                    <div className="lead-display">
                        <span className="lead-label">Current Lead</span>
                        <div className="lead-value"><span className="lead-time">{lead}s</span> <span>AHEAD</span></div>
                    </div>
                </div>
            </header>

            <main className="l2-main">
                {/* Left Telemetry */}
                <div className="telemetry-left">
                    <div className="telemetry-card">
                        <span className="telemetry-label">Heart Rate</span>
                        <div className="telemetry-value">{bpm} <span className="telemetry-unit">BPM</span></div>
                    </div>
                    <div className="telemetry-card">
                        <span className="telemetry-label">Grip Level</span>
                        <div className="telemetry-value"><span>ETERNAL</span></div>
                    </div>
                </div>

                {/* Center Gauge */}
                <div className="gauge-container">
                    <div className="gauge-wrapper">
                        <svg className="gauge-svg" viewBox="0 0 200 110">
                            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
                            {/* Dynamic Gauge Stroke */}
                            <path
                                d="M 10 100 A 90 90 0 0 1 190 100"
                                fill="none"
                                stroke="#f98806"
                                strokeWidth="16"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * fuel / 100)}
                            />
                        </svg>
                        <div className="gauge-center">
                            <span className="material-icons gauge-heart">favorite</span>
                            <div className="gauge-label">Full Heart</div>
                        </div>
                    </div>
                    <div className="gauge-labels">
                        <span>Empty</span>
                        <span className="primary-color">{Math.floor(fuel)}% Charged</span>
                    </div>
                </div>

                {/* Right Telemetry */}
                <div className="telemetry-right">
                    <div className="telemetry-card right">
                        <span className="telemetry-label">Adrenaline</span>
                        <div className="telemetry-value"><span className="primary-color">{Math.floor(fuel)}</span> <span className="telemetry-unit">%</span></div>
                    </div>
                    <div className="telemetry-card right">
                        <span className="telemetry-label">Lap Progress</span>
                        <div className="telemetry-value">{Math.floor(fuel * 0.9)} <span className="telemetry-unit">%</span></div>
                    </div>
                </div>

                {/* Car Visual - Static Image with filters */}
                <div className="l2-car-visual">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19HnvXqC7NKU85WT4ZEtKooxr_pJNA-H1jCt_Ve2bfESvXVwm-aFCe7hibscmxCqjS2BsXGkJ0G71jUVDfgJ1SeUSkI6xiEL8jbtagvgEQBseg1izBDJ23Q1vJl8DBauyY9v7AUYS5Zq0kjEf_-Y5YDWzu9l6P3xZv1tiKL1HLzKKYhsAJa6mDDdos69GrDZAYyfiodCHMZKTClXNYY9kz46cr-NgugAwdZg2llIpq2p-fuWnpyH2GYBPbMgiX5c1fnSOVASpa6Y6"
                        alt="F1 Car"
                        className="l2-car-img"
                        style={{
                            opacity: 0.35 + (fuel / 100) * 0.65,
                            filter: `brightness(${0.5 + (fuel / 100) * 0.5}) contrast(1.25)`
                        }}
                    />
                    <div className="l2-car-glow" style={{ opacity: (fuel / 100) * 0.5 }}></div>
                </div>
            </main>

            <footer className="l2-footer">
                <div className="pump-area">
                    <div className="pump-glow"></div>
                    <motion.button
                        className="pump-button"
                        onClick={handlePump}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="pump-shifter"></div>
                        <span className="material-icons pump-icon">speed</span>
                        <span className="pump-label">PUMP</span>
                    </motion.button>
                </div>

                {/* Next Level Button (appears when full) */}
                {fuel >= 100 && (
                    <div className="l2-next-container" style={{ position: 'absolute', right: '40px', bottom: '120px', display: 'block' }}>
                        <button className="btn-skew" onClick={onComplete}>
                            <span>Race to the Finish</span>
                            <span className="material-icons">flag</span>
                        </button>
                    </div>
                )}

                <div className="fuel-info">
                    <div className="fuel-stat">
                        <span className="fuel-stat-label">Flow Rate</span>
                        <span className="fuel-stat-value dark">{(pumps / Math.max(1, (Date.now() - startTimeRef.current) / 1000) * 2).toFixed(1)} L/S</span>
                    </div>
                </div>
            </footer>

            {/* Overlay */}
            {showOverlay && (
                <div className="level-overlay active">
                    <div className="overlay-card">
                        <h2 className="overlay-level">Level 2</h2>
                        <h3 className="overlay-title">The Fuel Up</h3>
                        <p className="overlay-desc">Rapidly click the pump button to fill the love tank to 100%!</p>
                        <button className="btn-primary btn-large" onClick={startLevel}>
                            <span className="material-icons">play_arrow</span>
                            Start Fueling
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
