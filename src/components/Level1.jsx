import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy } from 'lucide-react';
import Tire3D from './Tire3D';
import Level1Car from './Car.jsx';

export default function Level1({ onComplete }) {
    const [tiresPlaced, setTiresPlaced] = useState([]);

    const handleTireDrop = (slotId) => {
        if (!tiresPlaced.includes(slotId)) {
            setTiresPlaced((prev) => [...prev, slotId]);
        }
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('tire', 'soft-compound');
        e.dataTransfer.effectAllowed = 'copy';
    };

    const isComplete = tiresPlaced.length === 4;

    return (
        <section className="game-container" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Header */}
            <header className="game-header">
                <div className="brand">
                    <span className="papaya">The Fastest Pit Stop</span> for Love
                </div>
                <div className="stats">
                    <span className="timer">00:00.00</span>
                    <div className="tire-count">
                        {tiresPlaced.length}/4 <Heart size={18} color="#ff8000" fill="#ff8000" style={{ marginLeft: 4 }} />
                    </div>
                </div>
            </header>

            {/* 3D Canvas Area - REVERTED TO CSS 3D MODEL */}
            <main className="canvas-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
                <div className="f1-car-3d" id="f1-car-3d">
                    {/* Car Body */}
                    <div className="f1-body">
                        <div className="f1-nose"></div>
                        <div className="f1-chassis">
                            <div className="f1-cockpit">
                                <div className="f1-halo"></div>
                                <div className="f1-driver"></div>
                            </div>
                            <div className="f1-engine-cover">
                                <div className="f1-number">4</div>
                            </div>
                            <div className="f1-sidepod left"></div>
                            <div className="f1-sidepod right"></div>
                        </div>
                        <div className="f1-rear-wing">
                            <div className="f1-wing-plate"></div>
                            <div className="f1-wing-endplate left"></div>
                            <div className="f1-wing-endplate right"></div>
                            <div className="f1-drs-text">DRS</div>
                        </div>
                        <div className="f1-front-wing">
                            <div className="f1-front-wing-plate"></div>
                        </div>
                    </div>

                    {/* Interactive Wheel Slots */}
                    {['fl', 'fr', 'rl', 'rr'].map((slotId) => {
                        const isPlaced = tiresPlaced.includes(slotId);
                        return (
                            <div
                                key={slotId}
                                className={`wheel-slot ${isPlaced ? 'filled' : ''} ${slotId === 'rl' || slotId === 'rr' ? 'large' : ''}`}
                                id={`slot-${slotId}`}
                                data-slot={slotId}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const tireData = e.dataTransfer.getData('tire');
                                    if (tireData) handleTireDrop(slotId);
                                }}
                                onClick={() => handleTireDrop(slotId)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: isPlaced ? 'none' : '2px dashed rgba(255,128,0,0.5)' /* Orange dash */
                                }}
                            >
                                {isPlaced ? (
                                    <div style={{ transform: 'scale(0.9)' }}>
                                        <Tire3D />
                                    </div>
                                ) : (
                                    <div className="wheel-slot-inner">
                                        <div className="slot-empty-ring">
                                            <Heart className="slot-heart" size={20} color="#ff8000" />
                                            <span className="slot-label" style={{ color: '#ff8000' }}>{slotId.toUpperCase()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="f1-ground-shadow"></div>
                </div>

                {/* Lando Norris Dialog */}
                <motion.div
                    className="character-dialog"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{ position: 'absolute', bottom: '180px', left: '20px', zIndex: 10, display: 'flex', alignItems: 'flex-end', gap: '16px' }}
                >
                    <div className="character-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #ff8000', overflow: 'hidden', background: '#fff' }}>
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ4fWSVW16I0y_mPQaQ1f_thCgJx8dpJHxmYSKQm2f4L0KiY8tD060rfNBy0xapgu8jldI4KvZJb0M42zOoCkOv7mMczgfYB8fVIRcuilXHk9jxgHF_2_bo4HnInQPOKpBfP83Yu3xyaXgpRTZlOMi2XgcZQZHOQqwybgH7TvobaE7-ywc8r0gSsr7x0GKX_bWSdHf2YOW-L-XNJFOjQRmQqJ-kwTTJfsTLkdbXwP2oPgvJ1vVSPl97s8Gi5Ga7u2Gb2uWA0oKQ66J"
                            alt="Lando Norris"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="dialog-bubble" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '16px', borderRadius: '16px', borderBottomLeftRadius: '4px', maxWidth: '300px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                        <p className="dialog-name" style={{ fontWeight: '900', color: '#ff8000', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Lando Norris</p>
                        <p className="dialog-text" style={{ color: '#333', fontSize: '0.95rem', lineHeight: '1.4' }}>
                            "Box, Box! Perfect stop! Let's get these <span style={{ color: '#ff8000', fontWeight: 'bold' }}>Valentine Softs</span> on before the light turns green!"
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Tire Inventory (Draggable) */}
            <footer className="footer-hud">
                {!isComplete ? (
                    <div className="tire-dock">
                        <p className="instruction">Drag tires to the glowing hubs!</p>
                        <div className="tire-row">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="tire-draggable"
                                    draggable
                                    onDragStart={handleDragStart}
                                    style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Tire3D />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="success-panel"
                    >
                        <Trophy size={40} className="trophy-icon" />
                        <div>
                            <h2>Perfect Stop! 1.8s</h2>
                            <p>That was lightning fast!</p>
                        </div>
                        <button className="btn-next" onClick={onComplete}>
                            Next Level &rarr;
                        </button>
                    </motion.div>
                )}
            </footer>
        </section>
    );
}
