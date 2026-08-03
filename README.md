# SignStream

SignStream is an interactive browser-based interface for practicing a focused set of ASL handshapes. It uses your webcam to track one hand, analyze its landmarks in real time, and give immediate feedback as you work through target letters.

**[Try the live demo](https://derinbarutcu17.github.io/Signstream/)**

## What it does

- Shows a target letter with a visual reference guide
- Tracks a single hand through the browser camera
- Detects 21 hand landmarks with MediaPipe Hands
- Classifies handshapes with geometric landmark constraints
- Stabilizes detections to reduce flicker while the hand moves
- Displays recognition feedback and a live accuracy signal
- Currently supports **A, B, D, F, I, L, R, U, V, W, and Y**

SignStream is a learning interface and technical prototype, not a complete ASL translation system.

## How it works

1. The browser requests camera access.
2. MediaPipe Hands tracks the visible hand and returns its landmarks.
3. `GestureLogic` checks finger extension, finger spread, and thumb relationships.
4. The interface waits for a stable detection before changing the recognized letter.
5. The dashboard compares the detected pose with the selected target and updates the feedback UI.

The repository also includes a TensorFlow.js/KNN recognition service for adaptive recognition experiments.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- MediaPipe Hands
- TensorFlow.js and KNN Classifier
- Framer Motion
- react-webcam
- Lucide React

## Run locally

```bash
git clone https://github.com/derinbarutcu17/Signstream.git
cd Signstream
npm install
npm run dev
```

Then open the local URL printed by Vite.

Useful checks:

```bash
npm run build
npm run lint
npm run preview
```

The build command runs TypeScript validation before creating the production bundle.

## Project structure

```text
src/
├── components/dashboard/   # Camera, target, score, and feedback tiles
├── hooks/
│   └── useHandTracking.ts  # MediaPipe camera and detection loop
└── lib/
    ├── GestureLogic.ts      # Landmark-based pose classification
    ├── GestureEngine.ts     # Smoothed landmark and finger-state helpers
    └── RecognitionService.ts # TensorFlow.js/KNN experiments
```

## Tips

- Allow camera access when prompted.
- Use clear lighting and keep one hand visible.
- Hold the target pose steadily for a moment.
- Recognition is most reliable when the hand is fully inside the camera frame.

## License

This project is available under the repository's existing license.
