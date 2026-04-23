import React, { useState, useEffect } from 'react';

export default function Level3({ onComplete }) {
    const [selectedDest, setSelectedDest] = useState(null);
    const [lights, setLights] = useState([false, false, false, false, false]); // 5 lights
    const [lightsGo, setLightsGo] = useState(false);
    const [started, setStarted] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const startLevel = () => {
        setStarted(true);
    };

    const handleSelectDest = (dest) => {
        if (selectedDest) return; // already selected
        setSelectedDest(dest);

        // Start lights sequence
        let currentLight = 0;
        const interval = setInterval(() => {
            if (currentLight < 5) {
                setLights(prev => {
                    const newLights = [...prev];
                    newLights[currentLight] = true;
                    return newLights;
                });
                currentLight++;
            } else {
                clearInterval(interval);
                // Lights out
                setTimeout(() => {
                    setLightsGo(true);
                    // Finish race
                    setTimeout(() => {
                        onComplete();
                    }, 1500);
                }, 1000);
            }
        }, 800);
    };

    return (
        <section className="screen active" style={{ width: '100%', height: '100%', position: 'absolute' }}>
            {/* Starting Lights */}
            <div className="starting-lights">
                <div className="lights-container">
                    {lights.map((isOn, i) => (
                        <div key={i} className={`light ${isOn && !lightsGo ? 'on' : ''} ${lightsGo ? 'go' : ''}`}></div>
                    ))}
                </div>
            </div>

            {/* Cockpit View */}
            <div className="cockpit-view">
                {/* Telemetry */}
                <div className="cockpit-telemetry left">
                    <div className="cockpit-card">
                        <p className="cockpit-label">Driver</p>
                        <p className="cockpit-val">VALENTINE 01</p>
                    </div>
                </div>

                {/* Steering Wheel */}
                <div className="steering-wheel">
                    <div className="grip grip-left"></div>
                    <div className="grip grip-right"></div>

                    {/* LCD Screen */}
                    <div className="lcd-screen">
                        <div className="lcd-header">
                            <span className="lcd-title">GPS NAVIGATION v2.14</span>
                            <span className="lcd-clock">{time.toLocaleTimeString()}</span>
                        </div>
                        <div className="lcd-content">
                            <p className="lcd-prompt">Select Final Destination</p>

                            <button
                                className={`dest-btn ${selectedDest === 'monaco' ? 'selected' : ''}`}
                                onClick={() => handleSelectDest('monaco')}
                            >
                                <span className="dest-num">01</span>
                                <span className="dest-name">MONACO</span>
                                <span className="material-icons dest-arrow">chevron_right</span>
                            </button>

                            <button
                                className={`dest-btn dest-special ${selectedDest === 'sofa' ? 'selected' : ''}`}
                                onClick={() => handleSelectDest('sofa')}
                            >
                                <span className="dest-auto">AUTO</span>
                                <span className="dest-name">[ FAVORITE SOFA ]</span>
                                <span className="material-icons">favorite</span>
                            </button>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="wheel-brand">
                        <span>McLaren</span>
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="l3-instructions">
                <h1 className="l3-title">Level 3: The Steering Setup</h1>
                <p className="l3-desc">Lock in your destination to trigger the lights out!</p>
            </div>

            {/* Overlay */}
            {!started && (
                <div className="level-overlay active">
                    <div className="overlay-card">
                        <h2 className="overlay-level">Level 3</h2>
                        <h3 className="overlay-title">The Steering Setup</h3>
                        <p className="overlay-desc">Select your final destination on the wheel to start the race!</p>
                        <button className="btn-primary btn-large" onClick={startLevel}>
                            <span className="material-icons">play_arrow</span>
                            Start Race
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
