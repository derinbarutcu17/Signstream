import React from 'react';

interface FeedbackTileProps {
    confidence: number;
    instruction?: string;
}

const FeedbackTile: React.FC<FeedbackTileProps> = ({ confidence, instruction }) => {
    const confidencePercent = Math.round(confidence * 100);

    return (
        <div className="bento-tile p-4 flex flex-col min-h-0 overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4 shrink-0">
                <div className="border-l-2 border-amber-400 pl-3">
                    <span className="text-xs text-zinc-500">Guide</span>
                    <h3 className="text-base font-semibold text-white tracking-tight">Hand position</h3>
                </div>
                <span className="text-xs text-zinc-500 tabular-nums">{confidencePercent}%</span>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-6 min-h-0">
                <div className="p-4 bg-amber-400/5 rounded-lg border border-amber-400/15">
                    <span className="text-xs text-zinc-500 block mb-2">How to sign</span>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                        {instruction || 'Select a letter to see instructions.'}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Tracking stability</span>
                        <span className={confidencePercent > 50 ? 'text-green-300' : 'text-zinc-500'}>{confidencePercent}%</span>
                    </div>
                    <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${confidencePercent}%` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FeedbackTile;
