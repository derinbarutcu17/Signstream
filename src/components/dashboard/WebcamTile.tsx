import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import type { Results } from '@mediapipe/hands';

interface WebcamTileProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    results: Results | null;
    isTrackingReady: boolean;
}

const WebcamTile = ({ videoRef, results, isTrackingReady }: WebcamTileProps) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Connect webcam video element to the passed videoRef
    useEffect(() => {
        const checkVideo = () => {
            if (webcamRef.current?.video) {
                // Mutate the ref to point to the video element
                // eslint-disable-next-line
                (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = webcamRef.current.video;
                console.log('[WebcamTile] Video element connected:', webcamRef.current.video.videoWidth, 'x', webcamRef.current.video.videoHeight);
            }
        };

        // Check immediately and also on interval until connected
        checkVideo();
        const interval = setInterval(() => {
            if (webcamRef.current?.video && webcamRef.current.video.readyState >= 2) {
                checkVideo();
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [videoRef]);

    // Draw hand landmarks on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const video = webcamRef.current?.video;

        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Always match canvas size to video (prevents scaling issues)
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }
        }

        // Always clear the entire canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw landmarks if we have results
        if (results?.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                // Draw connections (bones)
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                    color: '#ef4444',
                    lineWidth: 4,
                });

                // Draw landmarks (joints)
                drawLandmarks(ctx, landmarks, {
                    color: '#ffffff',
                    fillColor: '#ef4444',
                    lineWidth: 2,
                    radius: 5,
                });
            }
        }
    }, [results]);

    return (
        <div className="camera-tile bento-tile bento-tile-active relative bg-black aspect-video min-h-[420px] lg:min-h-0">
            <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="w-full h-full object-cover scale-x-[-1]"
                    videoConstraints={{
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                    }}
                />

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none z-20"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>

            <div className="absolute left-5 right-5 bottom-5 z-20 flex items-end justify-between gap-4 pointer-events-none">
                <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Camera</h2>
                    <p className="text-xs text-zinc-400">
                        {isTrackingReady ? 'Hand tracking active' : 'Starting hand tracking'}
                    </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${isTrackingReady ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-white/5 border-white/8 text-zinc-400'}`}>
                    {isTrackingReady ? 'Live' : 'Loading'}
                </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/75 to-transparent pointer-events-none" />
        </div>
    );
};

export default WebcamTile;
