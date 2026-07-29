import React from 'react';

interface ScoreTileProps {
    score: number;
    totalScore?: number;
}

const ScoreTile: React.FC<ScoreTileProps> = ({ score, totalScore = 0 }) => {
    const percentage = Math.min(Math.max(score, 0), 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;

    return (
        <div className="bento-tile p-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center shrink-0">
                <div className="border-l-2 border-red-500 pl-3">
                    <span className="text-xs text-zinc-500">Match</span>
                    <h3 className="text-base font-semibold text-white tracking-tight">Accuracy</h3>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center py-3 min-h-0">
                <div className="relative rounded-full bg-red-500/5 p-1">
                    <svg
                        viewBox="0 0 100 100"
                        className="w-[clamp(88px,28vw,112px)] h-[clamp(88px,28vw,112px)] transform -rotate-90"
                    >
                        <circle
                            cx="50" cy="50" r="45"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-red-500/20"
                        />
                        <circle
                            cx="50" cy="50" r="45"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-red-500 transition-all duration-300 ease-out"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl md:text-3xl font-bold text-white leading-none tabular-nums whitespace-nowrap">
                            {percentage}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="shrink-0 flex justify-between items-center text-xs pt-3 border-t border-white/8">
                <span className="text-zinc-500">Matches <span className="text-zinc-300 font-medium">{totalScore}</span></span>
                <span className="text-zinc-400">{percentage > 80 ? 'Strong' : percentage > 50 ? 'Close' : 'Waiting'}</span>
            </div>
        </div>
    );
};

export default ScoreTile;
