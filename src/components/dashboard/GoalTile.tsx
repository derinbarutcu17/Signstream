import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface GoalTileProps {
    targetLetter: string;
    detectedLetter: string | null;
    onOpenReference?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const GoalTile: React.FC<GoalTileProps> = ({ targetLetter, detectedLetter, onOpenReference, onNext, onPrev }) => {
    const isCorrect = detectedLetter === targetLetter;

    return (
        <div className="bento-tile flex flex-col p-5 md:p-6 min-h-0">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <span className="text-xs text-zinc-500">Current challenge</span>
                    <h3 className="text-base font-semibold text-white tracking-tight">Match the letter</h3>
                </div>
                <button
                    onClick={onOpenReference}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Gesture Reference Guide"
                >
                    <HelpCircle size={18} />
                </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-6 min-w-0">
                <button
                    onClick={onPrev}
                    className="shrink-0 p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex items-center justify-center gap-4 md:gap-10 min-w-0 flex-1">
                    <div className="relative text-center">
                        <span className="block text-xs text-zinc-500 mb-2">Target</span>
                    <span className="block text-[clamp(2.75rem,7vw,4rem)] font-black text-red-400 select-none leading-none">
                            {targetLetter}
                        </span>
                    </div>

                    <div className="h-16 w-px bg-white/10 shrink-0" />

                    <div className="relative text-center">
                        <span className="block text-xs text-zinc-500 mb-2">Detected</span>
                    <span className={`block text-[clamp(2.75rem,7vw,4rem)] font-black select-none leading-none ${isCorrect ? 'text-green-400' : 'text-zinc-600'}`}>
                            {detectedLetter || '?'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="shrink-0 p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className={`shrink-0 py-3 px-4 rounded-lg border text-center ${isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/8'}`}>
                <p className={`text-xs ${isCorrect ? 'text-green-300 font-medium' : 'text-zinc-400'}`}>
                    {isCorrect ? 'Good match' : 'Adjust your hand'}
                </p>
            </div>
        </div>
    );
};


export default GoalTile;
