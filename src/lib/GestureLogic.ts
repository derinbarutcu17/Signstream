// src/lib/GestureLogic.ts
// Gesture recognition using geometric constraints
import { VectorMath } from './VectorMath';
import type { Point3D } from './VectorMath';

type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
type CurlState = Record<FingerName, boolean>; // true = extended/open

export class GestureLogic {

    public analyze(landmarks: Point3D[]): { match: string | null; score: number } {
        if (landmarks.length < 21) return { match: null, score: 0 };

        // Get all the measurements we need
        const ext = this.getExtensions(landmarks);
        const spread = this.getFingerSpread(landmarks);
        const thumbIndexTouching = this.isThumbIndexTouching(landmarks);

        // Count extended fingers (excluding thumb)
        const fingerCount = [ext.index, ext.middle, ext.ring, ext.pinky].filter(Boolean).length;

        // === DETECTION LOGIC (most specific first) ===

        // F = Thumb and index touching/curled, middle+ring+pinky extended
        // Check this BEFORE 4-finger check since it's more specific
        if (thumbIndexTouching && ext.middle && ext.ring && ext.pinky) {
            return { match: 'F', score: 1.0 };
        }

        // FOUR FINGERS = B (flat hand)
        if (fingerCount === 4) {
            return { match: 'B', score: 1.0 };
        }

        // THREE FINGERS
        if (fingerCount === 3) {
            // Index + Middle + Ring = W
            if (ext.index && ext.middle && ext.ring && !ext.pinky) {
                return { match: 'W', score: 1.0 };
            }
            // Middle + Ring + Pinky (no index) = could also be F, but caught above
        }

        // TWO FINGERS
        if (fingerCount === 2) {
            // Index + Middle (V, U, R)
            if (ext.index && ext.middle && !ext.ring && !ext.pinky) {
                // R = crossed fingers (very tight spread)
                if (spread < 0.8) {
                    return { match: 'R', score: 1.0 };
                }
                // V = spread apart
                else if (spread > 1.5) {
                    return { match: 'V', score: 1.0 };
                }
                // U = together but not crossed
                else {
                    return { match: 'U', score: 1.0 };
                }
            }
        }

        // ONE FINGER
        if (fingerCount === 1) {
            // Pinky only
            if (ext.pinky && !ext.ring && !ext.middle && !ext.index) {
                // Y = thumb also extended, I = just pinky
                return { match: ext.thumb ? 'Y' : 'I', score: 1.0 };
            }
            // Index only
            // L = thumb ALSO extended (L-shape with thumb + index)
            // D = just index pointing up (no thumb extended)
            if (ext.index && !ext.middle) {
                return { match: ext.thumb ? 'L' : 'D', score: 1.0 };
            }
        }

        // FIST (no fingers extended) - always A
        // (S and E removed - too similar and unreliable to detect)
        if (fingerCount === 0) {
            return { match: 'A', score: 1.0 };
        }

        return { match: null, score: 0 };
    }

    // Check if each finger is extended
    private getExtensions(lm: Point3D[]): CurlState {
        const wrist = lm[0];

        const isExtended = (tipIdx: number, mcpIdx: number) => {
            const tipDist = VectorMath.dist(lm[tipIdx], wrist);
            const mcpDist = VectorMath.dist(lm[mcpIdx], wrist);
            return tipDist > mcpDist * 1.2;
        };

        // Thumb: check if tip is far from index base
        // Made more lenient (0.5 instead of 0.7) for easier Y gesture detection
        const thumbExtended = () => {
            const thumbTip = lm[4];
            const indexMcp = lm[5];
            const tipToIndex = VectorMath.dist(thumbTip, indexMcp);
            const wristToIndex = VectorMath.dist(wrist, indexMcp);
            return tipToIndex > wristToIndex * 0.5;
        };

        return {
            thumb: thumbExtended(),
            index: isExtended(8, 5),
            middle: isExtended(12, 9),
            ring: isExtended(16, 13),
            pinky: isExtended(20, 17),
        };
    }

    // Check if thumb and index finger tips are touching/close (for F gesture)
    private isThumbIndexTouching(lm: Point3D[]): boolean {
        const thumbTip = lm[4];
        const indexTip = lm[8];
        const indexMcp = lm[5];
        const middleMcp = lm[9];

        const tipDistance = VectorMath.dist(thumbTip, indexTip);
        const fingerBaseDist = VectorMath.dist(indexMcp, middleMcp);

        // Tips are "touching" if they're closer than the distance between finger bases
        // Using 1.8x multiplier for more lenient detection (F gesture)
        return tipDistance < fingerBaseDist * 1.8;
    }

    // Get spread ratio between index and middle fingers
    private getFingerSpread(lm: Point3D[]): number {
        const indexTip = lm[8];
        const middleTip = lm[12];
        const indexMcp = lm[5];
        const middleMcp = lm[9];

        const tipDist = VectorMath.dist(indexTip, middleTip);
        const mcpDist = VectorMath.dist(indexMcp, middleMcp);

        return mcpDist > 0 ? tipDist / mcpDist : 0;
    }
}
