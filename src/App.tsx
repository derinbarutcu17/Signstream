import { useState, useRef } from 'react';
import WebcamTile from './components/dashboard/WebcamTile';
import GoalTile from './components/dashboard/GoalTile';
import FeedbackTile from './components/dashboard/FeedbackTile';
import ScoreTile from './components/dashboard/ScoreTile';
import { useHandTracking } from './hooks/useHandTracking';
import ReferenceGuide from './components/dashboard/ReferenceGuide';

const ALPHABET = ['A', 'B', 'D', 'F', 'I', 'L', 'R', 'U', 'V', 'W', 'Y'];

const INSTRUCTIONS: Record<string, string> = {
  'A': 'Thumb on the side of a closed fist.',
  'B': 'All fingers straight up, thumb tucked across palm.',
  'D': 'Index finger up, others touching thumb.',
  'F': 'Index and thumb touching, other fingers up.',
  'I': 'Pinky finger straight up, others closed.',
  'L': 'Index and thumb extended (forming an L).',
  'R': 'Index and middle fingers crossed.',
  'U': 'Index and middle fingers up and touching.',
  'V': 'Index and middle fingers in a "V" shape.',
  'W': 'Index, middle, and ring fingers up and spread.',
  'Y': 'Thumb and pinky extended.',
};

function App() {
  const [targetIndex, setTargetIndex] = useState(0);
  const [score] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  // Hand tracking hook - now includes GestureLogic recognition
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isReady, results, detectionData } = useHandTracking(videoRef);

  const targetLetter = ALPHABET[targetIndex];
  const handleNext = () => setTargetIndex(prev => (prev + 1) % ALPHABET.length);
  const handlePrev = () => setTargetIndex(prev => (prev - 1 + ALPHABET.length) % ALPHABET.length);
  const displayedLetter = detectionData.bestMatch;
  const displayedAccuracy = displayedLetter === targetLetter
    ? Math.round(detectionData.confidence * 100)
    : 0;

  return (
    <main className="h-dvh w-dvw bg-zinc-950 flex flex-col font-sans">
      <ReferenceGuide isOpen={isReferenceOpen} onClose={() => setIsReferenceOpen(false)} />

      <div className="flex-1 dashboard-grid w-full px-6 py-7 md:px-10 md:py-9 overflow-y-auto">
        <WebcamTile
          videoRef={videoRef}
          results={results}
          isTrackingReady={isReady}
        />

        <div className="dashboard-sidebar">
          <GoalTile
            targetLetter={targetLetter}
            detectedLetter={displayedLetter}
            onOpenReference={() => setIsReferenceOpen(true)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
          <div className="dashboard-bottom">
            <ScoreTile
              score={displayedAccuracy}
              totalScore={score}
            />
            <FeedbackTile
              confidence={detectionData.confidence}
              instruction={INSTRUCTIONS[targetLetter]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
