"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function Overlay() {
    const { scrollYProgress } = useScroll();

    // Opacity transforms for different sections
    const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.30, 0.40, 0.50], [0, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

    // Scale/Blur effects for smooth transitions
    const blur1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [10, 0, 10]);
    const y1 = useTransform(scrollYProgress, [0, 0.25], [20, -20]);

    return (
        <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-center w-full h-full max-w-7xl mx-auto px-6">
            {/* Section 1: Legacy Finance */}
            <motion.div
                style={{ opacity: opacity1, filter: useTransform(blur1, v => `blur(${v}px)`), y: y1 }}
                className="absolute inset-0 flex items-center justify-center flex-col text-center"
            >
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-sans text-white">
                    Legacy Finance.
                </h2>
                <p className="text-xl md:text-2xl font-mono text-text-dim">
                    Paper-bound. Slow. Opaque.
                </p>
            </motion.div>

            {/* Section 2: Dissolution */}
            <motion.div
                style={{ opacity: opacity2 }}
                className="absolute inset-0 flex items-center justify-start pl-[10vw]"
            >
                <div className="max-w-xl">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
                        The Dissolution of Friction.
                    </h2>
                    <p className="text-lg font-mono text-text-dim border-l-2 border-stellar-blue pl-4">
                        Physical barriers break down into <br />
                        digital sovereignty.
                    </p>
                </div>
            </motion.div>

            {/* Section 3: Fractionalized */}
            <motion.div
                style={{ opacity: opacity3 }}
                className="absolute inset-0 flex items-center justify-end pr-[10vw] text-right"
            >
                <div className="max-w-xl">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
                        Fractionalized.<br />
                        <span className="text-stellar-blue">Sovereign.</span><br />
                        Secure.
                    </h2>
                    <div className="flex justify-end gap-2 text-xs font-mono text-stellar-gold">
                        <span>[ LIQUIDITY: UNLOCKED ]</span>
                        <span>[ YIELD: REAL-TIME ]</span>
                    </div>
                </div>
            </motion.div>

            {/* Section 4: Call to Action */}
            <motion.div
                style={{ opacity: opacity4 }}
                className="absolute inset-0 flex items-center justify-center flex-col pointer-events-auto"
            >
                <div className="p-8 border border-white/10 bg-bond-black/80 backdrop-blur-md rounded-lg text-center">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-stellar-blue">
                        BondFi
                    </h1>
                    <p className="text-lg font-mono text-text-dim mb-8">
                        The Future of Debt on Stellar.
                    </p>
                    <button className="px-8 py-3 bg-white text-bond-black font-semibold rounded hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm">
                        Connect Wallet
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
