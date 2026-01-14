"use client";

import { Button } from "@/components/ui/button";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";
import type { HeroContent } from "@/types/content";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface HeroProps {
    data: HeroContent;
}

export default function Hero({ data }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleScrollTo = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            const yOffset = -100;
            const y =
                section.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const backgroundImages = data.backgroundImages;

    useEffect(() => {
        const animateTransition = () => {
            const current = bgRefs.current[currentIndex];
            const nextIndex = (currentIndex + 1) % backgroundImages.length;
            const next = bgRefs.current[nextIndex];

            if (!current || !next) return;

            gsap.set(next, { opacity: 0, scale: 1.1, xPercent: 5, zIndex: 1 });
            gsap.set(current, { zIndex: 2 });

            const tl = gsap.timeline({
                onComplete: () => setCurrentIndex(nextIndex),
            });

            tl.to(current, {
                duration: 15,
                xPercent: -6,
                ease: "none",
            })
                .to(
                    current,
                    {
                        duration: 2,
                        opacity: 0,
                        ease: "power2.out",
                    },
                    "-=1.8"
                )
                .to(
                    next,
                    {
                        duration: 1,
                        opacity: 1,
                        ease: "power2.out",
                    },
                    "<"
                );
        };

        const interval = setInterval(animateTransition, 1000);

        gsap.set(bgRefs.current[currentIndex], {
            opacity: 1,
            scale: 1.1,
            xPercent: 5,
        });

        return () => clearInterval(interval);
    }, [currentIndex, backgroundImages.length]);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsMounted(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <section id="hero" className="bg-[#3E4247] overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
            {backgroundImages.map((src, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        bgRefs.current[i] = el;
                    }}
                    className={clsx(
                        "absolute inset-0 bg-cover bg-center scale-[1.1] bg-no-repeat transition-all duration-1000 ease-out",
                        "will-change-transform will-change-opacity",
                        isMounted ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                    )}
                    style={{
                        backgroundImage: `url(${src})`,
                        opacity: i === currentIndex ? 1 : 0,
                    }}
                />
            ))}
            </div>

            <div className="relative min-h-screen flex flex-col z-10 justify-center px-4 py-16 md:h-[108vh] lg:py-0">
                <div className="max-w-[1428.1px] mx-auto w-full sm:px-6 min-[1536px]:px-6 min-[1537px]:px-0 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="lg:text-left">
                            <h1
                                className={
                                    spaceGrotesk.className +
                                    " text-4xl min-[1536px]:text-[60px] min-[1537px]:text-[66px] text-white font-light pb-8 leading-tight"
                                }
                            >
                                {data.title.line1}
                                <br />
                                {data.title.line2}
                                <br />
                                <span className="block font-bold">
                                    {data.title.line3}
                                    <br />
                                </span>
                                <span className="block font-bold">
                                    {data.title.line4}
                                </span>
                            </h1>

                            <p className="text-[18px] lg:text-[22px] text-[#d9d9d9] leading-relaxed pb-10 whitespace-normal">
                                {data.subtitle}
                            </p>

                            <Button 
                                onClick={() => handleScrollTo("contato")}
                                className="bg-white text-[#181C20] text-lg hover:bg-[#d9d9d9] rounded-none font-medium px-10 py-8"
                            >
                                {data.ctaButton}
                            </Button>
                        </div>

                        <div className="hidden lg:flex justify-end lg:justify-end self-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/gifs/hero-decorative.gif"
                                alt="Elemento decorativo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section
                id="features"
                className="max-w-6xl mx-auto relative z-20 -mt-24 px-4"
            >
                <div className="flex flex-col lg:flex-row">
                    {data.services.map((service, index) => (
                        <div 
                            key={service.id} 
                            className="px-8 pt-10 pb-8 text-white flex-1"
                            style={{ backgroundColor: service.color }}
                        >
                            <div className="mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={service.icon}
                                    alt={`${service.title} Icon`}
                                    className="w-11 h-11"
                                />
                            </div>
                            <h3
                                className={
                                    spaceGrotesk.className +
                                    " mb-4 text-[20px] lg:text-[22px] leading-[32px] font-semibold"
                                }
                            >
                                {service.title}
                            </h3>
                            <p className="text-[16px] lg:text-[16px] leading-relaxed mb-6 whitespace-normal">
                                {service.description}
                            </p>
                            {service.ctaText && (
                                <button
                                    onClick={() => handleScrollTo("contato")}
                                    className={
                                        spaceGrotesk.className +
                                        " text-white border-b border-white pb-1 text-[18px] hover:opacity-80 transition-opacity"
                                    }
                                >
                                    {service.ctaText}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}
