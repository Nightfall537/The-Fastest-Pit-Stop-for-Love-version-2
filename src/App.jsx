import React, { useState } from 'react';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Podium from './components/Podium';
import './App.css';

export default function App() {
    const [screen, setScreen] = useState('level1');

    const goToLevel2 = () => setScreen('level2');
    const goToLevel3 = () => setScreen('level3');
    const goToPodium = () => setScreen('podium');
    const restart = () => setScreen('level1');

    return (
        <div className="game-root" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
            {screen === 'level1' && <Level1 onComplete={goToLevel2} />}
            {screen === 'level2' && <Level2 onComplete={goToLevel3} />}
            {screen === 'level3' && <Level3 onComplete={goToPodium} />}
            {screen === 'podium' && <Podium onRestart={restart} />}
        </div>
    );
}
