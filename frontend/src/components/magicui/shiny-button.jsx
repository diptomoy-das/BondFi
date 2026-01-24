"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps = {
    initial: { "--x": "100%", scale: 0.8 },
    animate: { "--x": "-100%", scale: 1 },
    whileTap: { scale: 0.95 },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: "spring",
            stiffness: 200,
            damping: 5,
            mass: 0.5,
        },
    },
};

const ShinyButton = ({ text = "shiny-button", className, ...props }) => {
    return (
        <motion.button
            {...animationProps}
            {...props}
            className={cn(
                "relative rounded-lg px-6 py-2 font-mono font-bold backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#ffffff20,#ffffff20)]",
                "border border-white/10 shadow-glow-sm hover:shadow-glow-md",
                className,
            )}
        >
            <span
                className="relative block size-full text-sm uppercase tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]"
                style={{
                    maskImage:
                        "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
                }}
            >
                {text}
            </span>
            <span
                style={{
                    mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
                    maskComposite: "exclude",
                }}
                className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(255,255,255,0.1)_calc(var(--x)+20%),rgba(16,185,129,0.5)_calc(var(--x)+25%),rgba(255,255,255,0.1)_calc(var(--x)+100%))] p-px"
            ></span>
        </motion.button>
    );
};

export default ShinyButton;