
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ progress, isLoaded }) {
    return (
        <AnimatePresence>
            {!isLoaded && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
                >
                    <div className="w-64 space-y-4">
                        <div className="flex justify-between text-xs font-mono text-gray-400">
                            <span>INITIALIZING SECURE CONNECTION</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-800 overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                        <div className="text-center text-[10px] font-mono text-white/40 tracking-widest">
                            BONDFI PROTOCOL V1.0
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
