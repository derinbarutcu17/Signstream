import { useState, useEffect, useRef, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import type { Results } from '@mediapipe/hands';
import { GestureLogic } from '../lib/GestureLogic';

type DetectionData = {
    confidence: number;
    fingerStates: string[];
    handCount: number;
    landmarks: Results['multiHandLandmarks'][number] | null;
    worldLandmarks: Results['multiHandWorldLandmarks'][number] | null;
    bestMatch: string | null;
    similarity: number;
};

const emptyDetectionData: DetectionData = {
    confidence: 0,
    fingerStates: ['Searching...'],
    handCount: 0,
    landmarks: null,
    worldLandmarks: null,
    bestMatch: null,
    similarity: 0,
};

const STABILITY_THRESHOLD = 3;
const TARGET_FRAME_MS = 1000 / 20;

export const useHandTracking = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    const [isReady, setIsReady] = useState(false);
    const [results, setResults] = useState<Results | null>(null);
    const [detectionData, setDetectionData] = useState<DetectionData>(emptyDetectionData);

    // Use refs to persist across re-renders
    const handsRef = useRef<Hands | null>(null);
    const animationRef = useRef<number | null>(null);
    const isRunningRef = useRef(false);
    const isSendingRef = useRef(false);
    const lastFrameTimeRef = useRef(0);

    // Gesture stabilization refs - require consistent detection to switch
    const currentGestureRef = useRef<string | null>(null);
    const pendingGestureRef = useRef<string | null>(null);
    const gestureCountRef = useRef(0);

    // Smoothed accuracy value for less jittery display
    const smoothedSimilarityRef = useRef(0);

    // Stateless gesture logic - no state to track
    const [logic] = useState(() => new GestureLogic());

    // Stable callback for results
    const onResults = useCallback((detectionResults: Results) => {
        setResults(detectionResults);

        // Mark as ready once we receive any results (even without hands)
        if (!isRunningRef.current) {
            setIsReady(true);
            isRunningRef.current = true;
            console.log('[HandTracking] Detection active! Ready for recognition.');
        }

        if (!detectionResults.multiHandWorldLandmarks?.[0]) {
            smoothedSimilarityRef.current = smoothedSimilarityRef.current * 0.9;
            setDetectionData({
                ...emptyDetectionData,
                similarity: smoothedSimilarityRef.current,
            });
            return;
        }

        const worldLandmarks = detectionResults.multiHandWorldLandmarks[0];
        const { match: rawMatch } = logic.analyze(worldLandmarks);

        // Gesture stabilization: require consistent detections before switching.
        let stableMatch = currentGestureRef.current;

        if (rawMatch !== pendingGestureRef.current) {
            pendingGestureRef.current = rawMatch;
            gestureCountRef.current = 1;
        } else {
            gestureCountRef.current++;
        }

        if (gestureCountRef.current >= STABILITY_THRESHOLD) {
            stableMatch = rawMatch;
            currentGestureRef.current = rawMatch;
        }

        const rawConfidence = detectionResults.multiHandedness?.[0]?.score || 0;
        const smoothingFactor = 0.15;
        smoothedSimilarityRef.current = smoothedSimilarityRef.current * (1 - smoothingFactor) + rawConfidence * smoothingFactor;

        setDetectionData({
            confidence: rawConfidence,
            fingerStates: stableMatch ? [`Detected: ${stableMatch}`] : ['Analyzing...'],
            handCount: detectionResults.multiHandLandmarks?.length || 0,
            landmarks: detectionResults.multiHandLandmarks?.[0] || null,
            worldLandmarks,
            bestMatch: stableMatch,
            similarity: smoothedSimilarityRef.current,
        });
    }, [logic]);


    // Initialize MediaPipe only once
    useEffect(() => {
        // Skip if already initialized
        if (handsRef.current) {
            console.log('[HandTracking] Already initialized, skipping...');
            return;
        }

        console.log('[HandTracking] Initializing MediaPipe Hands...');

        const hands = new Hands({
            locateFile: (file) => {
                console.log('[HandTracking] Loading:', file);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 0,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        console.log('[HandTracking] MediaPipe initialized');

        // Cleanup only on actual unmount
        return () => {
            console.log('[HandTracking] Cleanup called');
            hands.close();
            handsRef.current = null;
        };
    }, [onResults]);

    // Detection loop - separate effect
    useEffect(() => {
        const runLoop = async () => {
            const video = videoRef.current;
            const hands = handsRef.current;
            const now = performance.now();

            if (
                video &&
                hands &&
                !isSendingRef.current &&
                now - lastFrameTimeRef.current >= TARGET_FRAME_MS &&
                video.readyState >= 2 &&
                video.videoWidth > 0
            ) {
                try {
                    isSendingRef.current = true;
                    lastFrameTimeRef.current = now;
                    await hands.send({ image: video });
                } catch {
                    // Silently ignore errors during detection
                } finally {
                    isSendingRef.current = false;
                }
            }

            animationRef.current = requestAnimationFrame(runLoop);
        };

        // Start loop after a short delay to let video initialize
        const startLoop = () => {
            console.log('[HandTracking] Starting detection loop...');
            runLoop();
        };

        const timer = setTimeout(startLoop, 500);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [videoRef]);

    // Keyboard listener for calibration (Spacebar logs current detection)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && detectionData.worldLandmarks) {
                e.preventDefault();
                console.log('=== CALIBRATION TRIGGERED ===');
                console.log(`Current: ${detectionData.bestMatch} (${(detectionData.similarity * 100).toFixed(0)}%)`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [detectionData]);

    return {
        isReady,
        results,
        detectionData,
    };
};
