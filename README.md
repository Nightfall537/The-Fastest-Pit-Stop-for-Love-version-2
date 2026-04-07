

**The Fastest Pit Stop for Love** is an immersive, 3-level browser-based mini-game built for a McLaren / Lando Norris fan as a Valentine's Day experience. Players race through three interactive pit-stop challenges — all wrapped in McLaren's iconic Papaya Orange aesthetic with glassmorphism panels, motion blur transitions, and F1-accurate telemetry UI.

The project ships in **two parallel implementations**:
- **React + Vite** (primary) — component-based, animated, and production-ready.
- **Vanilla HTML/CSS/JS** (legacy) — a standalone multi-screen DOM version requiring zero build tools.

---

## 🏁 Game Overview

```
[Intro] ──► [Level 1: Tire Swap] ──► [Level 2: Fuel Up] ──► [Level 3: Destination] ──► [🏆 Podium]
                    │                         │                        │
             4 heart tires            Love Tank → 100%        F1 Start Lights
             drag-and-drop              click to pump          select date dest.
```

### 🛞 Level 1 — The Tire Swap
Drag and drop **4 heart-shaped tires** onto the McLaren F1 car's wheel axles. Each tire snaps into place when dropped within 20 px of its target slot (Front-Left, Front-Right, Rear-Left, Rear-Right). A "Box, Box! Perfect Stop!" radio bubble confirms each placement.

### ⛽ Level 2 — Fueling with Love
Click the fuel pump button repeatedly to fill the **Love Tank** from 0% to 100%. The car transitions from grayscale to full McLaren Papaya Orange as fuel rises. A live telemetry overlay shows BPM and gap data styled after real F1 dashboards.

### 🎮 Level 3 — Choose Your Destination
Select a date destination on a replica **Lando Norris steering wheel screen**. Confirm your pick to trigger the iconic **F1 5-light start sequence** — five red lights illuminate one by one, then go dark to signal race start. `onComplete` fires automatically after the sequence.

### 🏆 Podium — Championship Finish
`canvas-confetti` explodes in McLaren Papaya (`#FF8000`) and white particles. A purple sector banner reads **"PURPLE SECTOR: NEW RECORD!"** alongside the Valentine's message and a race-time display. Share or restart from here.

---
