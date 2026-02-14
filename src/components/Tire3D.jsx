import React from 'react';
import './Tire3D.css';
import { Heart } from 'lucide-react';

export default function Tire3D() {
    return (
        <div className="tire-3d-wrapper">
            <div className="tire-rubber">
                {/* Orange Hearts Decoration on Sidewall */}
                <div className="tire-sidewall-deco">
                    <Heart className="t-heart-icon t1" fill="#ff8000" color="#ff8000" size={16} />
                    <Heart className="t-heart-icon t2" fill="#ff8000" color="#ff8000" size={16} />
                    <Heart className="t-heart-icon t3" fill="#ff8000" color="#ff8000" size={16} />
                </div>

                {/* Rim */}
                <div className="tire-rim">
                    <div className="rim-nut"></div>
                </div>
            </div>
        </div>
    );
}
