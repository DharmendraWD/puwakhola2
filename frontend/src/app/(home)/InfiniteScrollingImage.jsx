
"use client";
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import img1 from "../../../public/img/proj/11.png";
import img2 from "../../../public/img/proj/2.jpeg";
import img3 from "../../../public/img/proj/3.jpeg";
import img4 from "../../../public/img/proj/4.jpeg";
import img5 from "../../../public/img/proj/5.jpeg";
import img6 from "../../../public/img/proj/6.jpeg";
import Image from 'next/image';


// --- Configuration ---
const DURATION = 35; // seconds for one full loop (slower for stability)
const IMAGE_WIDTH_PX = 250; 
const GAP_PX = 16; // gap-4

const images = [
    img1.src,
    img2.src,
    img3.src,
    img4.src,
    img5.src,
    img6.src
];

// To ensure the carousel is always full and smooth during the reset, 
// we triple the image array.
const carouselImages = [...images, ...images, ...images]; 

// Calculate the width of one full set of original images (6 images + 5 gaps)
const SINGLE_SET_WIDTH_PX = (IMAGE_WIDTH_PX * images.length) + (GAP_PX * (images.length - 1));

// The total width of the motion.div (3 sets of images + 2*5 gaps)
const CONTAINER_WIDTH_PX = (SINGLE_SET_WIDTH_PX * 3) + (GAP_PX * 2);
// ----------------------

const ImageCard = ({ src, alt, width, height }) => (
    <div 
        className="flex-shrink-0 rounded-xl shadow-lg overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
    >
        <Image
            width={width}
            height={height}
            
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
        />
    </div>
);

const SameDirectionScrollCarousel = () => {
    const controlsTop = useAnimation();
    const controlsBottom = useAnimation();
    const [isHovering, setIsHovering] = useState(false);

    // 1. Define Animation Variants (Same direction for both)
    const scrollVariants = {
        scroll: {
            // Move left by the width of exactly ONE set of images.
            // When it reaches this point, the second set fills the space, and 
            // the transition loops back to the start (0).
            x: `-${SINGLE_SET_WIDTH_PX}px`, 
            transition: {
                x: {
                    type: 'tween',
                    ease: 'linear',
                    duration: DURATION,
                    repeat: Infinity,
                },
            },
        },
        paused: {
            // Keeps the animation at its current position
            transition: {
                duration: 0,
            },
        }
    };

    // 2. Start both animations when the component mounts
    useEffect(() => {
        // We start the bottom row slightly offset in its sequence 
        // to make the two rows look less repetitive initially.
        controlsTop.start('scroll');
        controlsBottom.start('scroll'); 
    }, [controlsTop, controlsBottom]);

    // 3. Handle Hover Events
    const handleMouseEnter = () => {
        setIsHovering(true);
        controlsTop.stop();
        controlsBottom.stop();
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        controlsTop.start('scroll');
        controlsBottom.start('scroll');
    };

    return (
        <div 
            className="w-full overflow-hidden py-10 bg-white"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col gap-6">

                {/* --- Row 1: Leftward Scroll --- */}
                <motion.div
                    className="flex flex-row gap-4"
                    style={{ width: `${CONTAINER_WIDTH_PX}px` }} 
                    variants={scrollVariants}
                    animate={isHovering ? 'paused' : controlsTop}
                >
                    {carouselImages.map((src, index) => (
                        <ImageCard 
                            key={`top-${index}`} 
                            src={src} 
                            alt={`Top Scroll Image ${index + 1}`} 
                            width={IMAGE_WIDTH_PX} 
                            height={160} 
                        />
                    ))}
                </motion.div>

                {/* --- Row 2: Leftward Scroll --- */}
                <motion.div
                    className="flex flex-row gap-4"
                    style={{ 
                        width: `${CONTAINER_WIDTH_PX}px`,
                        // Apply a slight initial offset to the second row for a varied look
                        transform: `translateX(-${IMAGE_WIDTH_PX * 1.5}px)`
                    }}
                    variants={scrollVariants}
                    animate={isHovering ? 'paused' : controlsBottom}
                >
                    {/* Optionally reverse the images for the second row */}
                    {carouselImages.slice().reverse().map((src, index) => (
                        <ImageCard 
                            key={`bottom-${index}`} 
                            src={src} 
                            alt={`Bottom Scroll Image ${index + 1}`} 
                            width={IMAGE_WIDTH_PX} 
                            height={160} 
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SameDirectionScrollCarousel;