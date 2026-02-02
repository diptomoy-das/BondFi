"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function BondScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const { scrollYProgress } = useScroll();

    // Map scroll progress (0 to 1) to frame index (0 to 124)
    // We have frames up to 125, so index 0-124
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 124]);

    useEffect(() => {
        let loadedCount = 0;
        const totalFrames = 125;
        const loadedImages: HTMLImageElement[] = [];

        const loadImages = async () => {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                // Construct filename: ezgif-frame-001.jpg, etc.
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
                        resolve(true);
                    };
                    img.onerror = () => {
                        // Continue even if one fails, maybe log it
                        console.error(`Failed to load frame ${i}`);
                        resolve(true);
                    };
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[index];
        if (!img) return;

        // Draw image to cover the canvas while maintaining aspect ratio
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

        if (canvasRatio > imgRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        } else {
            drawWidth = canvasHeight * imgRatio;
            drawHeight = canvasHeight;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Add a slight glow/bloom effect for the "Void" aesthetic if it's the digital part
        // This is optional and can be expensive, keeping it simple for now or adding filter
        // ctx.filter = "contrast(1.1) brightness(1.1)"; 

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isLoaded || images.length === 0) return;
        const index = Math.floor(latest);
        requestAnimationFrame(() => renderFrame(index));
    });

    // Initial draw
    useEffect(() => {
        if (isLoaded && images.length > 0) {
            renderFrame(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Redraw current frame
                const currentProgress = frameIndex.get();
                renderFrame(Math.floor(currentProgress));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Init size

        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, images]);

    return (
        <>
            <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full object-cover z-0 bg-bond-black"
            />
        </>
    );
}
