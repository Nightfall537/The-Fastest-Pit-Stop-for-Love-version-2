import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Environment, ContactShadows, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- MATERIALS ---
// Sleek Metallic Silver for the "Studio" look
const materialBody = new THREE.MeshStandardMaterial({
    color: "#a0a0a0", roughness: 0.3, metalness: 0.8
});
const materialDark = new THREE.MeshStandardMaterial({
    color: "#1a1a1a", roughness: 0.5, metalness: 0.5
});
const materialRubber = new THREE.MeshStandardMaterial({
    color: "#111", roughness: 0.9, metalness: 0.1
});
const materialGlow = new THREE.MeshBasicMaterial({
    color: "#ff8000"
});

// --- SUB-COMPONENTS ---

function Suspension({ position, mirror = false }) {
    const xMult = mirror ? -1 : 1;
    return (
        <group position={position}>
            <mesh position={[0.25 * xMult, 0, 0]} rotation={[0, 0, -0.1 * xMult]}>
                <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
                <primitive object={materialDark} />
            </mesh>
            <mesh position={[0.25 * xMult, -0.1, 0]} rotation={[0, 0, 0.1 * xMult]}>
                <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
                <primitive object={materialDark} />
            </mesh>
        </group>
    )
}

function Wing({ type }) {
    if (type === 'front') {
        return (
            <group position={[0, 0.1, 3.2]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.8, 0.05, 0.5]} />
                    <primitive object={materialDark} />
                </mesh>
                <mesh position={[0, 0.1, -0.1]}>
                    <boxGeometry args={[1.6, 0.02, 0.3]} />
                    <primitive object={materialDark} />
                </mesh>
            </group>
        );
    } else {
        return (
            <group position={[0, 0.9, -1.9]}>
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[1.8, 0.05, 0.4]} />
                    <primitive object={materialDark} />
                </mesh>
                <mesh position={[0.9, 0.1, 0]}>
                    <boxGeometry args={[0.02, 0.8, 0.8]} />
                    <primitive object={materialDark} />
                </mesh>
                <mesh position={[-0.9, 0.1, 0]}>
                    <boxGeometry args={[0.02, 0.8, 0.8]} />
                    <primitive object={materialDark} />
                </mesh>
            </group>
        );
    }
}

function WheelHub({ position, id, placed, onDrop }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            <Suspension position={[id.includes('l') ? 0.35 : -0.35, 0, 0]} mirror={id.includes('l')} />

            {/* DROP ZONE VISUAL - Glowing Ring */}
            {!placed && (
                <group rotation={[0, 0, Math.PI / 2]} position={id.includes('l') ? [-0.2, 0, 0] : [0.2, 0, 0]}>
                    {/* Outer Glow Ring */}
                    <mesh>
                        <ringGeometry args={[0.3, 0.35, 32]} />
                        <meshBasicMaterial color="#ff8000" transparent opacity={hovered ? 1 : 0.6} side={THREE.DoubleSide} />
                    </mesh>
                    {/* Inner Heart Icon */}
                    <Text
                        fontSize={0.3}
                        color="#ff8000"
                        position={[0, 0, 0]}
                        rotation={[0, 0, -Math.PI / 2]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        ♥
                    </Text>
                </group>
            )}

            {/* TIRE MODEL */}
            {placed && (
                <group rotation={[0, 0, Math.PI / 2]}>
                    <mesh>
                        <cylinderGeometry args={[0.5, 0.5, 0.55, 32]} />
                        <primitive object={materialRubber} />
                    </mesh>

                    {/* Silver Rim */}
                    <group position={[0, 0.28, 0]}>
                        <mesh>
                            <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
                            <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} />
                        </mesh>
                        <mesh position={[0, 0, 0.03]}>
                            <dodecahedronGeometry args={[0.06]} />
                            <meshStandardMaterial color="#ff3333" />
                        </mesh>
                    </group>

                    {/* Tire Sidewall Stripe */}
                    <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.4, 0.01, 32, 64]} />
                        <meshBasicMaterial color="#ff3b3b" />
                    </mesh>

                    {/* Heart Decoration */}
                    <group position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <Text
                            position={[0, 0.35, 0.01]}
                            fontSize={0.15}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            rotation={[0, 0, -Math.PI / 2]}
                        >
                            ♥
                        </Text>
                    </group>
                </group>
            )}

            {/* HTML Drop Target */}
            {!placed && (
                <Html position={[0, 0, 0]} transform distanceFactor={5}>
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transform: 'translate(-50%, -50%)',
                        }}
                        onDragOver={(e) => { e.preventDefault(); setHovered(true); }}
                        onDragLeave={() => setHovered(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setHovered(false);
                            const tireId = e.dataTransfer.getData('tire');
                            if (tireId) onDrop(id);
                        }}
                    />
                </Html>
            )}
        </group>
    );
}

// --- MAIN CAR ASSEMBLY ---
function StudioCar({ tiresPlaced, onTireDrop }) {
    // Use a Float to give it that "hero shot" presence
    return (
        <group rotation={[0, -Math.PI / 2, 0]}> {/* Rotate to side view */}
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
                <group>
                    {/* Main Body - Silver & Sleek */}
                    <mesh position={[0, 0.2, 0]}>
                        {/* Fuse-lage */}
                        <boxGeometry args={[1.4, 0.5, 4.5]} />
                        <primitive object={materialBody} />
                    </mesh>

                    {/* Nose */}
                    <mesh position={[0, 0.3, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.1, 0.4, 1.5, 16]} />
                        <primitive object={materialBody} />
                    </mesh>

                    {/* Engine Cover */}
                    <mesh position={[0, 0.8, -1.0]}>
                        <boxGeometry args={[0.5, 0.6, 2.0]} />
                        <primitive object={materialBody} />
                    </mesh>

                    {/* Sidepods */}
                    <mesh position={[0.6, 0.3, 0.2]}>
                        <boxGeometry args={[0.6, 0.4, 1.8]} />
                        <primitive object={materialBody} />
                    </mesh>
                    <mesh position={[-0.6, 0.3, 0.2]}>
                        <boxGeometry args={[0.6, 0.4, 1.8]} />
                        <primitive object={materialBody} />
                    </mesh>

                    {/* Halo */}
                    <mesh position={[0, 0.8, 0.5]} rotation={[0.2, 0, 0]}>
                        <torusGeometry args={[0.3, 0.04, 8, 16, Math.PI]} rotation={[Math.PI / 2, 0, 0]} />
                        <primitive object={materialDark} />
                    </mesh>
                </group>

                <Wing type="front" />
                <Wing type="rear" />

                {/* Wheel Hubs */}
                <WheelHub position={[-1.1, 0.35, 1.9]} id="fl" placed={tiresPlaced.includes('fl')} onDrop={onTireDrop} />
                <WheelHub position={[1.1, 0.35, 1.9]} id="fr" placed={tiresPlaced.includes('fr')} onDrop={onTireDrop} />
                <WheelHub position={[-1.1, 0.35, -1.6]} id="rl" placed={tiresPlaced.includes('rl')} onDrop={onTireDrop} />
                <WheelHub position={[1.1, 0.35, -1.6]} id="rr" placed={tiresPlaced.includes('rr')} onDrop={onTireDrop} />
            </Float>
        </group>
    );
}

// --- EXPORTED COMPONENT ---
export default function Level1Car({ tiresPlaced, onTireDrop }) {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 40 }} shadows dpr={[1, 2]}>
            <color attach="background" args={['#d0d0d0']} /> {/* Grey Studio Background */}
            <ambientLight intensity={0.4} />

            {/* Studio Lighting Setup */}
            <spotLight position={[0, 10, 5]} intensity={1} angle={0.5} penumbra={1} castShadow />
            <spotLight position={[0, 5, 10]} intensity={2} color="#fff" />
            <rectAreaLight width={10} height={2} intensity={2} position={[0, 5, 5]} color="white" />

            <Environment preset="studio" />

            {/* OrbitControls allowing full 360 inspection to reach all 4 tires */}
            <OrbitControls
                enableZoom={true}
                minDistance={5}
                maxDistance={15}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
            />

            <StudioCar tiresPlaced={tiresPlaced} onTireDrop={onTireDrop} />

            <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="black" />
        </Canvas>
    )
}
