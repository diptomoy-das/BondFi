
import React, { useRef } from 'react';
import { LandingPage } from './LandingPage';
import BondScroll from '../components/BondScroll';
import Overlay from '../components/Overlay';

export function IntroLandingPage() {
    const containerRef = useRef(null);

    return (
        <div className="relative bg-black">
            {/* Scroll Animation Section covering 1500vh */}
            <div ref={containerRef} className="relative h-[1500vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <BondScroll containerRef={containerRef} />
                    <Overlay containerRef={containerRef} />
                </div>
            </div>

            {/* Main Landing Page Content */}
            <div className="relative z-20 bg-black">
                <LandingPage />
            </div>
        </div>
    );
}
