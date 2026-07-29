import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ReferenceGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const GESTURES = [
    { letter: 'A', name: 'Fist', description: 'Closed fist with thumb against the side of the index finger.' },
    { letter: 'B', name: 'Flat', description: 'Open palm with fingers together and thumb tucked across the palm.' },
    { letter: 'D', name: 'Index', description: 'Index finger points up, others curved to touch the thumb.' },
    { letter: 'F', name: 'Touch', description: 'Index and thumb tips touch, other fingers extended and spread.' },
    { letter: 'I', name: 'Pinky', description: 'Hand in a fist with only the pinky finger extended up.' },
    { letter: 'L', name: 'L-Shape', description: 'Index and thumb extended, forming a "L" shape.' },
    { letter: 'R', name: 'Crossed', description: 'Index and middle fingers extended and crossed.' },
    { letter: 'U', name: 'Together', description: 'Index and middle fingers extended and held together.' },
    { letter: 'V', name: 'Peace', description: 'Index and middle fingers extended and separated.' },
    { letter: 'W', name: 'Three', description: 'Index, middle, and ring fingers extended and spread.' },
    { letter: 'Y', name: 'Hang Loose', description: 'Thumb and pinky extended, other fingers folded.' },
];

const ReferenceGuide: React.FC<ReferenceGuideProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/75 z-100"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl bg-zinc-950 border border-white/10 rounded-lg p-5 md:p-6 z-101 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        <div className="flex justify-between items-center mb-5 shrink-0">
                            <div>
                                <h2 className="text-xl font-semibold text-white">ASL Reference</h2>
                                <p className="text-sm text-zinc-500 mt-1">11 practice letters</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 grid gap-3 md:grid-cols-2">
                            {GESTURES.map((g) => (
                                <div key={g.letter} className="p-4 bg-white/5 border border-white/8 rounded-lg flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-red-500 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl font-black text-zinc-950">{g.letter}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white">{g.name}</h4>
                                        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                                            {g.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between shrink-0 text-xs text-zinc-500">
                            <span>Vector recognition</span>
                            <span>Scroll for more</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


export default ReferenceGuide;
