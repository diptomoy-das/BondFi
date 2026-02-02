
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function BondScroll({ containerRef }) {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Mapping scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 124]);

    useEffect(() => {
        let loadedCount = 0;
        const totalFrames = 125;
        const loadedImages = [];

        const loadImages = async () => {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
                        resolve(true);
                    };
                    img.onerror = () => {
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

    const renderFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[index];
        if (!img) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

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
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isLoaded || images.length === 0) return;
        const index = Math.floor(latest);
        requestAnimationFrame(() => renderFrame(index));
    });

    useEffect(() => {
        if (isLoaded && images.length > 0) {
            renderFrame(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, images]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                const currentProgress = frameIndex.get();
                renderFrame(Math.floor(currentProgress));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, images]);

    return (
        <>
            <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />
            <canvas
                ref={canvasRef}
                className="sticky top-0 w-full h-full object-cover z-0 bg-black"
                style={{ position: 'sticky', top: 0, height: '100vh' }}
            />
        </>
    );
}
