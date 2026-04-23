import React, { useEffect } from 'react';
import { Share2, RotateCcw, AlertTriangle } from 'lucide-react';
import './Podium.css';

export default function Podium({ onRestart }) {
    useEffect(() => {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        container.innerHTML = '';
        const colors = ['#f98806', '#a855f7', '#ef4444', '#f472b6', '#22c55e', '#ffffff'];

        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (8 + Math.random() * 10) + 'px';
            piece.style.height = (8 + Math.random() * 10) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (2 + Math.random() * 3) + 's';
            piece.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(piece);
        }

        return () => {
            if (container) container.innerHTML = '';
        };
    }, []);

    // Format race time (mock data or from props)
    const raceTime = "00:14:02.14";

    return (
        <div className="podium-screen">
            <div className="podium-card">
                {/* Header Banner */}
                <div className="podium-header-banner">
                    <h1 className="banner-text">PURPLE SECTOR: NEW RECORD!</h1>
                </div>
                <div className="race-time-label">RACE TIME: {raceTime}</div>

                <div className="podium-body">
                    {/* Left Column: Avatar */}
                    <div className="podium-col-left">
                        <div className="avatar-wrapper">
                            <div className="avatar-border-dashed">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ4fWSVW16I0y_mPQaQ1f_thCgJx8dpJHxmYSKQm2f4L0KiY8tD060rfNBy0xapgu8jldI4KvZJb0M42zOoCkOv7mMczgfYB8fVIRcuilXHk9jxgHF_2_bo4HnInQPOKpBfP83Yu3xyaXgpRTZlOMi2XgcZQZHOQqwybgH7TvobaE7-ywc8r0gSsr7x0GKX_bWSdHf2YOW-L-XNJFOjQRmQqJ-kwTTJfsTLkdbXwP2oPgvJ1vVSPl97s8Gi5Ga7u2Gb2uWA0oKQ66J"
                                    alt="Lando Norris"
                                    className="avatar-img"
                                />
                            </div>
                            <div className="p1-badge">P1</div>
                        </div>
                        <div className="driver-name-tag">NORRIS</div>
                    </div>

                    {/* Right Column: Message & Actions */}
                    <div className="podium-col-right">
                        <div className="race-control-box">
                            <div className="rc-header">
                                <AlertTriangle size={16} className="rc-icon" />
                                <span>RACE CONTROL MESSAGE</span>
                            </div>
                            <p className="rc-body">
                                "Penalty Point Warning: You’ve exceeded the
                                track limits of my heart!"
                            </p>
                        </div>

                        <div className="valentine-msg">
                            <p className="val-text-1">Happy Valentine’s Day to my favorite teammate.</p>
                            <p className="val-text-2">You’re the only person I’d share my DRS with.</p>
                        </div>

                        <div className="action-row">
                            <button className="btn-race-again" onClick={onRestart}>
                                <RotateCcw size={18} />
                                <span>RACE AGAIN</span>
                            </button>
                            <button className="btn-share" onClick={() => alert("Copied to clipboard!")}>
                                <Share2 size={18} />
                                <span>SHARE PODIUM</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="stats-divider"></div>
                <div className="podium-footer">
                    <div className="stat-item">
                        <span className="stat-label">MAX SPEED</span>
                        <div className="stat-value">342<span className="stat-unit"> BPM</span></div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">FUEL STATUS</span>
                        <div className="stat-value">100%<span className="stat-unit"> LOVE</span></div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">TIRE COMPOUND</span>
                        <div className="stat-value">SOFT<span className="stat-unit"> HEART</span></div>
                    </div>
                </div>
            </div>

            <div id="confetti-container"></div>
        </div>
    );
}
